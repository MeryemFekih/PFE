import ClientPostForm from '@/components/clientPostForm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function CreatePage() {
  const session = await getSession();
  if (!session?.user) redirect('/auth/signIn');

  return <ClientPostForm user={{
    profilePicture: undefined
  }} />;
}
