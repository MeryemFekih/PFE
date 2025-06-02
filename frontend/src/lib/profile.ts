'use client';
import { getSession } from '@/lib/session'; // Assuming you have a session reader

export async function fetchUserProfile() {
  try {
    const session = await getSession(); // You stored accessToken in session

    const res = await fetch('http://localhost:4000/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session?.accessToken}`,
      },
    });

    if (!res.ok) {
      console.warn('⚠️ Not authenticated');
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('❌ Failed to fetch user profile:', err);
    return null;
  }
}
