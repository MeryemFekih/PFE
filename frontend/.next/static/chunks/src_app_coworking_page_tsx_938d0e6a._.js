(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_app_coworking_page_tsx_938d0e6a._.js", {

"[project]/src/app/coworking/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
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
    "default": (()=>CoworkingPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$agora$2d$rtc$2d$sdk$2d$ng$2f$AgoraRTC_N$2d$production$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/agora-rtc-sdk-ng/AgoraRTC_N-production.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '/../lib/firebase'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const appId = ("TURBOPACK compile-time value", "fd0e77a2c15f4c53af85276a8910ed8a");
const token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_AGORA_TEMP_TOKEN || null;
function CoworkingPage() {
    _s();
    const [roomName, setRoomName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [roomLimit, setRoomLimit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [roomId, setRoomId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [joined, setJoined] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const localVideoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const remoteVideoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const createRoom = async ()=>{
        const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(db, 'rooms'), {
            roomId: roomName,
            roomOwner: 'mouma@coworking.com',
            participants: [],
            roomLimit: roomLimit,
            createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timestamp"].now(),
            roomType: 'video'
        });
        setRoomId(roomName);
        alert(`Room "${roomName}" created successfully.`);
    };
    const joinRoom = async ()=>{
        const client = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$agora$2d$rtc$2d$sdk$2d$ng$2f$AgoraRTC_N$2d$production$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createClient({
            mode: 'rtc',
            codec: 'vp8'
        });
        const uid = await client.join(appId, roomId, token || null);
        const [audioTrack, videoTrack] = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$agora$2d$rtc$2d$sdk$2d$ng$2f$AgoraRTC_N$2d$production$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createMicrophoneAndCameraTracks();
        if (localVideoRef.current) {
            videoTrack.play(localVideoRef.current);
        }
        await client.publish([
            audioTrack,
            videoTrack
        ]);
        client.on('user-published', async (user, mediaType)=>{
            await client.subscribe(user, mediaType);
            if (mediaType === 'video' && remoteVideoRef.current) {
                user.videoTrack?.play(remoteVideoRef.current);
            }
            if (mediaType === 'audio') {
                user.audioTrack?.play();
            }
        });
        setJoined(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold mb-4",
                children: "Create or Join a Coworking Room"
            }, void 0, false, {
                fileName: "[project]/src/app/coworking/page.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        placeholder: "Room Name",
                        value: roomName,
                        onChange: (e)=>setRoomName(e.target.value),
                        className: "border p-2 rounded w-64 mr-2"
                    }, void 0, false, {
                        fileName: "[project]/src/app/coworking/page.tsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        placeholder: "Limit",
                        value: roomLimit,
                        onChange: (e)=>setRoomLimit(parseInt(e.target.value)),
                        className: "border p-2 rounded w-20 mr-2"
                    }, void 0, false, {
                        fileName: "[project]/src/app/coworking/page.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: createRoom,
                        className: "bg-blue-600 text-white px-4 py-2 rounded",
                        children: "Create Room"
                    }, void 0, false, {
                        fileName: "[project]/src/app/coworking/page.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/coworking/page.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this),
            roomId && !joined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: joinRoom,
                className: "bg-green-600 text-white px-4 py-2 rounded",
                children: "Join Room"
            }, void 0, false, {
                fileName: "[project]/src/app/coworking/page.tsx",
                lineNumber: 213,
                columnNumber: 9
            }, this),
            joined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Room ID: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: roomId
                            }, void 0, false, {
                                fileName: "[project]/src/app/coworking/page.tsx",
                                lineNumber: 223,
                                columnNumber: 23
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/coworking/page.tsx",
                        lineNumber: 223,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 mt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: localVideoRef,
                                className: "w-1/2 h-64 bg-black"
                            }, void 0, false, {
                                fileName: "[project]/src/app/coworking/page.tsx",
                                lineNumber: 225,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: remoteVideoRef,
                                className: "w-1/2 h-64 bg-black"
                            }, void 0, false, {
                                fileName: "[project]/src/app/coworking/page.tsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/coworking/page.tsx",
                        lineNumber: 224,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/coworking/page.tsx",
                lineNumber: 222,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/coworking/page.tsx",
        lineNumber: 186,
        columnNumber: 5
    }, this);
}
_s(CoworkingPage, "1koeivLFfGu2NgfRF0xLcfQhOvA=");
_c = CoworkingPage;
var _c;
__turbopack_context__.k.register(_c, "CoworkingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_coworking_page_tsx_938d0e6a._.js.map