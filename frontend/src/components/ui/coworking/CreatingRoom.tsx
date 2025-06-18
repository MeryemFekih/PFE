"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  faCopy,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { createRoom, getUserRooms, getPublicRooms, joinRoom, checkRoomExists, type Room } from "@/lib/rooms"
import { v4 as uuidv4 } from "uuid"

interface RoomPageProps {
  onRoomCreated: (roomId: string) => void
}

interface User {
  id: string
  email: string
  name: string
}

export default function RoomPage({ onRoomCreated }: RoomPageProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [visibility, setVisibility] = useState<"public" | "private">("public")
  const [participantEmails, setParticipantEmails] = useState<string[]>([""])
  const [limit, setLimit] = useState<number | null>(null)
  const [roomLink, setRoomLink] = useState<string | null>(null)
  const [roomName, setRoomName] = useState("")
  const [objective, setObjective] = useState("")
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [userRooms, setUserRooms] = useState<Room[]>([])
  const [publicRooms, setPublicRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pastedLink, setPastedLink] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [joiningRoom, setJoiningRoom] = useState(false)

  // Generate a consistent user ID for the session
  const generateUserId = () => {
    let userId = localStorage.getItem("temp_user_id")
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9)
      localStorage.setItem("temp_user_id", userId)
    }
    return userId
  }

  const generateUserName = () => {
    let userName = localStorage.getItem("temp_user_name")
    if (!userName) {
      userName = "User " + Math.random().toString(36).substr(2, 4).toUpperCase()
      localStorage.setItem("temp_user_name", userName)
    }
    return userName
  }

  useEffect(() => {
    const getSessionInfo = async () => {
      try {
        // Try to fetch from API first
        const res = await fetch("/api/session")

        if (res.ok) {
          const data = await res.json()

          if (data.user?.id) {
            const userData = {
              id: data.user.id.toString(),
              email: data.user.email, 
              name: data.user.firstName 
            }
            setUser(userData)

            // Load user's rooms and public rooms
            const [userRoomsData, publicRoomsData] = await Promise.all([getUserRooms(userData.id), getPublicRooms()])

            setUserRooms(userRoomsData)
            setPublicRooms(publicRoomsData.filter((room) => room.creatorId !== userData.id))
          } else {
            throw new Error("No user data in response")
          }
        } else {
          throw new Error("API response not ok")
        }
      } catch (err) {
        console.warn("Session API failed, using fallback:", err)

        // Fallback: create a temporary user session
        const userData = {
          id: generateUserId(),
          email: `${generateUserId()}@temp.com`,
          name: generateUserName(),
        }
        setUser(userData)

        try {
          // Load rooms with fallback user
          const [userRoomsData, publicRoomsData] = await Promise.all([getUserRooms(userData.id), getPublicRooms()])

          setUserRooms(userRoomsData)
          setPublicRooms(publicRoomsData.filter((room) => room.creatorId !== userData.id))
        } catch (roomError) {
          console.error("Failed to load rooms:", roomError)
          setError("Failed to load rooms. Please check your Firebase configuration.")
        }
      } finally {
        setLoading(false)
      }
    }

    getSessionInfo()
  }, [])

  useEffect(() => {
    if (!roomName) {
      setRoomLink(null)
      return
    }

    const roomId = `${roomName.toLowerCase().replace(/\s+/g, "-")}-${uuidv4().substring(0, 8)}`
    const tempLink = `${window.location.origin}/coworking/${roomId}`
    setRoomLink(tempLink)

  }, [roomName])

  useEffect(() => {
    const manageStream = async () => {
      if (!micOn && !cameraOn) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
          if (videoRef.current) videoRef.current.srcObject = null
        }
        return
      }

      try {
        const constraints = {
          video: cameraOn,
          audio: micOn,
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (e) {
        console.error("Could not get media", e)
        setError("Failed to access camera/microphone. Please check permissions.")
      }
    }

    manageStream()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [micOn, cameraOn])

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !micOn
      })
    }
    setMicOn(!micOn)
  }

  const toggleCamera = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !cameraOn
      })
    }
    setCameraOn(!cameraOn)
  }

  const extractRoomIdFromLink = (link: string): string | null => {
    try {
      // Handle different URL formats
      const patterns = [
        /\/coworking\/([^/?#]+)/, // /coworking/room-id
        /roomId=([^&]+)/, // ?roomId=room-id
        /room\/([^/?#]+)/, // /room/room-id
      ]

      for (const pattern of patterns) {
        const match = link.match(pattern)
        if (match && match[1]) {
          return decodeURIComponent(match[1])
        }
      }

      // If it's just a room ID without URL structure
      if (link && !link.includes("/") && !link.includes("?")) {
        return link.trim()
      }

      return null
    } catch (error) {
      console.error("Error extracting room ID:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!user) {
    setError("Please wait for session to load.")
    return
  }

  if (!roomName || !objective) {
    setError("Room name and objective are required.")
    return
  }

  if (visibility === "private" && participantEmails.every((email) => !email.trim())) {
    setError("At least one participant email is required for private rooms.")
    return
  }

  try {
    const roomId = `${roomName.toLowerCase().replace(/\s+/g, "-")}-${uuidv4().substring(0, 8)}`
    const newRoomId = await createRoom({
      id: roomId,
      name: roomName,
      objective,
      visibility,
      creatorId: user.id,
      creatorName: user.name,
      participantEmails: participantEmails.filter((email) => email.trim()),
      joinedUsers: [user.id],
      isActive: true,
      createdAt: new Date(),
      ...(limit !== null ? { limit } : {}), // only include limit if it's set
    })

    onRoomCreated(newRoomId)
    router.push(`/coworking/${newRoomId}?mic=${micOn ? "on" : "off"}&camera=${cameraOn ? "on" : "off"}`)
  } catch (error) {
    console.error("Error creating room:", error)
    setError("Failed to create room. Please check your Firebase configuration.")
  }
}


  const handleJoinRoom = async () => {
    if (!user) {
      setError("Please wait for session to load.")
      return
    }

    setJoiningRoom(true)
    setError(null)

    try {
      let roomIdToJoin = selectedRoomId

      // Extract room ID from pasted link if provided
      if (pastedLink) {
        roomIdToJoin = extractRoomIdFromLink(pastedLink)
        if (!roomIdToJoin) {
          setError("Invalid room link format. Please check the URL and try again.")
          return
        }
      }

      if (!roomIdToJoin) {
        setError("Please select a room or paste a valid room link.")
        return
      }

      console.log("Attempting to join room:", roomIdToJoin)

      // First check if room exists
      const roomExists = await checkRoomExists(roomIdToJoin)
      if (!roomExists) {
        setError(`Room "${roomIdToJoin}" not found. Please check the room ID or link.`)
        return
      }

      console.log("Room found:", roomExists)

      // Try to join the room
      const success = await joinRoom(roomIdToJoin, user.id, user.email, user.name)
      if (success) {
        console.log("Successfully joined room, redirecting...")
        router.push(`/coworking/${roomIdToJoin}?mic=${micOn ? "on" : "off"}&camera=${cameraOn ? "on" : "off"}`)
      } else {
        // Provide more specific error based on room type
        if (roomExists.visibility === "private") {
          const isInvited = roomExists.participantEmails.includes(user.email)
          const isCreator = roomExists.creatorId === user.id
          const hasJoinedBefore = roomExists.joinedUsers?.includes(user.id)

          if (!isInvited && !isCreator && !hasJoinedBefore) {
            setError("This is a private room and you haven't been invited. Please contact the room creator.")
          } else if (roomExists.limit && roomExists.joinedUsers?.length >= roomExists.limit) {
            setError(`Room is full. Maximum ${roomExists.limit} participants allowed.`)
          } else {
            setError("Failed to join room. Please try again.")
          }
        } else {
          if (roomExists.limit && roomExists.joinedUsers?.length >= roomExists.limit) {
            setError(`Room is full. Maximum ${roomExists.limit} participants allowed.`)
          } else {
            setError("Failed to join room. Please try again.")
          }
        }
      }
    } catch (error) {
      console.error("Error joining room:", error)
      setError("Failed to join room. Please check your connection and try again.")
    } finally {
      setJoiningRoom(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    )
  }

  const allAvailableRooms = [...userRooms, ...publicRooms]

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Profile
          </button>

          {user && <div className="text-sm text-gray-600">Welcome, {user.name}</div>}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-150px)]">
          {/* Video Preview */}
          <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
            <div className="relative flex-1 bg-gray-200">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              {!cameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
                  Camera is off
                </div>
              )}
            </div>
            <div className="flex justify-center space-x-4 p-4 bg-gray-50">
              <button
                onClick={toggleMic}
                className={`p-3 px-4.5 rounded-full ${micOn ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white transition-colors`}
                aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
              >
                <FontAwesomeIcon icon={micOn ? faMicrophone : faMicrophoneSlash} />
              </button>
              <button
                onClick={toggleCamera}
                className={`p-3 px-4 rounded-full ${cameraOn ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white transition-colors`}
                aria-label={cameraOn ? "Turn off camera" : "Turn on camera"}
              >
                <FontAwesomeIcon icon={cameraOn ? faVideo : faVideoSlash} />
              </button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Join Room Section */}
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6 mb-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Join a Room</h2>

              <div className="space-y-4">
                <div className="flex  gap-4 mb-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Rooms</label>
                  <select
                    value={selectedRoomId || ""}
                    onChange={(e) => {
                      setSelectedRoomId(e.target.value)
                      if (e.target.value) setPastedLink("") // Clear pasted link when selecting from dropdown
                    }}
                    className="w-full  p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a room</option>
                    {userRooms.length > 0 && (
                      <optgroup label="Your Rooms">
                        {userRooms.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name} ({room.visibility})
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {publicRooms.length > 0 && (
                      <optgroup label="Public Rooms">
                        {publicRooms.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name} - by {room.creatorName}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  {allAvailableRooms.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">No rooms available. Create one below!</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Or paste room link</label>
                  <input
                    type="text"
                    placeholder="Paste room link or room ID here..."
                    value={pastedLink}
                    onChange={(e) => {
                      setPastedLink(e.target.value)
                      if (e.target.value) setSelectedRoomId(null) // Clear dropdown when pasting link
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                </div>
                </div>

                <button
                  onClick={handleJoinRoom}
                  disabled={(!selectedRoomId && !pastedLink) || joiningRoom}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    (!selectedRoomId && !pastedLink) || joiningRoom
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white"
                  }`}
                >
                  {joiningRoom ? "Joining..." : "Join Room"}
                </button>
              </div>
            </div>

            {/* Create Room Section */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 flex-1 overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Create a New Room</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{error}</p>
                  <button onClick={() => setError(null)} className="text-sm underline mt-1">
                    Dismiss
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-full">
                    <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
                      Room Name
                    </label>
                    <input
                      id="roomName"
                      type="text"
                      placeholder="e.g. Study Session, Team Meeting"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-1">
                      Objective
                    </label>
                    <input
                      id="objective"
                      type="text"
                      placeholder="e.g. Study Calculus, Project Planning"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">
                    Visibility
                  </label>
                  <select
                    id="visibility"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as "public" | "private")}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="public">Public (Anyone can join)</option>
                    <option value="private">Private (Invite only)</option>
                  </select>
                </div>

                {visibility === "private" && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
                        Participant Limit (optional)
                      </label>
                      <input
                        id="limit"
                        type="number"
                        placeholder="Leave empty for no limit"
                        value={limit || ""}
                        onChange={(e) => setLimit(Number(e.target.value) || null)}
                        min="1"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Invite Participants</label>
                      <div className="space-y-2">
                        {participantEmails.map((email, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="email"
                              placeholder={`participant${index + 1}@example.com`}
                              value={email}
                              onChange={(e) => {
                                const newEmails = [...participantEmails]
                                newEmails[index] = e.target.value
                                setParticipantEmails(newEmails)
                              }}
                              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {participantEmails.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setParticipantEmails(participantEmails.filter((_, i) => i !== index))}
                                className="p-3 text-red-500 hover:text-red-700 rounded-lg"
                                aria-label="Remove participant"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setParticipantEmails([...participantEmails, ""])}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-1"
                        >
                          <span className="text-lg mr-1">+</span> Add another participant
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {roomLink && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={roomLink}
                        readOnly
                        className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(roomLink)
                          alert("Link copied to clipboard!")
                        }}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        aria-label="Copy room link"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!user}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    !user
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 "
                  }`}
                >
                  Create Room
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
