// app/profile/page.tsx
import ProfilePage from './ProfilePage/page';
import { getSession } from '@/lib/session';

export default async function Page() {
  const session = await getSession();

  if (!session) {
    
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg">
        Redirecting to sign in...
      </div>
    );
  }

  return <ProfilePage session={session} />;
}
