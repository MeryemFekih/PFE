'use client'

import { useState } from 'react'
import RoomPage from '@/app/components/CreatingRoom';
import MeetingInterface from '@/app/components/meetingInterface';

export default function CoworkingHome() {
  const [roomId, setRoomId] = useState<string | null>(null)

  return (
    <div>
      {!roomId ? (
        <RoomPage onRoomCreated={(id: string) => setRoomId(id)} />
      ) : (
        <MeetingInterface roomId={roomId} />
      )}
    </div>
  )
}