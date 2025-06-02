'use client';

import { useParams } from 'next/navigation';
import MeetingInterface from '@/components/ui/coworking/meetingInterface';

export default function CoworkingRoomPage() {
  const { roomId } = useParams();

  return (
    <div>
      <MeetingInterface roomId={roomId as string} />
    </div>
  );
}
