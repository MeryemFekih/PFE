'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { faCopy, faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, query, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

interface RoomPageProps {
  onRoomCreated: (roomId: string) => void;
}

export default function RoomPage({ onRoomCreated }: RoomPageProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [participantEmails, setParticipantEmails] = useState<string[]>(['']);
  const [limit, setLimit] = useState<number | null>(null);
  const [roomLink, setRoomLink] = useState<string | null>(null);
  const [roomName, setRoomName] = useState('');
  const [objective, setObjective] = useState('');
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [existingRooms, setExistingRooms] = useState<any[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pastedLink, setPastedLink] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSessionInfo = async () => {
      try {
        const res = await fetch('/api/session');
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setUserId(data.userId);
      } catch (err) {
        console.error('Failed to fetch session info', err);
      }
    };
    getSessionInfo();
  }, []);

  useEffect(() => {
    if (!roomName) {
      setRoomLink(null);
      return;
    }
    const generateRandomRoomName = (): string => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
      }
      return result;
    };
    const randomName = generateRandomRoomName();
    const tempRoomId = `${roomName.toLowerCase().replace(/\s+/g, '-')}-${randomName}`;
    const tempLink = `${window.location.origin}/join/${tempRoomId}`;
    setRoomLink(tempLink);
  }, [roomName]);

  useEffect(() => {
    const manageStream = async () => {
      if (!micOn && !cameraOn) {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: cameraOn,
          audio: micOn,
        });
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.error('Could not get media', e);
      }
    };

    manageStream();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [micOn, cameraOn]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!userId) return;
      const q = query(collection(db, 'rooms'));
      const querySnapshot = await getDocs(q);
      const rooms: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === userId) {
          rooms.push({ id: doc.id, name: data.name });
        }
      });
      setExistingRooms(rooms);
    };
    fetchRooms();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName || !objective) {
      setError('Room name and objective are required.');
      return;
    }

    const roomId = `${roomName.toLowerCase().replace(/\s+/g, '-')}-${uuidv4().substring(0, 5)}`;

    try {
      await addDoc(collection(db, 'rooms'), {
        id: roomId,
        name: roomName,
        limit: limit || null,
        objective,
        visibility,
        participantEmails: participantEmails.map((email) => email.trim()),
        micStatus: micOn ? 'on' : 'off',
        cameraStatus: cameraOn ? 'on' : 'off',
        userId,
        createdAt: serverTimestamp(),
      });

      setRoomLink(`${window.location.origin}/join/${roomId}`);

      // ✅ Notify parent component
      onRoomCreated(roomId);

      // ✅ Navigate to room
      router.push(`/coworking/${roomId}?mic=${micOn ? 'on' : 'off'}&camera=${cameraOn ? 'on' : 'off'}`);
    } catch (error) {
      console.error('Error creating room:', error);
      setError('Failed to create room, please try again.');
    }
  };

  const handleJoinRoom = () => {
    const roomIdFromLink = pastedLink?.split('/join/')[1];
    const finalRoomId = roomIdFromLink || selectedRoomId;
    if (finalRoomId) {
      router.push(`/coworking/${finalRoomId}?mic=${micOn ? 'on' : 'off'}&camera=${cameraOn ? 'on' : 'off'}`);
    }
  };

  return (
    <div className="flex h-screen pt-5 p-20 bg-gray-200 text-black">
      <div className="flex-1 flex-col ml-20 bg-gray-100 m-10 rounded-2xl shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="object-cover w-full h-9/10 rounded-t-2xl bg-gray-200"
        />
        {!micOn && !cameraOn && (
          <div className="text-center text-sm text-gray-600 p-3">
            Both microphone and camera are turned off.
          </div>
        )}
        <div className="flex justify-center rounded-b-2xl space-x-6 bg-gray-100 p-5">
          <button onClick={() => setMicOn(!micOn)} className="p-4 rounded-full bg-gray-500 text-white hover:bg-gray-600">
            <FontAwesomeIcon icon={micOn ? faMicrophone : faMicrophoneSlash} />
          </button>
          <button onClick={() => setCameraOn(!cameraOn)} className="p-4 rounded-full bg-gray-500 text-white hover:bg-gray-600">
            <FontAwesomeIcon icon={cameraOn ? faVideo : faVideoSlash} />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 bg-gray-100 rounded-2xl p-5 mt-10 mr-50 h-full">
        <h2 className="text-lg text-center font-bold">Join an Existing Room</h2>
        <select
          value={selectedRoomId || ''}
          onChange={(e) => setSelectedRoomId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select an existing Room</option>
          {existingRooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Or paste a room link:"
          value={pastedLink}
          onChange={(e) => setPastedLink(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleJoinRoom}
          disabled={!selectedRoomId && !pastedLink}
          className="w-full bg-blue-800 text-white py-2 rounded disabled:bg-gray-400"
        >
          Join Room
        </button>
        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg text-center font-bold">Create a New Room</h2>

          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => {
              setRoomName(e.target.value);
              const generatedLink = `${window.location.origin}/room/${e.target.value.replace(/\s+/g, '-')}`;
              setRoomLink(generatedLink);
            }}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Objective (e.g., Study, Meeting)"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
            className="w-full p-2 border rounded"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          {visibility === 'private' && (
            <>
              <input
                type="number"
                placeholder="Limit of Participants"
                value={limit || ''}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
              <div className="space-y-2">
                <label className="block font-medium">Participant Emails</label>
                {participantEmails.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="email"
                      placeholder={`Email ${index + 1}`}
                      value={email}
                      onChange={(e) => {
                        const newEmails = [...participantEmails];
                        newEmails[index] = e.target.value;
                        setParticipantEmails(newEmails);
                      }}
                      className="w-full p-2 border rounded"
                      required
                    />
                    {participantEmails.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setParticipantEmails(participantEmails.filter((_, i) => i !== index))
                        }
                        className="text-red-500 hover:text-red-700 text-xl"
                      >
                        &minus;
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setParticipantEmails([...participantEmails, ''])}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-1"
                >
                  <span className="text-xl mr-1">+</span> Add another email
                </button>
              </div>
            </>
          )}

          {roomLink && (
            <div className="bg-white rounded border text-sm text-center relative">
              <div className="flex font-medium">
                <p className="flex-1 pt-2">Copy link: <span className=" break-all">{roomLink}</span></p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(roomLink)}
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-950 text-white rounded text-lg font-semibold h-12 w-full"
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
}
