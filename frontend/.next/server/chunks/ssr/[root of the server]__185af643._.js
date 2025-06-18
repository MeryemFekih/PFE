module.exports = {

"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/src/lib/constants.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BACKEND_URL": (()=>BACKEND_URL),
    "CHATBOT_API_KEY": (()=>CHATBOT_API_KEY),
    "PUBLIC_BACKEND_URL": (()=>PUBLIC_BACKEND_URL)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/lib/main.js [app-ssr] (ecmascript)");
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["config"])();
const BACKEND_URL = ("TURBOPACK compile-time truthy", 1) ? process.env.BACKEND_URL ?? "http://localhost:4000" : ("TURBOPACK unreachable", undefined);
const PUBLIC_BACKEND_URL = ("TURBOPACK compile-time value", "http://localhost:4000") ?? "http://localhost:4000";
const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY;
}}),
"[project]/src/lib/planner.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "EVENT_CATEGORIES": (()=>EVENT_CATEGORIES),
    "PRIORITIES": (()=>PRIORITIES),
    "STATUS": (()=>STATUS),
    "TASK_STATUSES": (()=>TASK_STATUSES),
    "calculateWeekEvents": (()=>calculateWeekEvents),
    "createEvent": (()=>createEvent),
    "createTask": (()=>createTask),
    "deleteEvent": (()=>deleteEvent),
    "deleteTask": (()=>deleteTask),
    "fetSessionInfo": (()=>fetSessionInfo),
    "fetchEvents": (()=>fetchEvents),
    "fetchTasks": (()=>fetchTasks),
    "filterEventsByDate": (()=>filterEventsByDate),
    "getCalendarDayClass": (()=>getCalendarDayClass),
    "getColorClasses": (()=>getColorClasses),
    "getStatusIcon": (()=>getStatusIcon),
    "moveTask": (()=>moveTask),
    "sendReminderSMS": (()=>sendReminderSMS),
    "updateEvent": (()=>updateEvent),
    "updateTask": (()=>updateTask)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-ssr] (ecmascript)");
