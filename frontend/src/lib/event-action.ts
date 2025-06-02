'use server';

import { getSession } from './session';
import { BACKEND_URL } from './constants';

/**
 * Add an event post to the user's planner
 * @param post - The post object (type: EVENT)
 */
export async function addPostEventToPlanner(postId: number) {
  const session = await getSession();
  if (!session?.accessToken) throw new Error('Not authenticated');

  const res = await fetch(`${BACKEND_URL}/events/add-to-planner/${postId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) throw new Error('Failed to add event to planner');
  return await res.json();
}

