import { getSession, Session } from '@/lib/session';
import FacultyFeedPage from './faculty-page';
import { getApprovedPosts } from '@/lib/post-action';
import { redirect } from 'next/navigation';

export default async function UniversityPage() {
  const session = (await getSession()) as Session;

  if (!session || !session.user) {
    return redirect('/auth/signIn');
  }

  try {
    const posts = await getApprovedPosts() || [];
    return <FacultyFeedPage posts={posts} session={session} />;
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return empty posts array if there's an error
    return <FacultyFeedPage posts={[]} session={session} />;
  }
}
