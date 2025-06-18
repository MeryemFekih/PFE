  'use server';

  import { getSession} from './session';
  import { redirect } from 'next/navigation';
  import { BACKEND_URL, PUBLIC_BACKEND_URL } from './constants';
  import { revalidatePath } from 'next/cache';

  
  export async function getApprovedPosts() {
  const session = await getSession();
  if (!session) redirect('/auth/signIn');

  try {
    const res = await fetch(`${BACKEND_URL}/post`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to load posts');
    const posts = await res.json();

    // ✅ Only show public posts to PUBLIC users
    if (session.user.role === 'PUBLIC') {
      return posts.filter((post: any) => post.visibility === 'PUBLIC');
    }

    return posts;
  } catch (err) {
    console.error('Error loading posts:', err);
    return [];
  }
}
  export async function getPostById(postId: number) {
    const session = await getSession();
    if (!session) redirect('/auth/signIn');

    try {
      const res = await fetch(`${BACKEND_URL}/post/${postId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch post');
      return await res.json();
    } catch (err) {
      console.error('Error fetching post:', err);
      return null;
    }
  }

 
export async function createPost(formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/auth/signIn');

  try {
    const res = await fetch(`${BACKEND_URL}/post`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: formData,
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

  export async function deletePost(postId: number) {
    const session = await getSession();
    if (!session) redirect('/auth/signIn');


    try { 
      const res = await fetch(`${BACKEND_URL}/post/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!res.ok) throw new Error('Delete failed');
      revalidatePath('/university');
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  }
export async function getPostsByUser() {
  const session = await getSession();
  if (!session) redirect('/auth/signIn');

  const userId = session.user.id;

  try {
    const res = await fetch(`${BACKEND_URL}/post/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch user posts');
    return await res.json();
  } catch (err) {
    console.error('Error fetching user posts:', err);
    return [];
  }
  
}
export async function savePost(postId: number) {
  const session = await getSession();
  if (!session) redirect('/auth/signIn');

  try {
    const res = await fetch(`${BACKEND_URL}/post/${postId}/save`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) throw new Error('Failed to save post');
    revalidatePath('/profile'); // Or wherever you want to update
  } catch (err) {
    console.error('Error saving post:', err);
  }
}

export async function unsavePost(postId: number) {
  const session = await getSession();
  if (!session) redirect('/auth/signIn');

  try {
    const res = await fetch(`${BACKEND_URL}/post/${postId}/unsave`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) throw new Error('Failed to unsave post');
    revalidatePath('/profile');
  } catch (err) {
    console.error('Error unsaving post:', err);
  }
}
export async function toggleSavePost(postId: number, isCurrentlySaved: boolean) {
  const session = await getSession();
  if (!session) redirect('/auth/signIn');

  try {
    const endpoint = `${BACKEND_URL}/post/${postId}/${isCurrentlySaved ? 'unsave' : 'save'}`;
    const method = isCurrentlySaved ? 'DELETE' : 'POST';

    console.log(`Attempting to ${isCurrentlySaved ? 'unsave' : 'save'} post ${postId}`);

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
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


export async function fetchSavedPostsMap(): Promise<Record<number, boolean>> {
  const session = await getSession();
  if (!session) return {};

  const res = await fetch(`${BACKEND_URL}/post/saved`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('❌ Failed to fetch saved posts');
    return {};
  }

  const data = await res.json();

  const map: Record<number, boolean> = {};
  data.forEach((post: any) => {
    map[post.id] = true;
  });

  return map;
}


function mapEventTypeToCategory(eventType?: string): string {
  switch (eventType) {
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

export async function addPostEventToPlanner(post: any) {
  const session = await getSession();
  if (!session?.user?.id || !session.accessToken) return;

  const response = await fetch(`${process.env.BACKEND_URL}/events/${session.user.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({
      title: post.title,
      description: post.content || '',
      startTime: post.startDate,
      endTime: post.endDate,
      category: mapEventTypeToCategory(post.eventType),
      reminderAt: null,
    }),
  });

  if (!response.ok) {
    console.error('❌ Failed to add event:', await response.text());
    throw new Error('Failed to add event');
  }

  return await response.json();
}




export async function getSuggestedEvents() {
  const session = await getSession();
  if (!session?.accessToken) {
    console.warn('⚠️ No session or access token');
    return [];
  }

  const url = `${BACKEND_URL}/post/events/suggested`;
  console.log('📡 Fetching suggested events from:', url);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: 'no-store',
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
export async function participateInPost(postId: number) {
  const session = await getSession();
  if (!session?.accessToken) throw new Error('Not authenticated');

  try {
    const res = await fetch(`${BACKEND_URL}/post/${postId}/participate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
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

export async function getPostParticipants(postId: number, token: string) {
  const res = await fetch(`${BACKEND_URL}/post/${postId}/participants`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch participants');
  return res.json();
}



export async function requestParticipantRemoval(participationId: number, reason: string) {
  const res = await fetch(`${BACKEND_URL}/post/${participationId}/request-removal`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error('Failed to request removal');
  return res.json();
}
