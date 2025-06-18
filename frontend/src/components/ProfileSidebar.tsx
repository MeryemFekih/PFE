'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaChevronRight
} from 'react-icons/fa';
import { fetSessionInfo, fetchTasks, fetchEvents, filterEventsByDate } from '@/lib/planner';

export default function ProfileSidebar() {
  const [tasksReminder, setTasksReminder] = useState<any[]>([]);
  const [eventsTomorrow, setEventsTomorrow] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlannerData = async () => {
      try {
        setIsLoading(true);
        const { user, accessToken } = await fetSessionInfo();
        const [tasks, events] = await Promise.all([
          fetchTasks(user.id, accessToken),
          fetchEvents(user.id, accessToken),
        ]);

        const highPriorityTasks = tasks.filter(
          (task: any) => task.priority === 'HIGH' && task.status !== 'Done'
        );
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowEvents = filterEventsByDate(events, tomorrow);

        setTasksReminder(highPriorityTasks);
        setEventsTomorrow(tomorrowEvents);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlannerData();
  }, []);

  return (
    <aside className="fixed top-6 -right-8 h-[calc(100vh-2rem)] w-64 bg-white rounded-xl shadow-md p-6 hidden md:block overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Today's Overview</h2>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <h4 className="font-semibold text-sm text-red-700 flex items-center gap-2 mb-3">
                <FaExclamationTriangle className="text-red-600" /> Urgent Tasks
                {tasksReminder.length > 0 && (
                  <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {tasksReminder.length}
                  </span>
                )}
              </h4>
              {tasksReminder.length > 0 ? (
                <ul className="space-y-3">
                  {tasksReminder.slice(0, 3).map(task => (
                    <li 
                      key={task.id} 
                      className="bg-white p-3 rounded-md shadow-xs border border-red-50 hover:border-red-200 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2">{task.title}</p>
                          {task.dueDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">No urgent tasks 🎉</p>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-sm text-blue-700 flex items-center gap-2 mb-3">
                <FaCalendarAlt className="text-blue-600" /> Tomorrow's Events
                {eventsTomorrow.length > 0 && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {eventsTomorrow.length}
                  </span>
                )}
              </h4>
              {eventsTomorrow.length > 0 ? (
                <ul className="space-y-3">
                  {eventsTomorrow.map(event => (
                    <li 
                      key={event.id} 
                      className="bg-white p-3 rounded-md shadow-xs border border-blue-50 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{event.title}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                            <span>
                              {new Date(event.startTime).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {event.location && (
                              <span className="flex items-center">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mr-1"></span>
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">No events scheduled</p>
              )}
            </div>

            <Link
              href="/planner"
              className="flex items-center justify-between mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium p-3 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
            >
              <span>Go to Planner</span>
              <FaChevronRight className="text-xs" />
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}