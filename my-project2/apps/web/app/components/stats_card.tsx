// app/components/stats_card.tsx
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Hourglass, Users, FileText } from 'lucide-react'; // Updated icons

export default function StatsCards({ stats }: {
  stats: {
    totalPending: number;
    PendingUsers: number;
    PendingPosts: number;
  }
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-all duration-300 border border-blue-200"> {/* Stronger hover effect, subtle border */}
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Pending Requests
          </CardTitle>
          <Hourglass className="h-6 w-6 text-blue-600" /> {/* Larger, more prominent icon */}
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-gray-900">{stats.totalPending}</div> {/* Larger, bolder number */}
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 border border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Pending Users
          </CardTitle>
          <Users className="h-6 w-6 text-green-600" /> {/* Consistent icon size and color */}
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-gray-900">{stats.PendingUsers}</div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 border border-orange-200"> {/* Changed to orange for posts */}
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Pending Posts
          </CardTitle>
          <FileText className="h-6 w-6 text-orange-600" /> {/* Consistent icon size and color */}
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-gray-900">{stats.PendingPosts}</div>
        </CardContent>
      </Card>
    </div>
  );
}