'use client'
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { db } from '@/lib/firebase'
import { setDoc, doc, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, getDoc } from 'firebase/firestore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns'
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faLaptop, faPhone, faUserCircle } from '@fortawesome/free-solid-svg-icons';

interface MeetingInterfaceProps {
  roomId: string;
}

export default function MeetingInterface({ roomId }: MeetingInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat')
  const [input, setInput] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [direction, setDirection] = useState(1)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [joined, setJoined] = useState(false)
  const [joining, setJoining] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [roomName, setRoomName] = useState('Loading Room...')
  const [participants, setParticipants] = useState<any[]>([])
  const pickerRef = useRef<HTMLDivElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const emojiOptions = ["😀", "😂", "😍", "😎", "😭", "😡", "👍", "🙏"];
  const APP_ID = 'fd0e77a2c15f4c53af85276a8910ed8a'
  const CHANNEL_NAME = roomId;
  const TOKEN = null;
  const UID = useRef(Math.floor(Math.random() * 10000)).current;
  const rtc = useRef<any>({ client: null, localAudioTrack: null, localVideoTrack: null });
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const AgoraRTC = require('agora-rtc-sdk-ng');
    rtc.current.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    joinRoom();
    fetchRoomName();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'rooms', CHANNEL_NAME, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [CHANNEL_NAME]);

  useEffect(() => {
    const q = query(collection(db, 'rooms', CHANNEL_NAME, 'participants'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const participantsList = snapshot.docs.map(doc => {
        const data = doc.data();
        return data.name || data.email || 'Unknown';
      });
      setParticipants(participantsList);
    });
    return () => unsubscribe();
  }, [CHANNEL_NAME]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'rooms', CHANNEL_NAME), (docSnapshot) => {
      const roomData = docSnapshot.data();
      if (roomData?.participants) {
        setParticipants(roomData.participants || []);
      }
    });
    return () => unsubscribe();
  }, [CHANNEL_NAME]);

  const fetchRoomName = async () => {
    const roomRef = doc(db, 'rooms', CHANNEL_NAME);
    const roomSnap = await getDoc(roomRef);
    if (roomSnap.exists()) {
      setRoomName(roomSnap.data().name || 'Unnamed Room');
    } else {
      setRoomName('Unknown Room');
    }
  };

  const joinRoom = async () => {
    if (!rtc.current.client || joining || joined) return;
    setJoining(true);

    try {
      const client = rtc.current.client;
      const generatedUid = await client.join(APP_ID, CHANNEL_NAME, TOKEN);
      const AgoraRTC = require('agora-rtc-sdk-ng');
      rtc.current.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      rtc.current.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

      if (localVideoRef.current) {
        rtc.current.localVideoTrack.play(localVideoRef.current);
      }

      await client.publish([rtc.current.localAudioTrack, rtc.current.localVideoTrack]);

      client.on('user-published', async (user: any, mediaType: any) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'video' && remoteVideoRef.current) {
          user.videoTrack.play(remoteVideoRef.current);
        }
        if (mediaType === 'audio') {
          user.audioTrack.play();
        }
      });

      setJoined(true);
      await setDoc(doc(db, 'rooms', CHANNEL_NAME), { createdAt: new Date(), hostUID: generatedUid }, { merge: true });
    } catch (err) {
      console.error('Failed to join room:', err);
    } finally {
      setJoining(false);
    }
  };

  const toggleMic = () => {
    const track = rtc.current.localAudioTrack;
    if (track) {
      track.setEnabled(!isMicOn);
      setIsMicOn(prev => !prev);
    }
  };

  const toggleCamera = () => {
    const track = rtc.current.localVideoTrack;
    if (track && typeof track.setEnabled === 'function') {
      track.setEnabled(!isCameraOn);
      setIsCameraOn(prev => !prev);
    }
  };

  const toggleRecording = () => setIsRecording(prev => !prev);

  const leaveRoom = async () => {
    rtc.current.localAudioTrack?.close();
    rtc.current.localVideoTrack?.close();
    await rtc.current.client?.leave();
    setJoined(false);
    router.push('/profile');
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    await addDoc(collection(db, 'rooms', CHANNEL_NAME, 'messages'), {
      text: input,
      sender: 'You',
      createdAt: serverTimestamp(),
    });
    setInput('');
  };

  return (
    <div className="flex h-screen bg-gray-100 ">
      <div className="flex-1/2 flex-col p-3">
        <div className="bg-black text-white p-4 rounded-3xl mb-4">
          <h1 className="text-xl font-bold">You are Joining a room named: {roomName}</h1>
        </div>
        <div className="bg-white p-4 mt-4 rounded-3xl flex flex-col items-center space-y-4">
          <video ref={localVideoRef} autoPlay playsInline className="rounded-lg bg-gray-200" />
          <div className="flex space-x-4">
            <button onClick={toggleMic} className="bg-gray-400 text-white p-3 rounded-full">
              <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} className="w-6 h-6" />
            </button>
            <button onClick={toggleCamera} className="bg-gray-400 text-white p-3 rounded-full">
              <FontAwesomeIcon icon={isCameraOn ? faVideo : faVideoSlash} className="w-6 h-6" />
            </button>
            <button onClick={toggleRecording} className={`p-3 rounded-full ${isRecording ? 'bg-red-600' : 'bg-gray-400'} text-white`}>
              <FontAwesomeIcon icon={faLaptop} className="w-6 h-6" />
            </button>
            <button onClick={leaveRoom} className="w-12 h-12 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700">
              <FontAwesomeIcon icon={faPhone} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-0 p-4 bg-gray-100">
        <div className="flex justify-between mt-4 mb-4 bg-white rounded-full overflow-hidden shadow">
          <button onClick={() => setActiveTab('chat')} className={`w-1/2 py-2 font-semibold ${activeTab === 'chat' ? 'bg-black text-white' : 'text-black'}`}>
            Room Chat
          </button>
          <button onClick={() => setActiveTab('participants')} className={`w-1/2 py-2 font-semibold ${activeTab === 'participants' ? 'bg-black text-white' : 'text-black'}`}>
            Participants
          </button>
        </div>

        <div className="relative flex-1 bg-white rounded-3xl overflow-hidden text-black">
          <AnimatePresence custom={direction}>
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                custom={direction}
                initial={{ x: direction * 100 + '%' }}
                animate={{ x: 0 }}
                exit={{ x: direction * -100 + '%' }}
                transition={{ duration: 0.4 }}
                className="absolute top-0 left-0 w-full h-full bg-white p-4 overflow-y-auto"
              >
                <div className="space-y-3">
                  {messages.length > 0 ? messages.map(msg => {
                    const messageTime = msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000) : new Date();
                    const formattedTime = format(messageTime, 'hh:mm a');
                    return (
                      <div key={msg.id} className={msg.sender === 'You' ? 'text-right' : ''}>
                        <p className="text-sm text-gray-500">{msg.sender} <span className="text-xs text-gray-400">{formattedTime}</span></p>
                        <div className={`inline-block px-3 py-2 rounded-xl ${msg.sender === 'You' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center text-gray-400 py-20">
                      No conversation yet. Start it ✨
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {activeTab === 'participants' && (
              <motion.div
                key="participants"
                custom={direction}
                initial={{ x: direction * 100 + '%' }}
                animate={{ x: 0 }}
                exit={{ x: direction * -100 + '%' }}
                transition={{ duration: 0.4 }}
                className="absolute top-0 left-0 w-full h-full bg-white p-4"
              >
                <h2 className="text-xl font-bold mb-4">Participants</h2>
                {participants.length > 0 ? (
                  <ul>
                    {participants.map((p, i) => (
                      <li key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                        <FontAwesomeIcon icon={faUserCircle} className="text-2xl text-gray-500" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-400 py-20">
                    No participants yet. Waiting for others to join 👀
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 relative">
          <div className="flex items-center text-gray-600 bg-white rounded-full px-4 py-2 shadow">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message here..."
              className="flex-1 outline-none bg-transparent"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Select onValueChange={(emoji) => setInput((prev) => prev + emoji)}>
              <SelectTrigger className="w-10 text-2xl px-0 justify-center mr-2">
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
            <button onClick={sendMessage} className="bg-black text-white rounded-full p-2 text-xl">➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}
