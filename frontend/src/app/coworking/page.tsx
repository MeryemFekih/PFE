'use client'

import { useState } from 'react'
import CreateRoomForm from '@/components/ui/coworking/CreatingRoom'
import MeetingInterface from '@/components/ui/coworking/meetingInterface'

export default function CoworkingHome() {
  const [roomId, setRoomId] = useState<string | null>(null)

  return (
    <div>
      {!roomId ? (
        <CreateRoomForm onRoomCreated={(id: string) => setRoomId(id)} />
      ) : (
        <MeetingInterface roomId={roomId} />
      )}
    </div>
  )
}
