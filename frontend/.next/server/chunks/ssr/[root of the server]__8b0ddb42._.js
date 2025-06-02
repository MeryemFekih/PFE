module.exports = {

"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/src/components/ui/coworking/meetingInterface.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-screen bg-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex-1 bg-black flex items-center justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-full absolute bg-black bg-center bg-cover",
                        style: {
                            backgroundImage: 'url(https://via.placeholder.com/800x450)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                        lineNumber: 216,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-4 left-4 flex items-center bg-red-600 text-white px-3 py-1 rounded-full space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FontAwesomeIcon, {
                                icon: faRecordVinyl,
                                className: "animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                lineNumber: 220,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-8 flex items-center justify-center space-x-6 bg-black bg-opacity-50 rounded-full px-6 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "text-white focus:outline-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FontAwesomeIcon, {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "text-white focus:outline-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FontAwesomeIcon, {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "text-white focus:outline-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FontAwesomeIcon, {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "text-red-500 bg-white rounded-full p-3 focus:outline-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FontAwesomeIcon, {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-4 right-4 flex items-center space-x-2 bg-gray-800 bg-opacity-75 text-white px-3 py-1 rounded-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs",
                                children: "G"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white py-4 px-6 shadow-inner",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex space-x-4 overflow-x-auto",
                    children: participants.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center w-24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: p.avatar,
                                    alt: p.name,
                                    className: "w-12 h-12 rounded-full border-2 border-gray-300"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/coworking/meetingInterface.tsx",
                                    lineNumber: 252,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)");
        } else {
            "TURBOPACK unreachable";
        }
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__8b0ddb42._.js.map