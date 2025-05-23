import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ClockIcon, CheckIcon, XIcon, ArrowUp, ArrowDown } from 'lucide-react';

export default function StatsCards({ stats }: {
  stats: {
    totalPending: number;
    approvedThisWeek: number;
    rejectedThisWeek: number;
  }
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Pending Requests
          </CardTitle>
          <ClockIcon className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPending}</div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Approved (Week)
          </CardTitle>
          <div className="flex items-center">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <CheckIcon className="h-5 w-5 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.approvedThisWeek}</div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Rejected (Week)
          </CardTitle>
          <div className="flex items-center">
            <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            <XIcon className="h-5 w-5 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.rejectedThisWeek}</div>
        </CardContent>
      </Card>
    </div>
  );
}