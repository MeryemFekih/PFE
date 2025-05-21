'use server';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { BACKEND_URL } from './constants';


export async function getPendingUsers() {
    const session = await getSession();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      redirect('/auth/signIn');
    }
  
    try {
      const response = await fetch(
        `${BACKEND_URL}/admin/pending-users`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`
          },
          next: { tags: ['pending-users'] } // Optional: for revalidation
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch pending users:', error);
      throw error; // This will be caught by Next.js error boundary
    }
  }
export async function approveUser(userId: number) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signIn');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/admin/approve/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({}) // Empty body since role is determined server-side
    });

    if (!response.ok) {
      throw new Error('Failed to approve user');
    }

    revalidatePath('/admin/dashboard');
    return await response.json();
  } catch (error) {
    console.error('Error approving user:', error);
    throw error;
  }
}

  export async function rejectUser(userId: number, reason: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
      redirect('/auth/signIn');
    }

    try {
      const response = await fetch(`${BACKEND_URL}/admin/reject/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        throw new Error('Failed to reject user');
      }

      revalidatePath('/admin/dashboard');
      return await response.json();
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw error;
    }
  }

export async function getAdminStats() {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signIn');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch admin stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      totalPending: 0,
      PendingUsers: 0,
      PendingPosts: 0
    };
  }
  
}
export async function getPendingPosts() {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  try {
    const response = await fetch(`${BACKEND_URL}/post/pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      next: { tags: ['pending-posts'] }
    });

    if (!response.ok) throw new Error('Failed to fetch pending posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching pending posts:', error);
    return [];
  }
}

export async function approvePost(postId: number) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signIn');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/post/approve/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({})
    });

    if (!response.ok) throw new Error('Failed to approve post');
    revalidatePath('/admin/dashboard');
    return await response.json();
  } catch (error) {
    console.error('Error approving post:', error);
    throw error;
  }
}

export async function rejectPost(postId: number) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signIn');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/post/reject/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({})
    });

    if (!response.ok) throw new Error('Failed to reject post');
    revalidatePath('/admin/dashboard');
    return await response.json();
  } catch (error) {
    console.error('Error rejecting post:', error);
    throw error;
  }
}
