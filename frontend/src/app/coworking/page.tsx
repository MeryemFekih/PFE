"use client"

import { useState } from "react"
import RoomPage from "@/components/ui/coworking/CreatingRoom"
import MeetingInterface from "@/components/ui/coworking/meetingInterface"

export default function CoworkingHome() {
  const [roomId, setRoomId] = useState<string | null>(null)

  return (
    <div>
      {!roomId ? <RoomPage onRoomCreated={(id: string) => setRoomId(id)} /> : <MeetingInterface roomId={roomId} />}
    </div>
  )
}