;
const STATUS = [
    'To do',
    'In progress',
    'Done'
];
const PRIORITIES = [
    'LOW',
    'MEDIUM',
    'HIGH'
];
const TASK_STATUSES = [
    'TODO',
    'IN_PROGRESS'
];
const EVENT_CATEGORIES = [
    'MEETING',
    'CLASS',
    'EXAM',
    'SOCIAL',
    'OTHER'
];
const getColorClasses = (status)=>{
    switch(status){
        case 'To do':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'In progress':
            return 'bg-red-100 text-red-800 border-red-300';
        case 'Done':
            return 'bg-green-100 text-green-800 border-green-300';
        default:
            return '';
    }
};
function getCalendarDayClass(events, date) {
    const event = events.find((event)=>new Date(event.startTime).toDateString() === date.toDateString());
    if (!event) return '';
    switch(event.category){
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
const getStatusIcon = (status)=>{
    switch(status){
        case 'To do':
            return '📋';
        case 'In progress':
            return '🚧';
        case 'Done':
            return '✅';
        default:
            return '';
    }
};
const fetSessionInfo = async ()=>{
    const res = await fetch('/api/session');
    if (!res.ok) throw new Error('Session not found');
    return res.json();
};
const fetchTasks = async (userId, accessToken)=>{
    if (!userId) throw new Error('Invalid userId passed to fetchTasks');
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PUBLIC_BACKEND_URL"]}/tasks/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const data = await res.json();
    const statusMap = {
        TODO: 'To do',
        IN_PROGRESS: 'In progress',
        COMPLETED: 'Done'
    };
    return (Array.isArray(data) ? data : data.tasks ?? []).map((task)=>({
            ...task,
            status: statusMap[task.status] || task.status
        }));
};
const fetchEvents = async (userId, accessToken)=>{
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PUBLIC_BACKEND_URL"]}/events/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) throw new Error('Failed to fetch events');
    const data = await res.json();
    return Array.isArray(data) ? data : data.events ?? [];
};
const createTask = async (userId, accessToken, newTask)=>{
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PUBLIC_BACKEND_URL"]}/tasks/${userId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    });
    return res.ok;
};
const createEvent = async (userId, accessToken, newEvent)=>{
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PUBLIC_BACKEND_URL"]}/events/${userId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...newEvent,
            startTime: newEvent.startTime?.toISOString(),
            endTime: newEvent.endTime?.toISOString(),
            reminderAt: newEvent.reminderAt ? newEvent.reminderAt.toISOString() : null
        })
    });
    return res.ok;
};
const moveTask = async (taskId, newStatus, accessToken)=>{
    const reverseMap = {
        'To do': 'TODO',
        'In progress': 'IN_PROGRESS',
        'Done': 'COMPLETED'
    };
    await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PUBLIC_BACKEND_URL"]}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: reverseMap[newStatus]
        })
    });
};
const deleteTask = async (taskId, accessToken)=>{
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PUBLIC_BACKEND_URL"]}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return res.ok;
};
const calculateWeekEvents = (events)=>{
    const today = new Date();
    const start = new Date(today.setDate(today.getDate() - today.getDay()));
    const end = new Date(today.setDate(start.getDate() + 6));
    return events.filter((event)=>{
        const date = new Date(event.startTime);
        return date >= start && date <= end;
    });
};
const filterEventsByDate = (events, date)=>{
    return events.filter((event)=>{
        const eventDate = new Date(event.startTime);
        return eventDate.getDate() === date.getDate() && eventDate.getMonth() === date.getMonth() && eventDate.getFullYear() === date.getFullYear();
    });
};
async function sendReminderSMS({ phone, title, time }) {
    try {
        await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PUBLIC_BACKEND_URL"]}/notifications/sms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone,
                message: `Reminder: "${title}" is scheduled at ${new Date(time).toLocaleString()}`
            })
        });
    } catch (error) {
        console.error('Failed to send SMS reminder:', error);
    }
}
const deleteEvent = async (userId, eventId, accessToken)=>{
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PUBLIC_BACKEND_URL"]}/events/${userId}/${eventId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return res.ok;
};
const updateEvent = async (userId, eventId, accessToken, updatedData)=>{
    const payload = {
        title: updatedData.title,
        description: updatedData.description,
        startTime: updatedData.startTime,
        endTime: updatedData.endTime,
        category: updatedData.category,
        reminderAt: updatedData.reminderAt ?? null
    };
    console.log('Cleaned payload:', payload); // ✅ Safe to send
    console.log("Updating event with payload:", payload);
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PUBLIC_BACKEND_URL"]}/events/${userId}/${eventId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    return res.ok;
};
const updateTask = async (userId, taskId, accessToken, taskData)=>{
    const payload = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: {
            'To do': 'TODO',
            'In progress': 'IN_PROGRESS',
            'Done': 'COMPLETED'
        }[taskData.status] || taskData.status
    };
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PUBLIC_BACKEND_URL"]}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    return res.ok;
};
}}),
"[project]/src/app/planner/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>PlannerPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$datepicker$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-datepicker/dist/index.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/planner.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
function PlannerPage() {
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [events, setEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [selectedEvents, setSelectedEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [weekEvents, setWeekEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [accessToken, setAccessToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showReminderOptions, setShowReminderOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingEvent, setEditingEvent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingTask, setEditingTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [eventViewMode, setEventViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('week');
    const [newTask, setNewTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        description: '',
        priority: '',
        status: 'TODO'
    });
    const [newEvent, setNewEvent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        category: '',
        reminderAt: undefined
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const init = async ()=>{
            try {
                const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetSessionInfo"])();
                if (!session) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["redirect"])('/auth/signIn');
                const userId = session.user?.id;
                const accessToken = session.accessToken;
                if (!userId || !accessToken) throw new Error('Missing userId or token');
                setAccessToken(accessToken);
                setUserId(userId);
                const fetchedTasks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchTasks"])(`${userId}`, accessToken);
                setTasks(fetchedTasks);
                const fetchedEvents = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEvents"])(`${userId}`, accessToken);
                setEvents(fetchedEvents);
                setWeekEvents((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWeekEvents"])(fetchedEvents));
            } catch (err) {
                console.error('Init error:', err);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["redirect"])('/auth/signIn');
            } finally{
                setIsLoading(false);
            }
        };
        init();
    }, []);
    const handleCreateTask = async ()=>{
        if (!accessToken || !userId) return;
        const success = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTask"])(userId, accessToken, newTask);
        if (success) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success('Task created!');
            setNewTask({
                title: '',
                description: '',
                priority: '',
                status: ''
            });
            const updatedTasks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchTasks"])(userId, accessToken);
            setTasks(updatedTasks);
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error('Failed to create task');
        }
    };
    const handleCreateEvent = async ()=>{
        if (!accessToken) return;
        console.log('Sending event:', newEvent); // ✅ Add this here
        const success = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEvent"])(userId, accessToken, newEvent);
        if (success) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success('Event created!');
            setNewEvent({
                title: '',
                description: '',
                startTime: null,
                endTime: null,
                category: '',
                reminderAt: undefined
            });
            const updatedEvents = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEvents"])(userId, accessToken);
            setEvents(updatedEvents);
            setWeekEvents((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWeekEvents"])(updatedEvents));
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error('Failed to create event');
        }
    };
    const handleDeleteTask = async (taskId)=>{
        console.log('Deleting task:', taskId); // ✅ good for debugging
        if (!accessToken) return;
        const ok = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteTask"])(taskId, accessToken);
        if (ok) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success('Task deleted');
            const updatedTasks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchTasks"])(userId, accessToken);
            setTasks(updatedTasks);
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error('Failed to delete task');
        }
    };
    const handleMoveTask = async (taskId, newStatus)=>{
        if (!accessToken) return;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["moveTask"])(taskId, newStatus, accessToken);
        const updatedTasks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchTasks"])(userId, accessToken);
        setTasks(updatedTasks);
    };
    const handleFilterEvents = (date)=>{
        setSelectedDate(date);
        setSelectedEvents((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filterEventsByDate"])(events, date));
    };
    const getPriorityBadgeClasses = (priority)=>{
        switch(priority){
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
    const handleReminderSelection = (option)=>{
        if (!newEvent.startTime) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error("Please set a start time before choosing a reminder.");
            return;
        }
        const start = new Date(newEvent.startTime);
        let reminderAt;
        switch(option){
            case '1day':
                reminderAt = new Date(start.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '1hour':
                reminderAt = new Date(start.getTime() - 60 * 60 * 1000);
                break;
            default:
                return;
        }
        setNewEvent((prev)=>({
                ...prev,
                reminderAt
            }));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success(`Reminder set for ${reminderAt.toLocaleString()}`);
    };
    const handleDeleteEvent = async (id)=>{
        if (!accessToken || !userId) return;
        const ok = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteEvent"])(userId, id, accessToken); // needs to exist in lib/planner.ts
        if (ok) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success('Event deleted');
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEvents"])(userId, accessToken);
            setEvents(updated);
            setWeekEvents((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWeekEvents"])(updated));
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error('Failed to delete event');
        }
    };
    const filteredEvents = eventViewMode === 'week' ? weekEvents : events.filter((event)=>{
        const eventDate = new Date(event.startTime);
        const now = new Date();
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex  h-full bg-gray-100",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: " w-full bg-gray-100   ",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col p-5 min-h-screen gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: " flex justify-evenly  bg-white text-gray-900 rounded-xl shadow pt-6 pb-5 ",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold h-10 flex items-center",
                                    children: "Create Task"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 212,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: "pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none h-10",
                                    placeholder: "Title",
                                    value: newTask.title,
                                    onChange: (e)=>setNewTask({
                                            ...newTask,
                                            title: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 213,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    className: "pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none h-10",
                                    placeholder: "Description",
                                    value: newTask.description,
                                    onChange: (e)=>setNewTask({
                                            ...newTask,
                                            description: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 219,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 w-50 outline-none h-10",
                                    value: newTask.priority,
                                    onChange: (e)=>setNewTask({
                                            ...newTask,
                                            priority: e.target.value
                                        }),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            disabled: true,
                                            hidden: true,
                                            children: "Choose a priority"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/planner/page.tsx",
                                            lineNumber: 230,
                                            columnNumber: 13
                                        }, this),
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIORITIES"].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: p,
                                                children: p
                                            }, p, false, {
                                                fileName: "[project]/src/app/planner/page.tsx",
                                                lineNumber: 232,
                                                columnNumber: 15
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 225,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none w-50 h-10",
                                    value: newTask.status,
                                    onChange: (e)=>setNewTask({
                                            ...newTask,
                                            status: e.target.value
                                        }),
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TASK_STATUSES"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: s
                                        }, s, false, {
                                            fileName: "[project]/src/app/planner/page.tsx",
                                            lineNumber: 241,
                                            columnNumber: 35
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 236,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleCreateTask(),
                                    className: "bg-blue-900 hover:bg-gray-100 hover:border-2 hover:border-blue-900 hover:text-blue-900 text-white px-4  h-10 rounded-lg font-semibold transition flex items-center justify-center",
                                    children: "Add New Task"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 243,
                                    columnNumber: 9
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/planner/page.tsx",
                            lineNumber: 211,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-evenly bg-white text-gray-900 rounded-xl shadow pt-6 pb-5 flex-wrap gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold h-10 flex items-center",
                                    children: "Create Event"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 249,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: "pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none w-40 h-10",
                                    placeholder: "Title",
                                    value: newEvent.title,
                                    onChange: (e)=>setNewEvent({
                                            ...newEvent,
                                            title: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 250,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    className: "pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none w-40 h-10",
                                    placeholder: "Description",
                                    value: newEvent.description,
                                    onChange: (e)=>setNewEvent({
                                            ...newEvent,
                                            description: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 257,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$datepicker$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    selected: newEvent.startTime || null,
                                    onChange: (date)=>setNewEvent({
                                            ...newEvent,
                                            startTime: date
                                        }),
                                    minDate: new Date(),
                                    className: "pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none w-40 h-10",
                                    showTimeSelect: true,
                                    dateFormat: "Pp",
                                    placeholderText: "Start Time"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 264,
                                    columnNumber: 1
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$datepicker$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    selected: newEvent.endTime || null,
                                    onChange: (date)=>setNewEvent({
                                            ...newEvent,
                                            endTime: date
                                        }),
                                    minDate: new Date(),
                                    className: "pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none w-40 h-10",
                                    showTimeSelect: true,
                                    dateFormat: "Pp",
                                    placeholderText: "End Time"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 274,
                                    columnNumber: 1
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "pl-3 rounded-lg border border-gray-800 focus:ring-2 focus:ring-blue-400 outline-none w-40 h-10",
                                    value: newEvent.category,
                                    onChange: (e)=>setNewEvent({
                                            ...newEvent,
                                            category: e.target.value
                                        }),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            disabled: true,
                                            hidden: true,
                                            children: "The category"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/planner/page.tsx",
                                            lineNumber: 290,
                                            columnNumber: 5
                                        }, this),
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EVENT_CATEGORIES"].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: c,
                                                children: c
                                            }, c, false, {
                                                fileName: "[project]/src/app/planner/page.tsx",
                                                lineNumber: 292,
                                                columnNumber: 7
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 285,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowReminderOptions(!showReminderOptions),
                                            className: "flex items-center h-10 text-xl gap-2 text-red-700 hover:text-red-900",
                                            title: "Pick a reminder",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaBell"], {}, void 0, false, {
                                                fileName: "[project]/src/app/planner/page.tsx",
                                                lineNumber: 299,
                                                columnNumber: 11
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/planner/page.tsx",
                                            lineNumber: 296,
                                            columnNumber: 9
                                        }, this),
                                        showReminderOptions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute mt-2 w-48 bg-white shadow-md rounded-md border p-2 z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleReminderSelection('1day'),
                                                    className: "w-full text-left hover:bg-gray-100 px-2 py-1",
                                                    children: "1 day before"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleReminderSelection('1hour'),
                                                    className: "w-full text-left hover:bg-gray-100 px-2 py-1",
                                                    children: "1 hour before"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                    lineNumber: 304,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "pt-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$datepicker$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        selected: newEvent.reminderAt || null,
                                                        onChange: (date)=>setNewEvent({
                                                                ...newEvent,
                                                                reminderAt: date
                                                            }),
                                                        showTimeSelect: true,
                                                        dateFormat: "Pp",
                                                        className: "w-full border border-gray-300 rounded px-2 py-1",
                                                        placeholderText: "Pick a date"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                        lineNumber: 306,
                                                        columnNumber: 15
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 13
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/planner/page.tsx",
                                            lineNumber: 302,
                                            columnNumber: 11
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 295,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleCreateEvent(),
                                    className: "bg-blue-900 hover:bg-gray-100 hover:border-2 hover:border-blue-900 hover:text-blue-900 text-white px-4 h-10 rounded-lg font-semibold transition flex items-center justify-center",
                                    children: "Add New Event"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 318,
                                    columnNumber: 3
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/planner/page.tsx",
                            lineNumber: 247,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-4 mt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 grid grid-cols-1 md:grid-cols-3 gap-4",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STATUS"].map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                            layout: true,
                                            className: `rounded-xl p-6 shadow border-2 ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColorClasses"])(status)} max-h-[900px] overflow-y-auto`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-2xl font-bold mb-4 capitalize flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-3xl",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStatusIcon"])(status)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/planner/page.tsx",
                                                            lineNumber: 331,
                                                            columnNumber: 21
                                                        }, this),
                                                        " ",
                                                        status
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                    lineNumber: 330,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                    layout: true,
                                                    className: "space-y-4",
                                                    children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-400",
                                                        children: "Loading..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                        lineNumber: 335,
                                                        columnNumber: 23
                                                    }, this) : tasks.filter((task)=>task.status === status).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-400",
                                                        children: "No tasks yet ✨"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                        lineNumber: 338,
                                                        columnNumber: 25
                                                    }, this) : tasks.filter((task)=>task.status === status).map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                            layout: true,
                                                            onDoubleClick: ()=>setEditingTask(task),
                                                            className: "bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100 transition",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between items-start ",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-col gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                    className: "font-bold",
                                                                                    children: task.title
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                                                    lineNumber: 344,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-gray-700",
                                                                                    children: task.description
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                                                    lineNumber: 345,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-gray-500",
                                                                                    children: [
                                                                                        "Created: ",
                                                                                        new Date(task.createdAt).toLocaleDateString()
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                                                    lineNumber: 346,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/planner/page.tsx",
                                                                            lineNumber: 343,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleDeleteTask(task.id),
                                                                            className: "text-red-600 text-lg",
                                                                            children: "🗑️"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/planner/page.tsx",
                                                                            lineNumber: 348,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                                    lineNumber: 342,
                                                                    columnNumber: 28
                                                                }, this),
                                                                task.status !== 'Done' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-2 flex items-center justify-between",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex gap-2 items-center",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                                                                                    whileTap: {
                                                                                        scale: 0.8
                                                                                    },
                                                                                    whileHover: {
                                                                                        scale: 1.1
                                                                                    },
                                                                                    onClick: ()=>handleMoveTask(task.id, 'Done'),
                                                                                    className: "w-6 h-6 flex items-center justify-center rounded-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition",
                                                                                    title: "Mark as done",
                                                                                    children: "✓"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                                                    lineNumber: 353,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                task.status === 'To do' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                                                                                    whileTap: {
                                                                                        scale: 0.9
                                                                                    },
                                                                                    whileHover: {
                                                                                        scale: 1.1
                                                                                    },
                                                                                    onClick: ()=>handleMoveTask(task.id, 'In progress'),
                                                                                    className: "text-yellow-600 hover:text-white hover:bg-yellow-500 w-6 h-6 pl-1 flex items-center justify-center rounded-full border border-yellow-500 transition",
                                                                                    title: "Move to In Progress",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPlay"], {
                                                                                        className: "text-sm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                                        lineNumber: 357,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                                                    lineNumber: 356,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/planner/page.tsx",
                                                                            lineNumber: 352,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `text-xs font-medium px-3 py-1 border rounded-full ${getPriorityBadgeClasses(task.priority)}`,
                                                                            children: task.priority
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/planner/page.tsx",
                                                                            lineNumber: 363,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                                    lineNumber: 351,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, task.id, true, {
                                                            fileName: "[project]/src/app/planner/page.tsx",
                                                            lineNumber: 341,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                    lineNumber: 333,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, status, true, {
                                            fileName: "[project]/src/app/planner/page.tsx",
                                            lineNumber: 329,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 327,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full md:w-1/3 bg-white text-gray-800 p-6 rounded-xl shadow flex flex-col space-y-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full flex flex-col bg-white text-gray-800 p-6 rounded-xl shadow space-y-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-xl font-bold",
                                                        children: "Your Calendar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                        lineNumber: 387,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white w-full p-2 ",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$datepicker$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            selected: selectedDate,
                                                            onChange: (date)=>{
                                                                setSelectedDate(date);
                                                                setSelectedEvents((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filterEventsByDate"])(events, date));
                                                            },
                                                            inline: true,
                                                            calendarStartDay: 1,
                                                            className: "w-full",
                                                            dayClassName: (date)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCalendarDayClass"])(events, date)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/planner/page.tsx",
                                                            lineNumber: 390,
                                                            columnNumber: 11
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                        lineNumber: 389,
                                                        columnNumber: 9
                                                    }, this),
                                                    selectedEvents.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col space-y-3 mt-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-xl font-bold",
                                                                children: [
                                                                    "Events on ",
                                                                    selectedDate?.toDateString()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                lineNumber: 405,
                                                                columnNumber: 5
                                                            }, this),
                                                            selectedEvents.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "p-4 flex flex-col bg-gray-50 border-2 border-gray-200 rounded-lg shadow-md",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-start",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex flex-col",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-semibold text-base",
                                                                                        children: event.title
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                                        lineNumber: 415,
                                                                                        columnNumber: 13
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-gray-700 text-sm",
                                                                                        children: event.description
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                                        lineNumber: 416,
                                                                                        columnNumber: 13
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-sm text-gray-500 mt-1",
                                                                                        children: [
                                                                                            new Date(event.startTime).toLocaleTimeString(),
                                                                                            " -",
                                                                                            ' ',
                                                                                            new Date(event.endTime).toLocaleTimeString()
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                                        lineNumber: 417,
                                                                                        columnNumber: 13
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                                lineNumber: 414,
                                                                                columnNumber: 11
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex flex-col items-end gap-6 -mr-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-xs text-gray-500 font-medium",
                                                                                        children: event.category
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                                        lineNumber: 425,
                                                                                        columnNumber: 13
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "flex gap-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                title: "Edit",
                                                                                                onClick: ()=>setEditingEvent(event),
                                                                                                className: "h-8 w-8 flex items-center justify-center rounded-lg border-2 border-blue-700 bg-blue-400 hover:bg-blue-600 transition",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPen"], {
                                                                                                    className: "text-white text-sm"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                                                                    lineNumber: 435,
                                                                                                    columnNumber: 17
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                                                lineNumber: 430,
                                                                                                columnNumber: 15
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                title: "Delete",
                                                                                                onClick: ()=>handleDeleteEvent(event.id),
                                                                                                className: "group relative flex h-8 w-8 items-center justify-center rounded-lg border-2 border-red-800 bg-red-400 hover:bg-red-600 overflow-hidden transition",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTrash"], {
                                                                                                    className: "text-white group-hover:rotate-12 duration-300 text-sm"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                                                                    lineNumber: 444,
                                                                                                    columnNumber: 17
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                                                lineNumber: 439,
                                                                                                columnNumber: 15
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                                        lineNumber: 429,
                                                                                        columnNumber: 13
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                                lineNumber: 424,
                                                                                columnNumber: 11
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                        lineNumber: 412,
                                                                        columnNumber: 9
                                                                    }, this)
                                                                }, event.id, false, {
                                                                    fileName: "[project]/src/app/planner/page.tsx",
                                                                    lineNumber: 408,
                                                                    columnNumber: 7
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 3
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-400 text-sm mt-2",
                                                        children: "No events for this day"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                        lineNumber: 454,
                                                        columnNumber: 3
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/planner/page.tsx",
                                                lineNumber: 386,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col space-y-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                className: "text-xl font-bold",
                                                                children: "Events"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                lineNumber: 460,
                                                                columnNumber: 9
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: eventViewMode,
                                                                onChange: (e)=>setEventViewMode(e.target.value),
                                                                className: "border border-gray-300 rounded px-2 py-1 text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "week",
                                                                        children: "This Week"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                        lineNumber: 466,
                                                                        columnNumber: 11
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "month",
                                                                        children: "This Month"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                        lineNumber: 467,
                                                                        columnNumber: 11
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                lineNumber: 461,
                                                                columnNumber: 9
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                        lineNumber: 459,
                                                        columnNumber: 7
                                                    }, this),
                                                    filteredEvents.length > 0 ? filteredEvents.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-4 flex flex-col  bg-gray-50 border-2 border-gray-300 rounded-lg shadow-md",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-start",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-semibold text-base",
                                                                                children: event.title
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                                lineNumber: 476,
                                                                                columnNumber: 13
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-gray-600 text-sm",
                                                                                children: event.description
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                                lineNumber: 477,
                                                                                columnNumber: 13
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm text-gray-500 mt-1",
                                                                                children: new Date(event.startTime).toLocaleDateString()
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                                lineNumber: 478,
                                                                                columnNumber: 13
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                        lineNumber: 475,
                                                                        columnNumber: 11
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col items-end gap-6 -mr-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs text-gray-500 font-medium",
                                                                                children: event.category
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                                lineNumber: 485,
                                                                                columnNumber: 13
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        title: "Edit",
                                                                                        onClick: ()=>setEditingEvent(event),
                                                                                        className: "h-8 w-8 flex items-center justify-center rounded-lg border-2 border-blue-700 bg-blue-400 hover:bg-blue-600 transition",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPen"], {
                                                                                            className: "text-white text-sm"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/planner/page.tsx",
                                                                                            lineNumber: 493,
                                                                                            columnNumber: 17
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                                        lineNumber: 488,
                                                                                        columnNumber: 15
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        title: "Delete",
                                                                                        onClick: ()=>handleDeleteEvent(event.id),
                                                                                        className: "group relative flex h-8 w-8 items-center justify-center rounded-lg border-2 border-red-800 bg-red-400 hover:bg-red-600 overflow-hidden transition",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTrash"], {
                                                                                            className: "text-white group-hover:rotate-12 duration-300 text-sm"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/planner/page.tsx",
                                                                                            lineNumber: 502,
                                                                                            columnNumber: 17
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                                        lineNumber: 497,
                                                                                        columnNumber: 15
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                                lineNumber: 487,
                                                                                columnNumber: 13
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                                        lineNumber: 484,
                                                                        columnNumber: 11
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/planner/page.tsx",
                                                                lineNumber: 473,
                                                                columnNumber: 9
                                                            }, this)
                                                        }, event.id, false, {
                                                            fileName: "[project]/src/app/planner/page.tsx",
                                                            lineNumber: 472,
                                                            columnNumber: 7
                                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-400 text-sm",
                                                        children: "No events this week"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/planner/page.tsx",
                                                        lineNumber: 510,
                                                        columnNumber: 5
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/planner/page.tsx",
                                                lineNumber: 458,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/planner/page.tsx",
                                        lineNumber: 383,
                                        columnNumber: 7
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planner/page.tsx",
                                    lineNumber: 380,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/planner/page.tsx",
                            lineNumber: 326,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/planner/page.tsx",
                    lineNumber: 210,
                    columnNumber: 7
                }, this),
                editingTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black/70 bg-opacity-40 backdrop-blur-sm   z-50 flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white text-black p-6 rounded-lg w-full max-w-md shadow-xl flex flex-col gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold",
                                children: "Edit Task"
                            }, void 0, false, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 524,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "border p-2 rounded",
                                value: editingTask.title,
                                onChange: (e)=>setEditingTask({
                                        ...editingTask,
                                        title: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 525,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                className: "border p-2 rounded",
                                value: editingTask.description,
                                onChange: (e)=>setEditingTask({
                                        ...editingTask,
                                        description: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 530,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "border p-2 rounded",
                                value: editingTask.priority,
                                onChange: (e)=>setEditingTask({
                                        ...editingTask,
                                        priority: e.target.value
                                    }),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select priority"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/planner/page.tsx",
                                        lineNumber: 540,
                                        columnNumber: 9
                                    }, this),
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIORITIES"].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: p
                                        }, p, false, {
                                            fileName: "[project]/src/app/planner/page.tsx",
                                            lineNumber: 542,
                                            columnNumber: 11
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 535,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "border p-2 rounded",
                                value: editingTask.status,
                                onChange: (e)=>setEditingTask({
                                        ...editingTask,
                                        status: e.target.value
                                    }),
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TASK_STATUSES"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        children: s
                                    }, s, false, {
                                        fileName: "[project]/src/app/planner/page.tsx",
                                        lineNumber: 551,
                                        columnNumber: 11
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 545,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between mt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setEditingTask(null),
                                        className: "bg-red-700 hover:bg-gray-100 hover:border-2 hover:border-b-red-900 hover:text-red-900 text-white px-4 h-10 rounded-lg font-semibold  flex items-center justify-center",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/planner/page.tsx",
                                        lineNumber: 555,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: async ()=>{
                                            if (!accessToken || !userId) return;
                                            const ok = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateTask"])(userId, editingTask.id, accessToken, editingTask);
                                            if (ok) {
                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success('Task updated');
                                                setEditingTask(null);
                                                const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchTasks"])(userId, accessToken);
                                                setTasks(updated);
                                            } else {
                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error('Failed to update task');
                                            }
                                        },
                                        className: "bg-blue-900 hover:bg-gray-100 hover:border-2 hover:border-b-blue-900 hover:text-blue-900 text-white px-4 h-10 rounded-lg font-semibold  flex items-center justify-center",
                                        children: "Save"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/planner/page.tsx",
                                        lineNumber: 561,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 554,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/planner/page.tsx",
                        lineNumber: 523,
                        columnNumber: 5
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/planner/page.tsx",
                    lineNumber: 522,
                    columnNumber: 3
                }, this),
                editingEvent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black/70 bg-opacity-40 backdrop-blur-sm flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white text-black p-6 rounded-lg w-full max-w-md drop-shadow-cyan-950 shadow-2xl flex flex-col gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold ",
                                children: "Edit Event"
                            }, void 0, false, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 586,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "border p-2 rounded",
                                value: editingEvent.title,
                                onChange: (e)=>setEditingEvent({
                                        ...editingEvent,
                                        title: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 587,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                className: "border p-2 rounded",
                                value: editingEvent.description,
                                onChange: (e)=>setEditingEvent({
                                        ...editingEvent,
                                        description: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 592,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$datepicker$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                selected: new Date(editingEvent.startTime),
                                onChange: (date)=>setEditingEvent({
                                        ...editingEvent,
                                        startTime: date
                                    }),
                                minDate: new Date(),
                                showTimeSelect: true,
                                dateFormat: "Pp",
                                className: "border p-2 rounded"
                            }, void 0, false, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 597,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$datepicker$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                selected: new Date(editingEvent.endTime),
                                onChange: (date)=>setEditingEvent({
                                        ...editingEvent,
                                        endTime: date
                                    }),
                                minDate: new Date(),
                                showTimeSelect: true,
                                dateFormat: "Pp",
                                className: "border p-2 rounded"
                            }, void 0, false, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 605,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "border p-2 rounded",
                                value: editingEvent.category,
                                onChange: (e)=>setEditingEvent({
                                        ...editingEvent,
                                        category: e.target.value
                                    }),
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EVENT_CATEGORIES"].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        children: c
                                    }, c, false, {
                                        fileName: "[project]/src/app/planner/page.tsx",
                                        lineNumber: 619,
                                        columnNumber: 11
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 613,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between mt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setEditingEvent(null),
                                        className: "bg-red-700 hover:bg-gray-100 hover:border-2 hover:border-b-red-900 hover:text-red-900 text-white px-4 h-10 rounded-lg font-semibold  flex items-center justify-center",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/planner/page.tsx",
                                        lineNumber: 624,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: async ()=>{
                                            if (!accessToken || !userId) return;
                                            const ok = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateEvent"])(userId, editingEvent.id, accessToken, editingEvent);
                                            if (ok) {
                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success("Event updated");
                                                setEditingEvent(null);
                                                const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEvents"])(userId, accessToken);
                                                setEvents(updated);
                                                setWeekEvents((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$planner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWeekEvents"])(updated));
                                            } else {
                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error("Failed to update");
                                            }
                                        },
                                        className: "bg-blue-900 hover:bg-gray-100 hover:border-2 hover:border-b-blue-900 hover:text-blue-900 text-white px-4 h-10 rounded-lg font-semibold  flex items-center justify-center",
                                        children: "Save"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/planner/page.tsx",
                                        lineNumber: 630,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/planner/page.tsx",
                                lineNumber: 623,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/planner/page.tsx",
                        lineNumber: 585,
                        columnNumber: 5
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/planner/page.tsx",
                    lineNumber: 584,
                    columnNumber: 3
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/planner/page.tsx",
            lineNumber: 208,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/planner/page.tsx",
        lineNumber: 207,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__185af643._.js.map