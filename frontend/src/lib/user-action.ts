'use server';

import { getSession } from './session';

/**
 * Normalize interests: convert to lowercase and trim whitespace
 */
function normalizeInterests(interests: any): string[] {
  if (Array.isArray(interests)) {
    return interests.map((i: string) => i.toLowerCase().trim());
  }

  if (typeof interests === 'string') {
    return interests
      .split(',')
      .map((i: string) => i.toLowerCase().trim());
  }

  return [];
}

/**
 * Get suggested users with shared interests
 */
export async function getSuggestedUsers() {
  const session = await getSession();
  if (!session?.user?.interests) return [];

  const sessionInterests = normalizeInterests(session.user.interests);

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/user/shared-interests`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch backend suggestions');

    const users = await res.json();

    const filtered = users
      .filter((u: any) => u.id !== session.user.id)
      .map((u: any) => {
        const userInterests = Array.isArray(u.interests) ? u.interests : [];

        // Match lowercase, return original-cased shared interests
        const sharedInterests = userInterests.filter((interest: string) =>
          sessionInterests.includes(interest.toLowerCase().trim())
        );

        return { ...u, sharedInterests };
      })
      .filter((u: any) => u.sharedInterests.length > 0); // Only return users with shared interests

    return filtered.length > 5
      ? filtered.sort(() => 0.5 - Math.random()).slice(0, 5)
      : filtered;
  } catch (err) {
    console.error('❌ Suggestion fetch error:', err);
    return [];
  }
}

/**
 * Fetch a user's profile with posts, filtered by viewer role
 */
export async function getUserProfileWithPosts(targetUserId: number) {
  const session = await getSession();
  const viewerId = session?.user?.id || 0;
  const viewerRole = session?.user?.role || 'PUBLIC';

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/user/${targetUserId}/posts`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch profile');

    const targetUser = await res.json();

    return {
      ...targetUser,
      canFollow: viewerRole !== 'PUBLIC' && viewerId !== targetUserId,
      canMessage: viewerId !== targetUserId,
      isOwnProfile: viewerId === targetUserId,
    };
  } catch (err) {
    console.error('❌ Profile fetch error:', err);
    return null;
  }
}

export async function checkIfFollowing(targetUserId: number): Promise<boolean> {
  const session = await getSession();
  if (!session?.accessToken) return false;

  const res = await fetch(`${process.env.BACKEND_URL}/user/${targetUserId}/is-following`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    console.error('Failed to check follow status');
    return false;
  }

  return await res.json(); // should return true or false
}
export async function toggleFollow(targetUserId: number, isCurrentlyFollowing: boolean): Promise<boolean> {
  const session = await getSession();
  if (!session?.accessToken) return false;

  const method = isCurrentlyFollowing ? 'DELETE' : 'POST';

  const res = await fetch(`${process.env.BACKEND_URL}/user/${targetUserId}/${isCurrentlyFollowing ? 'unfollow' : 'follow'}`, {
    method,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    console.error(`❌ Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'} user`);
    return isCurrentlyFollowing; // fallback to previous state
  }

  return !isCurrentlyFollowing;
}