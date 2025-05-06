import { getSession } from '@/lib/session';
import { Role } from '@/lib/type';
import { redirect } from 'next/navigation';

const Dashboard = async () => {
  const session = await getSession();
  
  if (!session || !session.user) return  ;
  
  if (![
    Role.ALUMNI,
    Role.ADMIN,
    Role.PROFESSOR,
    Role.STUDENT
  ].includes(session.user.role)) {
    redirect("/auth/signIn");
  }
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard