import { redirect } from 'next/navigation';
import AdminTable from '@/app/components/admin_table';
import StatsCards from '@/app/components/stats_card';
import { getSession } from '@/lib/session';
import { getPendingUsers } from '@/lib/admin-actions';

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (session?.user.role !== 'ADMIN') {
    redirect('/auth/signIn');
  }

  const pendingUsers = await getPendingUsers();
  const stats = {
    totalPending: pendingUsers.length,
    approvedThisWeek: 24, 
    rejectedThisWeek: 5
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage user admission requests and system statistics
            </p>
          </div>
        </div>

        <StatsCards stats={stats} />
        
        <AdminTable users={pendingUsers} />
      </div>
    </div>
  );
}