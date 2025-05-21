import { redirect } from 'next/navigation';
import AdminTable from '@/app/components/admin_table';
import StatsCards from '@/app/components/stats_card';
import { getSession } from '@/lib/session';
import { getPendingUsers, getPendingPosts } from '@/lib/admin-actions';
import AdminPostTable from '@/app/components/adminPostTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Pen } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (session?.user.role !== 'ADMIN') {
    redirect('/auth/signIn');
  }

  const [pendingUsers, pendingPosts] = await Promise.all([
    getPendingUsers(),
    getPendingPosts(),
  ]);
  
  const stats = {
    totalPending: pendingUsers.length + pendingPosts.length,
    PendingUsers: pendingUsers.length,
    PendingPosts: pendingPosts.length,
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
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <AdminTable users={pendingUsers} />
          </TabsContent>
          
          <TabsContent value="posts">
            <AdminPostTable posts={pendingPosts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}