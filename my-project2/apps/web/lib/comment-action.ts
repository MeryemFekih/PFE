'use server';

import { getSession } from './session';
import { redirect } from 'next/navigation';
import { BACKEND_URL } from './constants';
import { revalidatePath } from 'next/cache';

export async function getComments(postId: number) {
  try {
    const res = await fetch(`${BACKEND_URL}/comment/post/${postId}`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return await res.json();
  } catch (err) {
    console.error('Error loading comments:', err);
    return [];
  }
}

export async function createComment(postId: number, text: string) {
  const session = await getSession();
  if (!session) redirect('/auth/signIn');

  try {
    const res = await fetch(`${BACKEND_URL}/comment/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error('Failed to create comment');
    revalidatePath(`/faculty`);
    return await res.json();
  } catch (err) {
    console.error('Error creating comment:', err);
    return null;
  }
}
