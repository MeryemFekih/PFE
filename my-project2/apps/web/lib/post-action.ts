  'use server';

  import { getSession} from './session';
  import { redirect } from 'next/navigation';
  import { BACKEND_URL } from './constants';
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
        return await res.json();
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

      if (!res.ok) throw new Error('Post creation failed');
      revalidatePath('/university');
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
  

