module.exports = {

"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/src/app/coworking/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/*'use client';

import React, { useRef, useState } from 'react';
import { db } from '../../lib/firebase';
import {
  collection,
  addDoc,
  setDoc,
  doc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';

const Home = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [roomId, setRoomId] = useState('');
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const config = {
    iceServers: [
      { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
    ],
    iceCandidatePoolSize: 10,
  };

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const remote = new MediaStream();
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;

      setLocalStream(stream);
      setRemoteStream(remote);
    } catch (error: any) {
      console.error("Media error:", error);
      alert('Erreur lors de l’accès à la caméra/micro.');
    }
  }

  async function createRoom() {
    if (!localStream) {
      alert('📷 Veuillez d’abord démarrer la caméra.');
      return;
    }

    const pc = new RTCPeerConnection(config);
    setPeerConnection(pc);

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    const roomDocRef = doc(collection(db, 'rooms'));
    setRoomId(roomDocRef.id);

    const callerCandidatesCollection = collection(roomDocRef, 'callerCandidates');

    pc.addEventListener('icecandidate', async event => {
      if (event.candidate) {
        await addDoc(callerCandidatesCollection, event.candidate.toJSON());
      }
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const roomData = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
      ownerId: 'anonymous',  // Remplacer plus tard par l'ID de l'utilisateur
      createdAt: Timestamp.now(),
      RoomName: 'Ma room WebRTC',
      limit: null,
      participants: [],
    };

    await setDoc(roomDocRef, roomData);

    onSnapshot(roomDocRef, async snapshot => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answer = new RTCSessionDescription(data.answer);
        await pc.setRemoteDescription(answer);
      }
    });

    const calleeCandidatesCollection = collection(roomDocRef, 'calleeCandidates');
    onSnapshot(calleeCandidatesCollection, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    pc.addEventListener('track', event => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream?.addTrack(track);
      });
    });
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">WebRTC Room Demo</h1>
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay muted className="w-1/2 border" />
        <video ref={remoteVideoRef} autoPlay className="w-1/2 border" />
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={startCamera} className="bg-blue-500 text-white px-4 py-2 rounded">Start Camera</button>
        <button onClick={createRoom} className="bg-green-500 text-white px-4 py-2 rounded">Create Room</button>
        {roomId && <p className="ml-4">Room ID: <strong>{roomId}</strong></p>}
      </div>
    </div>
  );
};

export default Home;
*/ __turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$agora$2d$rtc$2d$sdk$2d$ng$2f$AgoraRTC_N$2d$production$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/agora-rtc-sdk-ng/AgoraRTC_N-production.js [app-ssr] (ecmascript)");
'use client';
;
;
;
const appId = ("TURBOPACK compile-time value", "fd0e77a2c15f4c53af85276a8910ed8a");
const token = process.env.NEXT_PUBLIC_AGORA_TEMP_TOKEN || null;
const CoworkingRoom = ()=>{
    const [joined, setJoined] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [roomId, setRoomId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [uid, setUid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const localVideoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const remoteVideoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clientRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const localTracksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    // Generate a unique room ID automatically
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const generatedRoom = `room-${Math.random().toString(36).substring(2, 8)}`;
        setRoomId(generatedRoom);
    }, []);
    const joinRoom = async ()=>{
        const client = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$agora$2d$rtc$2d$sdk$2d$ng$2f$AgoraRTC_N$2d$production$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createClient({
            mode: 'rtc',
            codec: 'vp8'
        });
        clientRef.current = client;
        const uid = await client.join(appId, roomId, token || null);
        setUid(uid);
        const [audioTrack, videoTrack] = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$agora$2d$rtc$2d$sdk$2d$ng$2f$AgoraRTC_N$2d$production$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createMicrophoneAndCameraTracks();
        localTracksRef.current = [
            audioTrack,
            videoTrack
        ];
        if (localVideoRef.current) {
            videoTrack.play(localVideoRef.current);
        }
        await client.publish([
            audioTrack,
            videoTrack
        ]);
        setJoined(true);
        client.on('user-published', async (user, mediaType)=>{
            await client.subscribe(user, mediaType);
            if (mediaType === 'video' && remoteVideoRef.current) {
                user.videoTrack?.play(remoteVideoRef.current);
            }
            if (mediaType === 'audio') {
                user.audioTrack?.play();
            }
        });
    };
    const leaveRoom = async ()=>{
        if (!clientRef.current) return;
        localTracksRef.current.forEach((track)=>track.stop());
        localTracksRef.current.forEach((track)=>track.close());
        await clientRef.current.leave();
        setJoined(false);
        setUid(undefined);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-xl font-bold mb-4",
                children: "Agora Coworking Room"
            }, void 0, false, {
                fileName: "[project]/src/app/coworking/page.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-2",
                children: [
                    "Room ID: ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: roomId
                    }, void 0, false, {
                        fileName: "[project]/src/app/coworking/page.tsx",
                        lineNumber: 196,
                        columnNumber: 36
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/coworking/page.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-4 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: localVideoRef,
                        className: "w-1/2 border h-64 bg-black"
                    }, void 0, false, {
                        fileName: "[project]/src/app/coworking/page.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: remoteVideoRef,
                        className: "w-1/2 border h-64 bg-black"
                    }, void 0, false, {
                        fileName: "[project]/src/app/coworking/page.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/coworking/page.tsx",
                lineNumber: 198,
                columnNumber: 7
            }, this),
            !joined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: joinRoom,
                className: "bg-green-500 text-white px-4 py-2 rounded",
                children: "Join Room"
            }, void 0, false, {
                fileName: "[project]/src/app/coworking/page.tsx",
                lineNumber: 204,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: leaveRoom,
                className: "bg-red-500 text-white px-4 py-2 rounded",
                children: "Leave Room"
            }, void 0, false, {
                fileName: "[project]/src/app/coworking/page.tsx",
                lineNumber: 208,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/coworking/page.tsx",
        lineNumber: 194,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = CoworkingRoom;
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__26ce395b._.js.map