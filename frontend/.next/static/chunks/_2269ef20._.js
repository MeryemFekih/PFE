(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_2269ef20._.js", {

"[project]/src/components/ui/coworking/meetingInterface.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/*'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { db } from '@/lib/firebase'
import { setDoc, doc, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore'

export default function MeetingInterface() {
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat')
  const [input, setInput] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [direction, setDirection] = useState(1)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [joined, setJoined] = useState(false)
  const [joining, setJoining] = useState(false)
  const [messages, setMessages] = useState<any[]>([])

  const pickerRef = useRef<HTMLDivElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const APP_ID = 'fd0e77a2c15f4c53af85276a8910ed8a'
  const CHANNEL_NAME = 'test-room'
  const TOKEN = null
  const UID = useRef(Math.floor(Math.random() * 10000)).current

  // Agora client and tracks will only be initialized on the client
  const rtc = useRef<any>({ client: null, localAudioTrack: null, localVideoTrack: null })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const AgoraRTC = require('agora-rtc-sdk-ng')
    rtc.current.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    joinRoom()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'rooms', CHANNEL_NAME, 'messages'), orderBy('createdAt'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setMessages(msgs)
    })
    return () => unsubscribe()
  }, [])

  const joinRoom = async () => {
    if (!rtc.current.client || joining || joined || rtc.current.client.connectionState !== 'DISCONNECTED') return
    setJoining(true)

    try {
      const client = rtc.current.client
      await client.join(APP_ID, CHANNEL_NAME, TOKEN, UID)

      const AgoraRTC = require('agora-rtc-sdk-ng')
      rtc.current.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
      rtc.current.localVideoTrack = await AgoraRTC.createCameraVideoTrack()

      if (localVideoRef.current) {
        rtc.current.localVideoTrack.play(localVideoRef.current)
      }

      await client.publish([
        rtc.current.localAudioTrack,
        rtc.current.localVideoTrack,
      ])

      client.on('user-published', async (user: any, mediaType: any) => {
        await client.subscribe(user, mediaType)
        if (mediaType === 'video' && remoteVideoRef.current) {
          user.videoTrack.play(remoteVideoRef.current)
        }
        if (mediaType === 'audio') {
          user.audioTrack.play()
        }
      })

      setJoined(true)
      await setDoc(doc(db, 'rooms', CHANNEL_NAME), { createdAt: new Date(), hostUID: UID })
    } catch (err) {
      console.error('Failed to join room:', err)
    } finally {
      setJoining(false)
    }
  }

  const toggleMic = () => {
    const track = rtc.current.localAudioTrack
    if (track) {
      track.setEnabled(!isMicOn)
      setIsMicOn(prev => !prev)
    }
  }

  const toggleCamera = () => {
    const track = rtc.current.localVideoTrack
    if (track && typeof track.setEnabled === 'function') {
      track.setEnabled(!isCameraOn)
      setIsCameraOn(prev => !prev)
    }
  }

  const leaveRoom = async () => {
    rtc.current.localAudioTrack?.close()
    rtc.current.localVideoTrack?.close()
    await rtc.current.client?.leave()
    setJoined(false)
  }

  const addEmoji = (emoji: any) => setInput(prev => prev + emoji.native)

  const handleTabChange = (tab: 'chat' | 'participants') => {
    setDirection(tab === 'participants' ? 1 : -1)
    setActiveTab(tab)
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    await addDoc(collection(db, 'rooms', CHANNEL_NAME, 'messages'), { text: input, sender: 'You', createdAt: serverTimestamp() })
    setInput('')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className=" flex-1/2 flex-col p-3">
        <div className="bg-black text-white p-4 rounded-3xl">
          <h1 className="text-xl font-bold">Group's Meeting Room - Week 1</h1>
        </div>

        <div className="bg-white mt-4 mb-4 p-4 rounded-3xl flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <video ref={localVideoRef} autoPlay playsInline className="rounded-lg w-xl bg-gray-200" />
          </div>

          <div className="flex space-x-4">
            <button onClick={toggleMic} className="bg-gray-800 text-white px-4 py-2 rounded-full">{isMicOn ? 'Mute Mic' : 'Unmute Mic'}</button>
            <button onClick={toggleCamera} className="bg-gray-800 text-white px-4 py-2 rounded-full">{isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}</button>
            <button onClick={leaveRoom} className="bg-red-600 text-white px-4 py-2 rounded-full">End Meeting</button>
          </div>
          <div className='flex  space-x-4'>
            <video ref={remoteVideoRef} autoPlay playsInline className="rounded-lg w-48 h-36 bg-gray-200" />
            <video ref={remoteVideoRef} autoPlay playsInline className="rounded-lg w-48 h-36 bg-gray-200" />
            <video ref={remoteVideoRef} autoPlay playsInline className="rounded-lg w-48 h-36 bg-gray-200" />
            <video ref={remoteVideoRef} autoPlay playsInline className="rounded-lg w-48 h-36 bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-0 p-4 bg-gray-100">
        <div className="flex justify-between mt-4 mb-4 bg-white rounded-full overflow-hidden shadow">
          <button onClick={() => handleTabChange('chat')} className={`w-1/2 rounded-full py-2 text-center font-semibold ${activeTab==='chat'?'bg-black text-white':'text-black'}`}>Room Chat</button>
          <button onClick={() => handleTabChange('participants')} className={`w-1/2 py-2 text-center rounded-full font-semibold ${activeTab==='participants'?'bg-black text-white':'text-black'}`}>Participants</button>
        </div>

        <div className="relative flex-1 bg-white rounded-3xl overflow-hidden text-black">
          <AnimatePresence custom={direction}>
            {activeTab==='chat' && (
              <motion.div key="chat" custom={direction} initial={{x:direction*100+'%'}} animate={{x:0}} exit={{x:direction*-100+'%'}} transition={{duration:0.4}} className="absolute top-0 left-0 w-full h-full bg-white rounded-xl p-4 overflow-y-auto">
                <div className="space-y-3">
                  {messages.map(msg=> <div key={msg.id} className={msg.sender==='You'?'text-right':''}><p className="text-sm text-gray-500">{msg.sender}</p><div className={`inline-block px-3 py-2 rounded-xl ${msg.sender==='You'?'bg-green-100':'bg-gray-200'}`}>{msg.text}</div></div>)}
                </div>
              </motion.div>
            )}
            {activeTab==='participants' && (
              <motion.div key="participants" custom={direction} initial={{x:direction*100+'%'}} animate={{x:0}} exit={{x:direction*-100+'%'}} transition={{duration:0.4}} className="absolute top-0 left-0 w-full h-full bg-white rounded-xl p-4">
                <h2 className="text-xl font-bold mb-4">Participants</h2>
                <ul><li className="py-2 border-b">Alicia Padlock</li><li className="py-2 border-b">Sri Veronica</li><li className="py-2 border-b">You</li></ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 relative">
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow">
            <input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type message here..." className="flex-1 outline-none bg-transparent" onKeyDown={e=>e.key==='Enter'&&sendMessage()} />
            <button onClick={()=>setShowPicker(v=>!v)} className="text-2xl mr-2">😊</button>
            <button onClick={sendMessage} className="bg-black text-white rounded-full p-2 text-xl">➤</button>
          </div>
          {showPicker&&<div className="absolute bottom-14 right-0 z-50" ref={pickerRef}><Picker data={data} onEmojiSelect={addEmoji} /></div>}
        </div>
      </div>
    </div>
  )
}
*/ __turbopack_context__.s({
    "default": (()=>MeetingUI)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@fortawesome/react-fontawesome'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@fortawesome/free-solid-svg-icons'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
'use client';
;
;
;
const participants = [
    {
        id: 1,
        name: 'Alicia Padlock',
        avatar: 'https://i.pravatar.cc/150?u=alicia'
    },
    {
        id: 2,
        name: 'Sri Veronica',
        avatar: 'https://i.pravatar.cc/150?u=sri'
    },
    {
        id: 3,
        name: 'Corbyn Stefan',
        avatar: 'https://i.pravatar.cc/150?u=corbyn'
    }
];
function MeetingUI() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-screen bg-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex-1 bg-black flex items-center justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-full absolute bg-black bg-center bg-cover",
                        style: {
                            backgroundImage: 'url(https://via.placeholder.com/800x450)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                        lineNumber: 216,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-4 left-4 flex items-center bg-red-600 text-white px-3 py-1 rounded-full space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FontAwesomeIcon, {
                                icon: faRecordVinyl,
                                className: "animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                lineNumber: 220,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm",
                                children: "Recording in Progress..."
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                        lineNumber: 219,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-8 flex items-center justify-center space-x-6 bg-black bg-opacity-50 rounded-full px-6 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "text-white focus:outline-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FontAwesomeIcon, {
                                    icon: faMicrophone,
                                    size: "lg"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                    lineNumber: 227,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "text-white focus:outline-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FontAwesomeIcon, {
                                    icon: faVideo,
                                    size: "lg"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                    lineNumber: 230,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "text-white focus:outline-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FontAwesomeIcon, {
                                    icon: faDesktop,
                                    size: "lg"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                    lineNumber: 233,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "text-red-500 bg-white rounded-full p-3 focus:outline-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FontAwesomeIcon, {
                                    icon: faPhoneSlash,
                                    size: "lg"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                    lineNumber: 236,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-4 right-4 flex items-center space-x-2 bg-gray-800 bg-opacity-75 text-white px-3 py-1 rounded-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs",
                                children: "G"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm",
                                children: "You"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                lineNumber: 243,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white py-4 px-6 shadow-inner",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex space-x-4 overflow-x-auto",
                    children: participants.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center w-24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: p.avatar,
                                    alt: p.name,
                                    className: "w-12 h-12 rounded-full border-2 border-gray-300"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                    lineNumber: 252,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mt-2 text-sm text-center truncate",
                                    children: p.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                    lineNumber: 253,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, p.id, true, {
                            fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                            lineNumber: 251,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
        lineNumber: 212,
        columnNumber: 5
    }, this);
}
_c = MeetingUI;
var _c;
__turbopack_context__.k.register(_c, "MeetingUI");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_CONTEXT_TYPE:
                return (type.displayName || "Context") + ".Provider";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
        self = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== self ? self : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, self, source, getOwner(), maybeKey, debugStack, debugTask);
    }
    function validateChildKeys(node) {
        "object" === typeof node && null !== node && node.$$typeof === REACT_ELEMENT_TYPE && node._store && (node._store.validated = 1);
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler");
    Symbol.for("react.provider");
    var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    }, specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren, source, self) {
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, Error("react-stack-top-frame"), createTask(getTaskName(type)));
    };
}();
}}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}}),
}]);

//# sourceMappingURL=_2269ef20._.js.map