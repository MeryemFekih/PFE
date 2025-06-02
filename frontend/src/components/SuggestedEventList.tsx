'use client';

import { useState, useEffect } from 'react';
import PostCard from '@/components/post-card';
import { getSuggestedEvents } from '@/lib/post-action';
import { addPostEventToPlanner } from '@/lib/event-action';
import { Session } from '@/lib/session';

export default function SuggestedEventList({ session }: { session: Session }) {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // ✅ Load suggested events once session is available
  useEffect(() => {
    const loadSuggestedEvents = async () => {
      if (!session?.user?.id || !session?.user?.interests?.length) return;

      try {
        const suggested = await getSuggestedEvents(); // ✅ No userId param needed
        console.log('✅ Suggested events fetched:', suggested);
        setEvents(suggested);
      } catch (err) {
        console.error('❌ Failed to load suggested events:', err);
      }
    };

    loadSuggestedEvents();
  }, [session?.user?.id, session?.user?.interests]);

  // ✅ Render fallback if no suggestions
  if (!events.length) {
    return (
      <p className="text-gray-400 italic text-sm">
        No suggested events found.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="cursor-pointer p-3 border rounded bg-white shadow hover:bg-blue-50"
            onDoubleClick={() => setSelectedEvent(event)}
          >
            <p className="font-semibold">{event.title}</p>
            <p className="text-sm text-gray-500">{event.subject}</p>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex  items-center justify-center backdrop-blur-md border-2 border-gray-400 shadow-2xl   bg-opacity-50">
          <div className="max-w-2xl w-full p-4 bg-white rounded-lg overflow-y-auto max-h-[90vh]">
            <PostCard
              post={selectedEvent}
              session={session}
              isPending={false}
              saved={false}
              onToggleSave={() => {}}
              onDelete={() => {}}
            />

            {/* ✅ Add to Planner using full post object (not just ID) */}
            <button
              onClick={async () => {
                setIsAdding(true);
                try {
                  await addPostEventToPlanner(selectedEvent); // ✅ pass full event
                  alert('✅ Event added to your planner!');
                } catch {
                  alert('❌ Failed to add event');
                } finally {
                  setIsAdding(false);
                }
              }}
              disabled={isAdding}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
            >
              {isAdding ? 'Adding...' : '📅 Add to My Planner'}
            </button>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-2 text-gray-500 hover:text-gray-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
  