module.exports = {

"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[project]/src/lib/constants.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BACKEND_URL": (()=>BACKEND_URL),
    "CHATBOT_API_KEY": (()=>CHATBOT_API_KEY),
    "PUBLIC_BACKEND_URL": (()=>PUBLIC_BACKEND_URL)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/lib/main.js [app-rsc] (ecmascript)");
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["config"])();
const BACKEND_URL = ("TURBOPACK compile-time truthy", 1) ? process.env.BACKEND_URL ?? "http://localhost:4000" : ("TURBOPACK unreachable", undefined);
const PUBLIC_BACKEND_URL = ("TURBOPACK compile-time value", "http://localhost:4000") ?? "http://localhost:4000";
const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY;
}}),
"[project]/src/lib/post-action.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"0048ac9409408413134cd3b20b877dfe2ed2e8b610":"getApprovedPosts","009e6f18c84f9d17b84e29d26aed5b7a33c271beba":"fetchSavedPostsMap","00e433008ff16ae54814c71bf4497a7f669762825c":"getSuggestedEvents","00f1bd19af7f3fe35d1d06e2940ff60a72410032ad":"getPostsByUser","4006fed6d871d6804baeda5542876b8aac7c0632a1":"getPostById","402bc24d24ead01607c639311380afe64b07c281ee":"participateInPost","404a2f01d34c2a949328e743a689f590c21c6b3074":"savePost","4086c580a6ebb9e07e0c31d1acc1c8f2e4b37dfe9b":"deletePost","40a07c72c4ab1d0f9fc9b6b3456c685acbc94285c1":"addPostEventToPlanner","40b31c2c2b257ff859de7511994494dc716ad44ba9":"createPost","40c123de786de505d91123917b85f10026a06a9f65":"unsavePost","6014c1d7d0c09cc22aeaa9205e8008b2d23f8f8ea1":"toggleSavePost","60736e632678ae35a972a93957949c50e9ce954d05":"getPostParticipants","60c4aef1472bf6282bdb35f4f944bbdbff3fcbae1e":"requestParticipantRemoval"} */ __turbopack_context__.s({
    "addPostEventToPlanner": (()=>addPostEventToPlanner),
    "createPost": (()=>createPost),
    "deletePost": (()=>deletePost),
    "fetchSavedPostsMap": (()=>fetchSavedPostsMap),
    "getApprovedPosts": (()=>getApprovedPosts),
    "getPostById": (()=>getPostById),
    "getPostParticipants": (()=>getPostParticipants),
    "getPostsByUser": (()=>getPostsByUser),
    "getSuggestedEvents": (()=>getSuggestedEvents),
    "participateInPost": (()=>participateInPost),
    "requestParticipantRemoval": (()=>requestParticipantRemoval),
    "savePost": (()=>savePost),
    "toggleSavePost": (()=>toggleSavePost),
    "unsavePost": (()=>unsavePost)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getApprovedPosts() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/auth/signIn');
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            },
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to load posts');
        const posts = await res.json();
        // ✅ Only show public posts to PUBLIC users
        if (session.user.role === 'PUBLIC') {
            return posts.filter((post)=>post.visibility === 'PUBLIC');
        }
        return posts;
    } catch (err) {
        console.error('Error loading posts:', err);
        return [];
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getPostById(postId) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/auth/signIn');
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post/${postId}`, {
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch post');
        return await res.json();
    } catch (err) {
        console.error('Error fetching post:', err);
        return null;
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ createPost(formData) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/auth/signIn');
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            },
            body: formData
        });
        if (!res.ok) {
            const errorBody = await res.text(); // raw error message
            console.error('Backend responded with:', res.status, errorBody);
            throw new Error('Post creation failed');
        }
        // ✅ FIX: return the result so the frontend gets confirmation
        return await res.json();
    } catch (err) {
        console.error('Error creating post:', err);
        return null;
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ deletePost(postId) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/auth/signIn');
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post/${postId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        });
        if (!res.ok) throw new Error('Delete failed');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/university');
    } catch (err) {
        console.error('Error deleting post:', err);
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getPostsByUser() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/auth/signIn');
    const userId = session.user.id;
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            },
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch user posts');
        return await res.json();
    } catch (err) {
        console.error('Error fetching user posts:', err);
        return [];
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ savePost(postId) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/auth/signIn');
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post/${postId}/save`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        });
        if (!res.ok) throw new Error('Failed to save post');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/profile'); // Or wherever you want to update
    } catch (err) {
        console.error('Error saving post:', err);
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ unsavePost(postId) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/auth/signIn');
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post/${postId}/unsave`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        });
        if (!res.ok) throw new Error('Failed to unsave post');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/profile');
    } catch (err) {
        console.error('Error unsaving post:', err);
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ toggleSavePost(postId, isCurrentlySaved) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/auth/signIn');
    try {
        const endpoint = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post/${postId}/${isCurrentlySaved ? 'unsave' : 'save'}`;
        const method = isCurrentlySaved ? 'DELETE' : 'POST';
        console.log(`Attempting to ${isCurrentlySaved ? 'unsave' : 'save'} post ${postId}`);
        const res = await fetch(endpoint, {
            method,
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        let responseData;
        try {
            responseData = await res.json();
        } catch (e) {
            responseData = await res.text();
        }
        if (!res.ok) {
            const errorMessage = responseData.message || responseData || `Failed to ${isCurrentlySaved ? 'unsave' : 'save'} post`;
            console.error(`${errorMessage} (Status: ${res.status})`);
            throw new Error(errorMessage);
        }
        console.log(`Successfully ${isCurrentlySaved ? 'unsaved' : 'saved'} post ${postId}:`, responseData);
        return responseData;
    } catch (error) {
        console.error('Error in toggleSavePost:', error);
        throw error;
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ fetchSavedPostsMap() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) return {};
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post/saved`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        },
        cache: 'no-store'
    });
    if (!res.ok) {
        console.error('❌ Failed to fetch saved posts');
        return {};
    }
    const data = await res.json();
    const map = {};
    data.forEach((post)=>{
        map[post.id] = true;
    });
    return map;
}
function mapEventTypeToCategory(eventType) {
    switch(eventType){
        case 'CONFERENCE':
            return 'MEETING';
        case 'WORKSHOP':
            return 'CLASS';
        case 'HACKATHON_ALERT':
            return 'SOCIAL';
        default:
            return 'OTHER';
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ addPostEventToPlanner(post) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session?.user?.id || !session.accessToken) return;
    const response = await fetch(`${process.env.BACKEND_URL}/events/${session.user.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
            title: post.title,
            description: post.content || '',
            startTime: post.startDate,
            endTime: post.endDate,
            category: mapEventTypeToCategory(post.eventType),
            reminderAt: null
        })
    });
    if (!response.ok) {
        console.error('❌ Failed to add event:', await response.text());
        throw new Error('Failed to add event');
    }
    return await response.json();
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getSuggestedEvents() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session?.accessToken) {
        console.warn('⚠️ No session or access token');
        return [];
    }
    const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post/events/suggested`;
    console.log('📡 Fetching suggested events from:', url);
    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            },
            cache: 'no-store'
        });
        console.log('📥 Response status:', res.status);
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`❌ Failed to fetch suggested events (${res.status}):`, errorText);
            return [];
        }
        const data = await res.json();
        console.log('✅ Suggested events data:', data);
        return data;
    } catch (err) {
        console.error('❌ Network or parsing error:', err);
        return [];
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ participateInPost(postId) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session?.accessToken) throw new Error('Not authenticated');
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post/${postId}/participate`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || 'Could not participate');
        }
        return await res.json(); // You can return success message or participation info
    } catch (err) {
        console.error('❌ Error participating in post:', err);
        throw err;
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getPostParticipants(postId, token) {
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post/${postId}/participants`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch participants');
    return res.json();
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ requestParticipantRemoval(participationId, reason) {
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/post/${participationId}/request-removal`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reason
        })
    });
    if (!res.ok) throw new Error('Failed to request removal');
    return res.json();
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getApprovedPosts,
    getPostById,
    createPost,
    deletePost,
    getPostsByUser,
    savePost,
    unsavePost,
    toggleSavePost,
    fetchSavedPostsMap,
    addPostEventToPlanner,
    getSuggestedEvents,
    participateInPost,
    getPostParticipants,
    requestParticipantRemoval
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getApprovedPosts, "0048ac9409408413134cd3b20b877dfe2ed2e8b610", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPostById, "4006fed6d871d6804baeda5542876b8aac7c0632a1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createPost, "40b31c2c2b257ff859de7511994494dc716ad44ba9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deletePost, "4086c580a6ebb9e07e0c31d1acc1c8f2e4b37dfe9b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPostsByUser, "00f1bd19af7f3fe35d1d06e2940ff60a72410032ad", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(savePost, "404a2f01d34c2a949328e743a689f590c21c6b3074", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(unsavePost, "40c123de786de505d91123917b85f10026a06a9f65", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleSavePost, "6014c1d7d0c09cc22aeaa9205e8008b2d23f8f8ea1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchSavedPostsMap, "009e6f18c84f9d17b84e29d26aed5b7a33c271beba", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addPostEventToPlanner, "40a07c72c4ab1d0f9fc9b6b3456c685acbc94285c1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSuggestedEvents, "00e433008ff16ae54814c71bf4497a7f669762825c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(participateInPost, "402bc24d24ead01607c639311380afe64b07c281ee", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPostParticipants, "60736e632678ae35a972a93957949c50e9ce954d05", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(requestParticipantRemoval, "60c4aef1472bf6282bdb35f4f944bbdbff3fcbae1e", null);
}}),
"[project]/src/lib/comment-action.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"40484940d33e7877f3371e9172f81505c929c2e772":"getComments","6027510579779897a7ffa457a925f316c0dbec5165":"createComment"} */ __turbopack_context__.s({
    "createComment": (()=>createComment),
    "getComments": (()=>getComments)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getComments(postId) {
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/comment/post/${postId}`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        return await res.json();
    } catch (err) {
        console.error('Error loading comments:', err);
        return [];
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ createComment(postId, text) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/auth/signIn');
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/comment/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({
                text
            })
        });
        if (!res.ok) throw new Error('Failed to create comment');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/faculty`);
        return await res.json();
    } catch (err) {
        console.error('Error creating comment:', err);
        return null;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getComments,
    createComment
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getComments, "40484940d33e7877f3371e9172f81505c929c2e772", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createComment, "6027510579779897a7ffa457a925f316c0dbec5165", null);
}}),
"[project]/src/lib/user-action.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"007e22d8ca451bd1b2fc40b0c18470fa3ea5d50e15":"getSuggestedUsers","4053c9815823913aba1288cf8a8d670299a252d769":"getUserProfileWithPosts","4054fa3fddeb9314acd84490c8fd2b94e13af3ba4b":"checkIfFollowing","406389f79bf1bd2cbec02679755919d153e6a162b8":"getFollowDetails","40837c385fffb01fcb5877507e225861babdee0cd5":"searchUsers","605cde22bc8c3c677762a0b9b73016ce18fa27544b":"toggleFollow"} */ __turbopack_context__.s({
    "checkIfFollowing": (()=>checkIfFollowing),
    "getFollowDetails": (()=>getFollowDetails),
    "getSuggestedUsers": (()=>getSuggestedUsers),
    "getUserProfileWithPosts": (()=>getUserProfileWithPosts),
    "searchUsers": (()=>searchUsers),
    "toggleFollow": (()=>toggleFollow)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
