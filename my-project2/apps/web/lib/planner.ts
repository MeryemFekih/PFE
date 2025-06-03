import { NEXT_PUBLIC_BACKEND_URL } from './constants';
import { Session } from './session';

export const STATUS = ['To do', 'In progress', 'Done'];
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
export const TASK_STATUSES = ['TODO', 'IN_PROGRESS'];
export const EVENT_CATEGORIES = ['MEETING', 'CLASS', 'EXAM', 'SOCIAL', 'OTHER'];

export const getColorClasses = (status: string) => {
  switch (status) {
    case 'To do': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'In progress': return 'bg-red-100 text-red-800 border-red-300';
    case 'Done': return 'bg-green-100 text-green-800 border-green-300';
    default: return '';
  }
};
export function getCalendarDayClass(events: any[], date: Date): string {
  const event = events.find(
    (event) => new Date(event.startTime).toDateString() === date.toDateString()
  );

  if (!event) return '';

  switch (event.category) {
    case 'MEETING':
      return 'bg-blue-200 text-blue-800 font-semibold rounded-full';
    case 'CLASS':
      return 'bg-green-200 text-green-800 font-semibold rounded-full';
    case 'EXAM':
      return 'bg-red-200 text-red-800 font-semibold rounded-full';
    case 'SOCIAL':
      return 'bg-pink-200 text-pink-800 font-semibold rounded-full';
    case 'OTHER':
    default:
      return 'bg-gray-300 text-gray-800 font-semibold rounded-full';
  }
}


export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'To do': return '📋';
    case 'In progress': return '🚧';
    case 'Done': return '✅';
    default: return '';
  }
};

    export const fetSessionInfo = async (): Promise<Session> => {
    const res = await fetch('/api/session');
    if (!res.ok) throw new Error('Session not found');
    return res.json();
    };

export const fetchTasks = async (userId: number, accessToken: string) => {
  if (!userId) throw new Error('Invalid userId passed to fetchTasks');

  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/tasks/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Failed to fetch tasks');

  const data = await res.json();
  const statusMap = {
    TODO: 'To do',
    IN_PROGRESS: 'In progress',
    COMPLETED: 'Done',
  };

  return (Array.isArray(data) ? data : data.tasks ?? []).map((task: any) => ({
    ...task,
    status: statusMap[task.status as keyof typeof statusMap] || task.status,
  }));
};

export const fetchEvents = async (userId: number, accessToken: string) => {
  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/events/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Failed to fetch events');

  const data = await res.json();
  return Array.isArray(data) ? data : data.events ?? [];
};

export const createTask = async (
  userId: number,
  accessToken: string,
  newTask: any
) => {
  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/tasks/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
  });

  return res.ok;
};

export const createEvent = async (
  userId: number,
  accessToken: string,
  newEvent: any
) => {
  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/events/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...newEvent,
      startTime: newEvent.startTime?.toISOString(),
      endTime: newEvent.endTime?.toISOString(),
      reminderAt: newEvent.reminderAt ? newEvent.reminderAt.toISOString() : null,
  
    }),  });

  return res.ok;
};

export const moveTask = async (
  taskId: string,
  newStatus: 'To do' | 'In progress' | 'Done',
  accessToken: string
) => {
  const reverseMap = {
    'To do': 'TODO',
    'In progress': 'IN_PROGRESS',
    'Done': 'COMPLETED',
  };

  await fetch(`${NEXT_PUBLIC_BACKEND_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: reverseMap[newStatus] }),
  });
};
export const deleteTask = async (taskId: string, accessToken: string) => {
    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    return res.ok;
  };
  
  
export const calculateWeekEvents = (events: any[]) => {
  const today = new Date();
  const start = new Date(today.setDate(today.getDate() - today.getDay()));
  const end = new Date(today.setDate(start.getDate() + 6));

  return events.filter(event => {
    const date = new Date(event.startTime);
    return date >= start && date <= end;
  });
};

export const filterEventsByDate = (events: any[], date: Date) => {
  return events.filter(event => {
    const eventDate = new Date(event.startTime);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
};
export async function sendReminderSMS({
  phone,
  title,
  time,
}: {
  phone: string;
  title: string;
  time: Date;
}) {
  try {
    await fetch(`${NEXT_PUBLIC_BACKEND_URL}/notifications/sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        message: `Reminder: "${title}" is scheduled at ${new Date(time).toLocaleString()}`,
      }),
    });
  } catch (error) {
    console.error('Failed to send SMS reminder:', error);
  }
}

export const deleteEvent = async (
  userId: number,
  eventId: string,
  accessToken: string
) => {
  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}events/${userId}/${eventId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.ok;
};

export const updateEvent = async (
  userId: number,
  eventId: string,
  accessToken: string,
  updatedData: any
) => {
  const payload = {
    title: updatedData.title,
    description: updatedData.description,
    startTime: updatedData.startTime,
    endTime: updatedData.endTime,
    category: updatedData.category,
    reminderAt: updatedData.reminderAt ?? null, // optional
  };
  console.log('Cleaned payload:', payload); // ✅ Safe to send
  console.log("Updating event with payload:", payload);

  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}events/${userId}/${eventId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return res.ok;
};

export const updateTask = async (
  userId: number,
  taskId: string,
  accessToken: string,
  taskData: any
) => {
  const payload = {
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    status: {
      'To do': 'TODO',
      'In progress': 'IN_PROGRESS',
      'Done': 'COMPLETED'
    }[taskData.status as 'To do' | 'In progress' ] || taskData.status, // convert to enum format
  };

  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return res.ok;
};