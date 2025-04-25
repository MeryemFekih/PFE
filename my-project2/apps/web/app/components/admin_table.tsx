'use client';
import { useState } from 'react';
import { approveUser, rejectUser } from '@/lib/admin-actions';
import { Button } from './ui/button';
import { user } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ClockIcon, CheckIcon, XIcon, User, Mail, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from './ui/badge';

export default function AdminTable({ users }: { users: user[] }) {
  const [selected, setSelected] = useState<number[]>([]);

  const handleApprove = async (userId: number) => {
    await approveUser(userId);
  };

  const handleBulkApprove = () => {
    selected.forEach(handleApprove);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">User Approvals</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {selected.length} selected
            </span>
            <Button 
              variant="outline"
              onClick={handleBulkApprove}
              disabled={selected.length === 0}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve Selected
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Requested
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selected.includes(user.id)}
                        onChange={() => 
                          setSelected(prev => 
                            prev.includes(user.id) 
                              ? prev.filter(id => id !== user.id) 
                              : [...prev, user.id]
                          )
                        }
                        className="h-4 w-4 text-blue-600 rounded mr-3"
                      />
                      <span className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={
                        user.role === 'STUDENT' ? 'default' :
                        user.role === 'PROFESSOR' ? 'secondary' :
                        user.role === 'ALUMNI' ? 'outline' :
                        'default'
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 capitalize">
                    {user.userType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(user.id)}
                      className="gap-1"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => rejectUser(user.id, "Not Valid")}
                      className="gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}