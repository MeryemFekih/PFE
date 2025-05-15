/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { BACKEND_URL } from './constants';
import { getSession } from './session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  role: 'STUDENT' | 'PROFESSOR' | 'ALUMNI' | 'PUBLIC';
  profilePicture?: string;
  university?: string;
  formation?: string;
  graduationYear?: string;
  degree?: string;
  interests?: string[];
  occupation?: string;
  subject?: string;
  rank?: string;
}

export async function getUserProfileAndPosts(): Promise<{
  profile: UserProfile | null;
  posts: any[];
}> {
  const session = await getSession();
  if (!session) redirect('/auth/signIn');

  const { accessToken, user } = session;

  try {
    const profileRes = await fetch(`${BACKEND_URL}/auth/protected`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const postsRes = await fetch(`${BACKEND_URL}/post/user/${user.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const profile = profileRes.ok ? await profileRes.json() : null;
    const posts = postsRes.ok ? await postsRes.json() : [];

    // Ensure profile picture URL is complete
    if (
      profile?.profilePicture &&
      !profile.profilePicture.startsWith('http') &&
      !profile.profilePicture.startsWith('/uploads')
    ) {
      profile.profilePicture = `${BACKEND_URL}${profile.profilePicture}`;
    }

    return { profile, posts };
  } catch (err) {
    console.error('Error fetching profile/posts:', err);
    return { profile: null, posts: [] };
  }
}

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${BACKEND_URL}/auth/update-profile`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedProfile = await response.json();
    
    if (
      updatedProfile.profilePicture &&
      !updatedProfile.profilePicture.startsWith('http') &&
      !updatedProfile.profilePicture.startsWith('/uploads')
    ) {
      updatedProfile.profilePicture = `${BACKEND_URL}${updatedProfile.profilePicture}`;
    }
    

    revalidatePath('/profile');
    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}