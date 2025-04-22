import { getSession } from '@/lib/session'
import { Role } from '@/lib/type';
import { redirect } from 'next/navigation';

import React from 'react'

const Dashboard = async () => {
  const session = await getSession  ();
  if (!session || !session.user) redirect("/auth/signIn"); 
  if (session.user.role != Role.ALUMNI) redirect("/auth/signIn");
  console.log({session});
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard