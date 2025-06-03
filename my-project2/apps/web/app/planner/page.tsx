/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import {getCalendarDayClass ,STATUS,PRIORITIES,TASK_STATUSES,EVENT_CATEGORIES,getColorClasses,getStatusIcon,fetSessionInfo,fetchTasks,fetchEvents,createTask,createEvent,moveTask,calculateWeekEvents,filterEventsByDate, deleteTask, updateEvent, deleteEvent, updateTask} from '@/lib/planner';
import {FaBell,  FaPen, FaPlay, FaTrash } from 'react-icons/fa';


export default function PlannerPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);
  const [weekEvents, setWeekEvents] = useState<any[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReminderOptions, setShowReminderOptions] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [editingTask, setEditingTask] = useState<any | null>(null);
const [eventViewMode, setEventViewMode] = useState<'week' | 'month'>('week');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: '',
    status: 'TODO',
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    category: '',
    reminderAt: undefined as Date | undefined,
  });

  useEffect(() => {
    const init = async () => {
  try {
    const session = await fetSessionInfo();
    if (!session) redirect('/auth/signIn');

    const userId: number = session.user?.id;
    const accessToken = session.accessToken;

    if (!userId || !accessToken) throw new Error('Missing userId or token');

    setAccessToken(accessToken);
    setUserId(userId);

    const fetchedTasks = await fetchTasks(userId, accessToken);
    setTasks(fetchedTasks);

    const fetchedEvents = await fetchEvents(userId, accessToken);
    setEvents(fetchedEvents);
    setWeekEvents(calculateWeekEvents(fetchedEvents));
  } catch (err) {
    console.error('Init error:', err);
    redirect('/auth/signIn');
  } finally {
    setIsLoading(false);
  }
};

    init();
  }, []);

  const handleCreateTask = async () => {
    if (!accessToken || !userId) return;
    const success = await createTask(userId, accessToken, newTask);
    if (success) {
      toast.success('Task created!');
      setNewTask({
        title: '',
        description: '',
        priority: '',
        status: '',
      });
      const updatedTasks = await fetchTasks(userId, accessToken);
      setTasks(updatedTasks);
    } else {
      toast.error('Failed to create task');
    }
  };

  const handleCreateEvent = async () => {
    if (!accessToken) return;
    console.log('Sending event:', newEvent); // ✅ Add this here

    const success = await createEvent(userId!, accessToken, newEvent);
    if (success) {
      toast.success('Event created!');
      setNewEvent({
        title: '',
        description: '',
        startTime: newEvent.startTime ? newEvent.startTime.toString() : '',
        endTime: newEvent.endTime ? newEvent.endTime.toString() : '',
        category: '',
        reminderAt: undefined as Date | undefined,
      });
      const updatedEvents = await fetchEvents(userId!, accessToken);
      setEvents(updatedEvents);
      setWeekEvents(calculateWeekEvents(updatedEvents));
    } else {
      toast.error('Failed to create event');
    }
  };
  const handleDeleteTask = async (taskId: string) => {
    console.log('Deleting task:', taskId); // ✅ good for debugging
    if (!accessToken) return;
  
    const ok = await deleteTask(taskId, accessToken);
    if (ok) {
      toast.success('Task deleted');
      const updatedTasks = await fetchTasks(userId!, accessToken);
      setTasks(updatedTasks);
    } else {
      toast.error('Failed to delete task');
    }
  };
  
  
  
  
  const handleMoveTask = async (taskId: string, newStatus: 'To do' | 'In progress' | 'Done') => {
    if (!accessToken) return;
    await moveTask(taskId, newStatus, accessToken);
    const updatedTasks = await fetchTasks(userId!, accessToken);
    setTasks(updatedTasks);
  };

  const handleFilterEvents = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvents(filterEventsByDate(events, date));
  };

  const getPriorityBadgeClasses = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-700 border-red-500';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-500';
      case 'LOW':
        return 'bg-green-100 text-green-700 border-green-500';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  type ReminderOption = '1day' | '1hour';

