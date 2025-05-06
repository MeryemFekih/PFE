import FacultyFeedPage from './faculty-page';
import { getApprovedPosts } from '@/lib/post-action';

export default async function UniversityPage() {
  const posts = await getApprovedPosts(); // now runs on the server
  return <FacultyFeedPage posts={posts} />;
}
