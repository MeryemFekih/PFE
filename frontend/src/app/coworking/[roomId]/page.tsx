"use client"

import { useParams } from "next/navigation"
import MeetingInterface from "@/components/ui/coworking/meetingInterface"
import { useEffect, useState } from "react"

export default function CoworkingRoomPage() {
  const params = useParams()
  const [roomId, setRoomId] = useState<string | null>(null)

  useEffect(() => {
    const id =
      typeof params?.roomId === "string" ? params.roomId : Array.isArray(params?.roomId) ? params.roomId[0] : null
    setRoomId(id)
  }, [params])

  if (!roomId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <MeetingInterface roomId={roomId} />
    </div>
  )
}
