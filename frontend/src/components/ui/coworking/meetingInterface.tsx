"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faLaptop,
  faPhone,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons"
import { format } from "date-fns"

import {
  checkRoomExists,
  joinRoom,
  subscribeToMessages,
  subscribeToParticipants,
  sendMessage,
  leaveRoom,
  type Room,
  type Participant,
} from "@/lib/rooms"

interface MeetingInterfaceProps {
  roomId: string
}

interface User {
  id: string
  email: string
  name: string
}

export default function MeetingInterface({ roomId }: MeetingInterfaceProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat")
  const [input, setInput] = useState("")
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [joined, setJoined] = useState(false)
  const [joining, setJoining] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [room, setRoom] = useState<Room | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rtc = useRef<any>({ client: null, localAudioTrack: null, localVideoTrack: null })

  const emojiOptions = ["😀", "😂", "😍", "😎", "😭", "😡", "👍", "🙏"]

  useEffect(() => {
    // Get initial mic/camera state from URL params
    const micParam = searchParams.get("mic")
    const cameraParam = searchParams.get("camera")

    if (micParam) setIsMicOn(micParam === "on")
    if (cameraParam) setIsCameraOn(cameraParam === "on")
  }, [searchParams])

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Get user session
        const res = await fetch("/api/session")
        const data = await res.json()

        if (!data.user?.id) {
          setError("Please log in to join the meeting")
          return
        }

        const userData = {
          id: data.user.id.toString(),
          email: data.user.email || "unknown@example.com",
          name: data.user.name || "Unknown User",
        }
        setUser(userData)

        // Check if room exists
        const roomData = await checkRoomExists(roomId)
        if (!roomData) {
          setError("Room not found")
          return
        }
        setRoom(roomData)

        // Initialize Agora
        const AgoraRTC = require("agora-rtc-sdk-ng")
        rtc.current.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })

        // Join the room
        await joinRoomHandler(userData)
      } catch (error) {
        console.error("Initialization error:", error)
        setError("Failed to initialize meeting")
      }
    }

    initializeSession()
  }, [roomId])

  useEffect(() => {
    if (!roomId) return

    const unsubMessages = subscribeToMessages(roomId, setMessages)
    const unsubParticipants = subscribeToParticipants(roomId, setParticipants)

    return () => {
      unsubMessages()
      unsubParticipants()
    }
  }, [roomId])

  useEffect(() => {
    const manageStream = async () => {
      if (!isMicOn && !isCameraOn) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
          if (localVideoRef.current) localVideoRef.current.srcObject = null
        }
        return
      }

      try {
        const constraints = {
          video: isCameraOn,
          audio: isMicOn,
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }

        streamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (e) {
        console.error("Could not get media", e)
        setError("Failed to access camera/microphone")
      }
    }

    manageStream()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isMicOn, isCameraOn])

  const joinRoomHandler = async (userData: User) => {
  const client = rtc.current.client
  const state = client?.connectionState

  if (joining || joined || state === "CONNECTED" || state === "CONNECTING") {
    console.warn("Join aborted: already joining or connected")
    return
  }

  setJoining(true)

  try {
    const success = await joinRoom(roomId, userData.id, userData.email, userData.name)
    if (!success) {
      setError("Failed to join room. You may not have permission.")
      return
    }

    const AgoraRTC = require("agora-rtc-sdk-ng")
    
    await client.join("fd0e77a2c15f4c53af85276a8910ed8a", roomId, null)

    rtc.current.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
    rtc.current.localVideoTrack = await AgoraRTC.createCameraVideoTrack()

    if (localVideoRef.current) {
      rtc.current.localVideoTrack.play(localVideoRef.current)
    }

    await client.publish([rtc.current.localAudioTrack, rtc.current.localVideoTrack])
client.on("user-published", async (user: any, mediaType: any) => {
  try {
    await client.subscribe(user, mediaType)

    if (mediaType === "video" && remoteVideoRef.current && user.videoTrack) {
      user.videoTrack.play(remoteVideoRef.current)
    }

    if (mediaType === "audio" && user.audioTrack) {
      user.audioTrack.play()
    }
  } catch (error) {
    console.warn("Failed to subscribe to remote user:", error)
  }
})



    client.on("user-unpublished", (user: any) => {
      console.log("User unpublished:", user)
    })

    setJoined(true)
  } catch (err) {
    console.error("Join room error:", err)
    setError("Failed to join the meeting")
  } finally {
    setJoining(false)
  }
}


  const leaveRoomHandler = async () => {
    try {
      if (user) {
        await leaveRoom(roomId, user.id)
      }

      rtc.current.localAudioTrack?.close()
      rtc.current.localVideoTrack?.close()
      await rtc.current.client?.leave()

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      setJoined(false)
      router.push("/coworking")
    } catch (error) {
      console.error("Error leaving room:", error)
    }
  }

  const toggleMic = () => {
    const track = rtc.current.localAudioTrack
    if (track) {
      track.setEnabled(!isMicOn)
      setIsMicOn(!isMicOn)
    }
  }

  const toggleCamera = () => {
    const track = rtc.current.localVideoTrack
    if (track) {
      track.setEnabled(!isCameraOn)
      setIsCameraOn(!isCameraOn)
    }
  }

  const toggleRecording = () => setIsRecording(!isRecording)

  const handleSendMessage = async () => {
    if (!input.trim() || !user) return

    try {
      await sendMessage(roomId, input, user.id, user.name)
      setInput("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/coworking")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    )
  }

  if (joining) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Joining meeting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Video Section */}
      <div className="flex-1/3 flex flex-col p-3">
        <div className="bg-gradient-to-r from-blue-800 to-blue-950 text-white p-4 rounded-3xl mb-4">
          <h1 className="text-xl font-bold">{room?.name || "Meeting Room"}</h1>
          <p className="text-sm opacity-75">{room?.objective}</p>
        </div>

        <div className="bg-white p-4 shadow-xl rounded-3xl flex flex-col items-center space-y-8 flex-1">
          <div className="relative w-full h-150  bg-gray-200 rounded-lg overflow-hidden">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-150 object-cover" />
            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
                Camera is off
              </div>
            )}

            {/* Remote video overlay */}
            <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden">
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex space-x-4 space-y-2">
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full ${isMicOn ? "bg-green-500" : "bg-red-500"} text-white hover:opacity-80`}
            >
              <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} className="w-6 h-6" />
            </button>
            <button
              onClick={toggleCamera}
              className={`p-3 rounded-full ${isCameraOn ? "bg-green-500" : "bg-red-500"} text-white hover:opacity-80`}
            >
              <FontAwesomeIcon icon={isCameraOn ? faVideo : faVideoSlash} className="w-6 h-6" />
            </button>
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-full ${isRecording ? "bg-red-600" : "bg-gray-400"} text-white hover:opacity-80`}
            >
              <FontAwesomeIcon icon={faLaptop} className="w-6 h-6" />
            </button>
            <button
              onClick={leaveRoomHandler}
              className="w-12 h-12 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700"
            >
              <FontAwesomeIcon icon={faPhone} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat/Participants Section */}
      <div className="flex-1 flex flex-col h-full pt-0 p-4 bg-gray-100">
        <div className="flex justify-between mt-4 mb-4 bg-white rounded-full overflow-hidden shadow">
          <button
            onClick={() => setActiveTab("chat")}
            className={`w-1/2 py-2 font-semibold ${activeTab === "chat" ? "bg-gradient-to-br from-blue-800 to-blue-950 text-white" : "text-black"}`}
          >
            Room Chat
          </button>
          <button
            onClick={() => setActiveTab("participants")}
            className={`w-1/2 py-2 font-semibold ${activeTab === "participants" ? "bg-gradient-to-r from-blue-800 to-blue-950 text-white" : "text-black"}`}
          >
            Participants 
          </button>
        </div>

        <div className="relative flex-1 bg-white shadow-md rounded-3xl overflow-hidden text-black">
          <AnimatePresence mode="wait">
            {activeTab === "chat" ? (
              <motion.div
                key="chat"
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                exit={{ x: -100 }}
                transition={{ duration: 0.4 }}
                className="absolute top-0 left-0 w-full h-full p-4 overflow-y-auto"
              >
                <div className="space-y-4">
                  {messages.length ? (
                    messages.map((msg, index) => {
                      const msgTime = msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000) : new Date()
                      const isOwnMessage = msg.senderId === user?.id

                      return (
                        <div key={msg.id || index} className={`${isOwnMessage ? "text-right" : "text-left"}`}>
                          <p className="text-sm text-gray-500 mb-1">
                            {isOwnMessage ? "You" : msg.senderName}
                            <span className="text-xs text-gray-400 ml-2">{format(msgTime, "hh:mm a")}</span>
                          </p>
                          <div
                            className={`inline-block px-3 py-2 rounded-xl max-w-xs ${
                              isOwnMessage ? "bg-gradient-to-r from-blue-800 to-blue-950 opacity-90 shadow-2xl text-white" : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center text-gray-400 py-20">No conversation yet. Start it ✨</div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="participants"
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                exit={{ x: -100 }}
                transition={{ duration: 0.4 }}
                className="absolute top-0 left-0 w-full h-full p-4"
              >
                <h2 className="text-xl font-bold mb-4">Participants</h2>
                {participants.length ? (
                  <div className="space-y-2">
                    {participants.map((p,index) => (
                      <div key={`${p.id}-${index}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                        <FontAwesomeIcon icon={faUserCircle} className="text-2xl text-gray-500" />
                        <div>
                          <span className="font-medium">{p.name}</span>
                          <p className="text-sm text-gray-500">{p.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-20">
                    No participants yet. Waiting for others to join 👀
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Message Input */}
        <div className="mt-4 relative">
          <div className="flex items-center text-gray-600 bg-white rounded-full px-4 py-2 shadow">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message here..."
              className="flex-1 outline-none bg-transparent"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Select onValueChange={(emoji) => setInput((prev) => prev + emoji)}>
              <SelectTrigger className="w-10 text-2xl px-0 justify-center mr-2 border-none">
                <SelectValue placeholder="😊" />
              </SelectTrigger>
              <SelectContent className="max-h-40 overflow-y-auto">
                {emojiOptions.map((emoji, idx) => (
                  <SelectItem key={idx} value={emoji}>
                    {emoji}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={handleSendMessage}
              className="bg-blue-950 text-white rounded-full p-2 px-3 text-xl hover:bg-gray-800"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
