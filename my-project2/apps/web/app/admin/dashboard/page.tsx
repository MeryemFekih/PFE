// app/admin/page.tsx
import { redirect } from 'next/navigation';
import AdminTable from '@/app/components/admin_table';
import StatsCards from '@/app/components/stats_card';
import { getSession } from '@/lib/session';
import { getPendingUsers, getPendingPosts } from '@/lib/admin-actions';
import AdminPostTable from '@/app/components/adminPostTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { LayoutDashboard, Users, FileText } from 'lucide-react'; // More thematic icons

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
    <div className="flex-1 transition-all duration-300 md:ml-64 p-8 relative bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10"> {/* Adjusted spacing */}
        <div className="flex items-center justify-between border-b pb-4 mb-6"> {/* Added bottom border and padding */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
              <LayoutDashboard className="h-9 w-9 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Efficiently manage user admission requests and system content.
            </p>
          </div>
        </div>

        <StatsCards stats={stats} />

        <div className="bg-white rounded-lg shadow-lg p-6"> {/* Card-like container for tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto mb-6 bg-gray-100 rounded-lg p-1"> {/* Centered and styled tab list */}
              <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-gray-700 py-2">
                <Users className="h-5 w-5 mr-2" /> Users
              </TabsTrigger>
              <TabsTrigger value="posts" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-gray-700 py-2">
                <FileText className="h-5 w-5 mr-2" /> Posts
              </TabsTrigger>
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
    </div>
  );
}