'use client';

import { useState, useEffect } from 'react';
import PostCard from '@/components/post-card';
import { getSuggestedEvents } from '@/lib/post-action';
import { addPostEventToPlanner } from '@/lib/event-action';
import { Session } from '@/lib/session';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUserTie } from 'react-icons/fa';

export default function SuggestedEventList({ session }: { session: Session }) {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadSuggestedEvents = async () => {
      if (!session?.user?.id || !session?.user?.interests?.length) return;

      try {
        const suggested = await getSuggestedEvents();
        console.log('✅ Suggested events fetched:', suggested);
        setEvents(suggested);
      } catch (err) {
        console.error('❌ Failed to load suggested events:', err);
      }
    };

    loadSuggestedEvents();
  }, [session?.user?.id, session?.user?.interests]);

  if (!events.length) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
        <div className="text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No suggested events found</p>
        <p className="text-sm text-gray-400 mt-1">We'll notify you when we find events matching your interests</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden cursor-pointer"
            onClick={() => setSelectedEvent(event)}
          >
            <div className="p-5">
              <div>
                <h3 className="font-bold text-gray-900">{event.title}</h3>
                <p className="text-sm text-indigo-600 font-medium">Based on : {event.subject}</p>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <FaCalendarAlt className="mr-2 text-indigo-700" />
                  {new Date(event.startDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                  {event.endDate && (
                    <>
                      <span className="mx-1">-</span>
                      {new Date(event.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </>
                  )}
                </div>

                {event.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-2 text-indigo-700" />
                    {event.location}
                  </div>
                )}

                {event.speakerId && (
                  <div className="flex items-center text-sm text-gray-500">
                    <FaUserTie className="mr-2 text-indigo-700" />
                    Speaker: {event.speakerName || 'Guest Speaker'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30 bg-opacity-30">
          <div className="max-w-2xl w-full p-4 bg-white rounded-l-sm rounded-r-sm overflow-y-auto max-h-[90vh] 
            /* Custom scrollbar styles */
            scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100
            /* For Webkit browsers */
            [&::-webkit-scrollbar]:w-2 
            
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-track]:bg-gray-50
            [&::-webkit-scrollbar-track]:rounded-xl">
            <PostCard
              post={selectedEvent}
              session={session}
              isPending={false}
              saved={false}
              onToggleSave={() => {}}
              onDelete={() => {}}
            />

            <button
              onClick={async () => {
                setIsAdding(true);
                try {
                  await addPostEventToPlanner(selectedEvent.id);
                  alert('✅ Event added to your planner!');
                } catch {
                  alert('❌ Failed to add event');
                } finally {
                  setIsAdding(false);
                }
              }}
              disabled={isAdding}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50 transition-colors"
            >
              {isAdding ? 'Adding...' : '📅 Add to My Planner'}
            </button>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-2 w-full py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}