/**
 * Normalize interests: convert to lowercase and trim whitespace
 */ function normalizeInterests(interests) {
    if (Array.isArray(interests)) {
        return interests.map((i)=>i.toLowerCase().trim());
    }
    if (typeof interests === 'string') {
        return interests.split(',').map((i)=>i.toLowerCase().trim());
    }
    return [];
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getSuggestedUsers() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session?.user?.interests) return [];
    const sessionInterests = normalizeInterests(session.user.interests);
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/user/shared-interests`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        });
        if (!res.ok) throw new Error('Failed to fetch backend suggestions');
        const users = await res.json();
        const filtered = users.filter((u)=>u.id !== session.user.id).map((u)=>{
            const userInterests = Array.isArray(u.interests) ? u.interests : [];
            // Match lowercase, return original-cased shared interests
            const sharedInterests = userInterests.filter((interest)=>sessionInterests.includes(interest.toLowerCase().trim()));
            return {
                ...u,
                sharedInterests
            };
        }).filter((u)=>u.sharedInterests.length > 0); // Only return users with shared interests
        return filtered.length > 5 ? filtered.sort(()=>0.5 - Math.random()).slice(0, 5) : filtered;
    } catch (err) {
        console.error('❌ Suggestion fetch error:', err);
        return [];
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getUserProfileWithPosts(targetUserId) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    const viewerId = session?.user?.id || 0;
    const viewerRole = session?.user?.role || 'PUBLIC';
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/user/${targetUserId}/posts`, {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const targetUser = await res.json();
        return {
            ...targetUser,
            canFollow: viewerRole !== 'PUBLIC' && viewerId !== targetUserId,
            canMessage: viewerId !== targetUserId,
            isOwnProfile: viewerId === targetUserId
        };
    } catch (err) {
        console.error('❌ Profile fetch error:', err);
        return null;
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ checkIfFollowing(targetUserId) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session?.accessToken) return false;
    const res = await fetch(`${process.env.BACKEND_URL}/user/${targetUserId}/is-following`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        }
    });
    if (!res.ok) {
        console.error('Failed to check follow status');
        return false;
    }
    return await res.json(); // should return true or false
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ toggleFollow(targetUserId, isCurrentlyFollowing) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session?.accessToken) return false;
    const method = isCurrentlyFollowing ? 'DELETE' : 'POST';
    const res = await fetch(`${process.env.BACKEND_URL}/user/${targetUserId}/${isCurrentlyFollowing ? 'unfollow' : 'follow'}`, {
        method,
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        }
    });
    if (!res.ok) {
        console.error(`❌ Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'} user`);
        return isCurrentlyFollowing; // fallback to previous state
    }
    return !isCurrentlyFollowing;
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ searchUsers(query) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session?.accessToken) throw new Error('Not authenticated');
    try {
        console.log("🔑 Session in search:", session);
        console.log("🔁 FETCHING FROM:", ("TURBOPACK compile-time value", "http://localhost:4000"));
        console.log("🛡️ Access Token:", session?.accessToken);
        const res = await fetch(`${process.env.BACKEND_URL}/user/search?query=${encodeURIComponent(query)}`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        });
        if (!res.ok) {
            throw new Error('Failed to search users');
        }
        return await res.json();
    } catch (err) {
        console.error('❌ User search error:', err);
        return [];
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getFollowDetails(accessToken) {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/user/follow-details`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            cache: 'no-store'
        });
        if (!res.ok) {
            throw new Error('Failed to fetch follow details');
        }
        return await res.json(); // returns { followersCount, followingCount, followers, following }
    } catch (error) {
        console.error('❌ Follow details error:', error);
        return null;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getSuggestedUsers,
    getUserProfileWithPosts,
    checkIfFollowing,
    toggleFollow,
    searchUsers,
    getFollowDetails
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSuggestedUsers, "007e22d8ca451bd1b2fc40b0c18470fa3ea5d50e15", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserProfileWithPosts, "4053c9815823913aba1288cf8a8d670299a252d769", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkIfFollowing, "4054fa3fddeb9314acd84490c8fd2b94e13af3ba4b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleFollow, "605cde22bc8c3c677762a0b9b73016ce18fa27544b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(searchUsers, "40837c385fffb01fcb5877507e225861babdee0cd5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getFollowDetails, "406389f79bf1bd2cbec02679755919d153e6a162b8", null);
}}),
"[project]/src/lib/event-action.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"40cc04d6fa5635a7dda7338f8c90255c7e032f427c":"addPostEventToPlanner"} */ __turbopack_context__.s({
    "addPostEventToPlanner": (()=>addPostEventToPlanner)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ addPostEventToPlanner(postId) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session?.accessToken) throw new Error('Not authenticated');
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/events/add-to-planner/${postId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        }
    });
    if (!res.ok) throw new Error('Failed to add event to planner');
    return await res.json();
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    addPostEventToPlanner
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addPostEventToPlanner, "40cc04d6fa5635a7dda7338f8c90255c7e032f427c", null);
}}),
"[project]/.next-internal/server/app/university/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/session.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/post-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/lib/comment-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/lib/user-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/lib/event-action.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}}),
"[project]/.next-internal/server/app/university/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/session.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/post-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/lib/comment-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/lib/user-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/lib/event-action.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/post-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/comment-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/user-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/event-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/university/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/session.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/post-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/lib/comment-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/lib/user-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/src/lib/event-action.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/university/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/session.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/post-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/lib/comment-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/lib/user-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/lib/event-action.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "0048ac9409408413134cd3b20b877dfe2ed2e8b610": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getApprovedPosts"]),
    "004a1f2009fb4167eb02d3d49d686e954be8e445a0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteSession"]),
    "007e22d8ca451bd1b2fc40b0c18470fa3ea5d50e15": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSuggestedUsers"]),
    "009e6f18c84f9d17b84e29d26aed5b7a33c271beba": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSavedPostsMap"]),
    "00d75c814791e0528916f64078a2e1baacf7af8683": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"]),
    "00e433008ff16ae54814c71bf4497a7f669762825c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSuggestedEvents"]),
    "00f1bd19af7f3fe35d1d06e2940ff60a72410032ad": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPostsByUser"]),
    "4006fed6d871d6804baeda5542876b8aac7c0632a1": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPostById"]),
    "400daa95f65e69493bea74ad0186404f8e43d7fabd": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSession"]),
    "402bc24d24ead01607c639311380afe64b07c281ee": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["participateInPost"]),
    "40484940d33e7877f3371e9172f81505c929c2e772": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getComments"]),
    "404a2f01d34c2a949328e743a689f590c21c6b3074": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["savePost"]),
    "4053c9815823913aba1288cf8a8d670299a252d769": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserProfileWithPosts"]),
    "4054fa3fddeb9314acd84490c8fd2b94e13af3ba4b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkIfFollowing"]),
    "406389f79bf1bd2cbec02679755919d153e6a162b8": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFollowDetails"]),
    "40837c385fffb01fcb5877507e225861babdee0cd5": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["searchUsers"]),
    "4086c580a6ebb9e07e0c31d1acc1c8f2e4b37dfe9b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deletePost"]),
    "40a07c72c4ab1d0f9fc9b6b3456c685acbc94285c1": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addPostEventToPlanner"]),
    "40b31c2c2b257ff859de7511994494dc716ad44ba9": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createPost"]),
    "40c123de786de505d91123917b85f10026a06a9f65": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unsavePost"]),
    "40cc04d6fa5635a7dda7338f8c90255c7e032f427c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addPostEventToPlanner"]),
    "40fcff674d29c57bde0e7e36d166b7cfbc5716b8dc": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateTokens"]),
    "6014c1d7d0c09cc22aeaa9205e8008b2d23f8f8ea1": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleSavePost"]),
    "6027510579779897a7ffa457a925f316c0dbec5165": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createComment"]),
    "605cde22bc8c3c677762a0b9b73016ce18fa27544b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleFollow"]),
    "60736e632678ae35a972a93957949c50e9ce954d05": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPostParticipants"]),
    "60c4aef1472bf6282bdb35f4f944bbdbff3fcbae1e": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requestParticipantRemoval"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/post-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/comment-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/user-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/event-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/university/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/session.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/post-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/lib/comment-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/lib/user-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/src/lib/event-action.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/university/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/session.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/post-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/lib/comment-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/lib/user-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/lib/event-action.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "0048ac9409408413134cd3b20b877dfe2ed2e8b610": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["0048ac9409408413134cd3b20b877dfe2ed2e8b610"]),
    "004a1f2009fb4167eb02d3d49d686e954be8e445a0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["004a1f2009fb4167eb02d3d49d686e954be8e445a0"]),
    "007e22d8ca451bd1b2fc40b0c18470fa3ea5d50e15": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["007e22d8ca451bd1b2fc40b0c18470fa3ea5d50e15"]),
    "009e6f18c84f9d17b84e29d26aed5b7a33c271beba": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["009e6f18c84f9d17b84e29d26aed5b7a33c271beba"]),
    "00d75c814791e0528916f64078a2e1baacf7af8683": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00d75c814791e0528916f64078a2e1baacf7af8683"]),
    "00e433008ff16ae54814c71bf4497a7f669762825c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00e433008ff16ae54814c71bf4497a7f669762825c"]),
    "00f1bd19af7f3fe35d1d06e2940ff60a72410032ad": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00f1bd19af7f3fe35d1d06e2940ff60a72410032ad"]),
    "4006fed6d871d6804baeda5542876b8aac7c0632a1": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4006fed6d871d6804baeda5542876b8aac7c0632a1"]),
    "400daa95f65e69493bea74ad0186404f8e43d7fabd": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["400daa95f65e69493bea74ad0186404f8e43d7fabd"]),
    "402bc24d24ead01607c639311380afe64b07c281ee": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["402bc24d24ead01607c639311380afe64b07c281ee"]),
    "40484940d33e7877f3371e9172f81505c929c2e772": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40484940d33e7877f3371e9172f81505c929c2e772"]),
    "404a2f01d34c2a949328e743a689f590c21c6b3074": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["404a2f01d34c2a949328e743a689f590c21c6b3074"]),
    "4053c9815823913aba1288cf8a8d670299a252d769": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4053c9815823913aba1288cf8a8d670299a252d769"]),
    "4054fa3fddeb9314acd84490c8fd2b94e13af3ba4b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4054fa3fddeb9314acd84490c8fd2b94e13af3ba4b"]),
    "406389f79bf1bd2cbec02679755919d153e6a162b8": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["406389f79bf1bd2cbec02679755919d153e6a162b8"]),
    "40837c385fffb01fcb5877507e225861babdee0cd5": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40837c385fffb01fcb5877507e225861babdee0cd5"]),
    "4086c580a6ebb9e07e0c31d1acc1c8f2e4b37dfe9b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4086c580a6ebb9e07e0c31d1acc1c8f2e4b37dfe9b"]),
    "40a07c72c4ab1d0f9fc9b6b3456c685acbc94285c1": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40a07c72c4ab1d0f9fc9b6b3456c685acbc94285c1"]),
    "40b31c2c2b257ff859de7511994494dc716ad44ba9": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40b31c2c2b257ff859de7511994494dc716ad44ba9"]),
    "40c123de786de505d91123917b85f10026a06a9f65": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40c123de786de505d91123917b85f10026a06a9f65"]),
    "40cc04d6fa5635a7dda7338f8c90255c7e032f427c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40cc04d6fa5635a7dda7338f8c90255c7e032f427c"]),
    "40fcff674d29c57bde0e7e36d166b7cfbc5716b8dc": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40fcff674d29c57bde0e7e36d166b7cfbc5716b8dc"]),
    "6014c1d7d0c09cc22aeaa9205e8008b2d23f8f8ea1": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["6014c1d7d0c09cc22aeaa9205e8008b2d23f8f8ea1"]),
    "6027510579779897a7ffa457a925f316c0dbec5165": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["6027510579779897a7ffa457a925f316c0dbec5165"]),
    "605cde22bc8c3c677762a0b9b73016ce18fa27544b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["605cde22bc8c3c677762a0b9b73016ce18fa27544b"]),
    "60736e632678ae35a972a93957949c50e9ce954d05": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60736e632678ae35a972a93957949c50e9ce954d05"]),
    "60c4aef1472bf6282bdb35f4f944bbdbff3fcbae1e": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60c4aef1472bf6282bdb35f4f944bbdbff3fcbae1e"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/university/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/session.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/post-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/lib/comment-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/lib/user-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/src/lib/event-action.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$university$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$comment$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$user$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$event$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/university/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/session.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/post-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/lib/comment-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/lib/user-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/src/lib/event-action.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/university/faculty-page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/university/faculty-page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/university/faculty-page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/university/faculty-page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/university/faculty-page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/university/faculty-page.tsx", "default");
}}),
"[project]/src/app/university/faculty-page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$university$2f$faculty$2d$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/university/faculty-page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$university$2f$faculty$2d$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/university/faculty-page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$university$2f$faculty$2d$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/university/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>UniversityPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$university$2f$faculty$2d$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/university/faculty-page.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/post-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function UniversityPage() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session || !session.user) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/auth/signIn');
    }
    try {
        const posts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$post$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getApprovedPosts"])() || [];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$university$2f$faculty$2d$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
            posts: posts,
            session: session
        }, void 0, false, {
            fileName: "[project]/src/app/university/page.tsx",
            lineNumber: 15,
            columnNumber: 12
        }, this);
    } catch (error) {
        console.error('Error fetching posts:', error);
        // Return empty posts array if there's an error
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$university$2f$faculty$2d$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
            posts: [],
            session: session
        }, void 0, false, {
            fileName: "[project]/src/app/university/page.tsx",
            lineNumber: 19,
            columnNumber: 12
        }, this);
    }
}
}}),
"[project]/src/app/university/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/university/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__a518134f._.js.map