const handleReminderSelection = (option: ReminderOption) => {
  if (!newEvent.startTime) {
    toast.error("Please set a start time before choosing a reminder.");
    return;
  }

  const start = new Date(newEvent.startTime);
  let reminderAt: Date;

  switch (option) {
    case '1day':
      reminderAt = new Date(start.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '1hour':
      reminderAt = new Date(start.getTime() - 60 * 60 * 1000);
      break;
    default:
      return;
  }

  setNewEvent((prev) => ({ ...prev, reminderAt }));
  toast.success(`Reminder set for ${reminderAt.toLocaleString()}`);
};

const handleDeleteEvent = async (id: string) => {
  if (!accessToken || !userId) return;
  const ok = await deleteEvent(userId, id, accessToken); // needs to exist in lib/planner.ts
  if (ok) {
    toast.success('Event deleted');
    const updated = await fetchEvents(userId, accessToken);
    setEvents(updated);
    setWeekEvents(calculateWeekEvents(updated));
  } else {
    toast.error('Failed to delete event');
  }
};
const filteredEvents = eventViewMode === 'week'
  ? weekEvents
  : events.filter(event => {
      const eventDate = new Date(event.startTime);
      const now = new Date();
      return (
        eventDate.getMonth() === now.getMonth() &&
        eventDate.getFullYear() === now.getFullYear()
      );
    });

  return (

    <div className="flex h-full bg-gray-100">
      <main className="flex-3/2 mx-auto bg-gray-100 rounded-r-3xl  ">
      
      <div className="flex flex-col p-5 min-h-screen gap-3">
        <div className=" flex justify-evenly  bg-white text-gray-900 rounded-xl shadow pt-6 pb-5 ">
        <h2 className="text-xl font-bold h-10 flex items-center">Create Task</h2>
        <input
          className="pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none h-10"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          className="pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none h-10"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
            className="pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 w-50 outline-none h-10"
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
          >
            <option value="" disabled hidden>Choose a priority</option>
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

        <select
          className="pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none w-50 h-10"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
        >
          {TASK_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => handleCreateTask()} className="bg-blue-900 hover:bg-gray-100 hover:border-2 hover:border-b-blue-900 hover:text-blue-900 text-white px-4 h-10 rounded-lg font-semibold transition flex items-center justify-center">
          Add New Task
        </button>
        </div>
        <div className="flex justify-evenly bg-white text-gray-900 rounded-xl shadow pt-6 pb-5 flex-wrap gap-3">
  
  <h2 className="text-xl font-bold h-10 flex items-center">Create Event</h2>
  <input
    className="pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none w-40 h-10"
    placeholder="Title"
    value={newEvent.title}
    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
  />

  <textarea
    className="pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none w-40 h-10"
    placeholder="Description"
    value={newEvent.description}
    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
  />

<DatePicker
  selected={newEvent.startTime ? new Date(newEvent.startTime) : null}
  onChange={(date) => setNewEvent({ ...newEvent, startTime: date?.toISOString() || '' })}
  minDate={new Date()} // ✅ Prevent past date selection
  className="pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none w-40 h-10"
  showTimeSelect
  dateFormat="Pp"
  placeholderText="Start Time"
/>

<DatePicker
  selected={newEvent.endTime ? new Date(newEvent.endTime) : null}
  onChange={(date) => setNewEvent({ ...newEvent, endTime: date?.toISOString() || '' })}
  minDate={new Date()}
  className="pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none w-40 h-10"
  showTimeSelect
  dateFormat="Pp"
  placeholderText="End Time"
/>


  <select
    className="pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none w-40 h-10"
    value={newEvent.category}
    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
  >
    <option value="" disabled hidden>The category</option>
    {EVENT_CATEGORIES.map(c => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>
  <div className="relative">
        <button
          onClick={() => setShowReminderOptions(!showReminderOptions)} className="flex items-center h-10 text-xl gap-2 text-red-700 hover:text-red-900"
            title="Pick a reminder">
          <FaBell /> 
        </button>
        {showReminderOptions && (
          <div className="absolute mt-2 w-48 bg-white shadow-md rounded-md border p-2 z-10">
            <button onClick={() => handleReminderSelection('1day')} className="w-full text-left hover:bg-gray-100 px-2 py-1">1 day before</button>
            <button onClick={() => handleReminderSelection('1hour')} className="w-full text-left hover:bg-gray-100 px-2 py-1">1 hour before</button>
            <div className="pt-2">
              <DatePicker
                selected={newEvent.reminderAt || null}
                onChange={(date) => setNewEvent({ ...newEvent, reminderAt: date! })}
                showTimeSelect
                dateFormat="Pp"
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholderText="Pick a date"
              />
            </div>
          </div>
        )}
      </div>
  <button
    onClick={() => handleCreateEvent()}
    className="bg-blue-900 hover:bg-gray-100 hover:border-2 hover:border-b-blue-900 hover:text-blue-900 text-white px-4 h-10 rounded-lg font-semibold transition flex items-center justify-center"
  >
    Add New Event
  </button>
</div>

          <div className="flex gap-6 mt-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {STATUS.map((status) => (
                <motion.div layout key={status} className={`rounded-xl p-6 shadow border-2 ${getColorClasses(status)} max-h-[900px] overflow-y-auto`}>
                  <h2 className="text-2xl font-bold mb-4 capitalize flex items-center gap-2">
                    <span className="text-3xl">{getStatusIcon(status)}</span> {status}
                  </h2>
                  <motion.div layout className="space-y-4">
                    {isLoading ? (
                      <p className="text-gray-400">Loading...</p>
                    ) : (
                      tasks.filter((task) => task.status === status).length === 0 ? (
                        <p className="text-gray-400">No tasks yet ✨</p>
                      ) : (
                        tasks.filter((task) => task.status === status).map((task) => (
                        <motion.div layout key={task.id} onDoubleClick={() => setEditingTask(task)} className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100 transition">
                           <div className='flex justify-between items-start ' >
                              <div className="flex flex-col gap-2">
                                <h4 className="font-bold">{task.title}</h4>
                                <p className="text-sm text-gray-700">{task.description}</p>
                                <p className="text-xs text-gray-500">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                              </div>
                              <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 text-lg">🗑️</button>
                           </div>
                           {task.status !== 'Done' && (
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex gap-2 items-center">
                              <motion.button whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.1 }} onClick={() => handleMoveTask(task.id, 'Done')} className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition" title="Mark as done">✓
                              </motion.button>
                              {task.status === 'To do' && (
                                <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} onClick={() => handleMoveTask(task.id, 'In progress')} className="text-yellow-600 hover:text-white hover:bg-yellow-500 w-6 h-6 pl-1 flex items-center justify-center rounded-full border border-yellow-500 transition" title="Move to In Progress" >
                                  <FaPlay className="text-sm" />
                                </motion.button>
                              )}
                            </div>

                            {/* Priority badge aligned right */}
                            <span
                              className={`text-xs font-medium px-3 py-1 border rounded-full ${getPriorityBadgeClasses(task.priority)}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        )}                             
                                                  
                                                    
                        </motion.div>
                        ))
                      )
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <div className="w-full md:w-1/3 bg-white text-gray-800 p-6 rounded-xl shadow flex flex-col space-y-6">
      
      {/* Calendar and selected day events */}
      <div className="w-full flex flex-col bg-white text-gray-800 p-6 rounded-xl shadow space-y-6">

      {/* Calendar */}
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold">Your Calendar</h2>

        <div className="bg-white w-full p-2 ">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date!);
              setSelectedEvents(filterEventsByDate(events, date!));
            }}
            inline
            calendarStartDay={1}
            className="w-full" 
            dayClassName={(date) => getCalendarDayClass(events, date)}
          />
        </div>

        {selectedEvents.length > 0 ? (
  <div className="flex flex-col space-y-3 mt-2">
    <h3 className="text-xl font-bold">Events on {selectedDate?.toDateString()}</h3>

    {selectedEvents.map((event) => (
      <div
        key={event.id}
        className="p-4 flex flex-col bg-gray-50 border-2 border-gray-200 rounded-lg shadow-md"
      >
        <div className="flex justify-between items-start">
          {/* Left - Event Info */}
          <div className="flex flex-col">
            <span className="font-semibold text-base">{event.title}</span>
            <span className="text-gray-700 text-sm">{event.description}</span>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(event.startTime).toLocaleTimeString()} -{' '}
              {new Date(event.endTime).toLocaleTimeString()}
            </p>
          </div>

          {/* Right - Category and Actions */}
          <div className="flex flex-col items-end gap-6 -mr-2">
            <span className="text-xs text-gray-500 font-medium">
              {event.category}
            </span>

            <div className="flex gap-2">
              <button
                title="Edit"
                onClick={() => setEditingEvent(event)} 
                className="h-8 w-8 flex items-center justify-center rounded-lg border-2 border-blue-700 bg-blue-400 hover:bg-blue-600 transition"
              >
                <FaPen className="text-white text-sm" />
              </button>

              {/* Trash Button */}
              <button
                title="Delete"
                onClick={() => handleDeleteEvent(event.id)} // ✅ add your delete logic
                className="group relative flex h-8 w-8 items-center justify-center rounded-lg border-2 border-red-800 bg-red-400 hover:bg-red-600 overflow-hidden transition"
              >
                <FaTrash className="text-white group-hover:rotate-12 duration-300 text-sm" />
              </button>
            </div>

          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-400 text-sm mt-2">No events for this day</p>
)}
  </div>

      <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Events</h2>
        <select
          value={eventViewMode}
          onChange={(e) => setEventViewMode(e.target.value as 'week' | 'month')}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
      {filteredEvents.length > 0 ? (
      filteredEvents.map(event => (
      <div key={event.id} className="p-4 flex flex-col  bg-gray-50 border-2 border-gray-300 rounded-lg shadow-md">
        <div className="flex justify-between items-start">
          {/* Left: Event details */}
          <div className="flex flex-col">
            <span className="font-semibold text-base">{event.title}</span>
            <span className="text-gray-600 text-sm">{event.description}</span>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(event.startTime).toLocaleDateString()}
            </p>
          </div>

          {/* Right: Category + Actions */}
          <div className="flex flex-col items-end gap-6 -mr-2">
            <span className="text-xs text-gray-500 font-medium">{event.category}</span>

            <div className="flex gap-2">
              <button
                title="Edit"
                onClick={() => setEditingEvent(event)} 
                className="h-8 w-8 flex items-center justify-center rounded-lg border-2 border-blue-700 bg-blue-400 hover:bg-blue-600 transition"
              >
                <FaPen className="text-white text-sm" />
              </button>

              {/* Trash Button */}
              <button
                title="Delete"
                onClick={() => handleDeleteEvent(event.id)} // ✅ add your delete logic
                className="group relative flex h-8 w-8 items-center justify-center rounded-lg border-2 border-red-800 bg-red-400 hover:bg-red-600 overflow-hidden transition"
              >
                <FaTrash className="text-white group-hover:rotate-12 duration-300 text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-400 text-sm">No events this week</p>
  )}
</div>

      </div>

    </div>
    </div>
    </div>


{editingTask && (
  <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-white text-black p-6 rounded-lg w-full max-w-md shadow-xl flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Edit Task</h2>
      <input
        className="border p-2 rounded"
        value={editingTask.title}
        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
      />
      <textarea
        className="border p-2 rounded"
        value={editingTask.description}
        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
      />
      <select
        className="border p-2 rounded"
        value={editingTask.priority}
        onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
      >
        <option value="">Select priority</option>
        {PRIORITIES.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      <select
        className="border p-2 rounded"
        value={editingTask.status}
        onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
      >
        {TASK_STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setEditingTask(null)}
          className="bg-red-700 hover:bg-gray-100 hover:border-2 hover:border-b-red-900 hover:text-red-900 text-white px-4 h-10 rounded-lg font-semibold  flex items-center justify-center"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            if (!accessToken || !userId) return;
            const ok = await updateTask(userId, editingTask.id, accessToken, editingTask);
            if (ok) {
              toast.success('Task updated');
              setEditingTask(null);
              const updated = await fetchTasks(userId, accessToken);
              setTasks(updated);
            } else {
              toast.error('Failed to update task');
            }
          }}
          className="bg-blue-900 hover:bg-gray-100 hover:border-2 hover:border-b-blue-900 hover:text-blue-900 text-white px-4 h-10 rounded-lg font-semibold  flex items-center justify-center"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    {editingEvent && (
  <div className="fixed inset-0 backdrop-blur-sm  flex items-center justify-center">
    <div className="bg-white text-black p-6 rounded-lg w-full max-w-md drop-shadow-cyan-950 shadow-2xl flex flex-col gap-4">
      <h2 className="text-xl font-semibold ">Edit Event</h2>
      <input
        className="border p-2 rounded"
        value={editingEvent.title}
        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
      />
      <textarea
        className="border p-2 rounded"
        value={editingEvent.description}
        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
      />
      <DatePicker
        selected={new Date(editingEvent.startTime)}
        onChange={(date) => setEditingEvent({ ...editingEvent, startTime: date! })}
        minDate={new Date()}
        showTimeSelect
        dateFormat="Pp"
        className="border p-2 rounded"
      />
      <DatePicker
        selected={new Date(editingEvent.endTime)}
        onChange={(date) => setEditingEvent({ ...editingEvent, endTime: date! })}
        minDate={new Date()}
        showTimeSelect
        dateFormat="Pp"
        className="border p-2 rounded"
      />
      <select
        className="border p-2 rounded"
        value={editingEvent.category}
        onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
      >
        {EVENT_CATEGORIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setEditingEvent(null)}
          className="bg-red-700 hover:bg-gray-100 hover:border-2 hover:border-b-red-900 hover:text-red-900 text-white px-4 h-10 rounded-lg font-semibold  flex items-center justify-center"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            if (!accessToken || !userId) return;
            const ok = await updateEvent(userId, editingEvent.id, accessToken, editingEvent);
            if (ok) {
              toast.success("Event updated");
              setEditingEvent(null);
              const updated = await fetchEvents(userId, accessToken);
              setEvents(updated);
              setWeekEvents(calculateWeekEvents(updated));
            } else {
              toast.error("Failed to update");
            }
          }}
          className="bg-blue-900 hover:bg-gray-100 hover:border-2 hover:border-b-blue-900 hover:text-blue-900 text-white px-4 h-10 rounded-lg font-semibold  flex items-center justify-center"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </main>
    </div>
  );
}
