import { getSession, Session } from '@/lib/session';
import FacultyFeedPage from './faculty-page';
import { Role } from '@/lib/type';
import { getApprovedPosts } from '@/lib/post-action';
import { redirect } from 'next/navigation';

export default async function UniversityPage() {
  const session= await getSession() as Session;
    
    if (!session || !session.user) return  ;
    
  const posts = await getApprovedPosts(); 
  return <FacultyFeedPage posts={posts} session={session} />;
}


