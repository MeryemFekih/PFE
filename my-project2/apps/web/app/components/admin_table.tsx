// app/components/admin_table.tsx
'use client';

import { useState, useTransition } from 'react';
import { approveUser, rejectUser } from '@/lib/admin-actions';
import { Button } from './ui/button';
import { User, Mail, Calendar, CheckCircle2, XCircle, UserPlus, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { user } from '../../../api/node_modules/.prisma/client';

export default function AdminTable({ users: initialUsers }: { users: user[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [users, setUsers] = useState(initialUsers);
  const [isPending, startTransition] = useTransition();

  const handleApprove = (userId: number) => {
    startTransition(async () => {
      try {
        await approveUser(userId);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        setSelected(prev => prev.filter(id => id !== userId));
        toast.success('User approved successfully!');
      } catch (error) {
        toast.error('Failed to approve user.');
        console.error('Approval error:', error);
      }
    });
  };

  const handleReject = (userId: number) => {
    startTransition(async () => {
      try {
        await rejectUser(userId, 'Rejected by Admin');
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        setSelected(prev => prev.filter(id => id !== userId));
        toast.info('User rejected.');
      } catch (error) {
        toast.error('Failed to reject user.');
        console.error('Rejection error:', error);
      }
    });
  };

  const handleBulkApprove = () => {
    startTransition(async () => {
      try {
        await Promise.all(selected.map(id => approveUser(id)));
        setUsers(prevUsers => prevUsers.filter(user => !selected.includes(user.id)));
        setSelected([]);
        toast.success(`${selected.length} users approved!`);
      } catch (error) {
        toast.error('Failed to approve selected users.');
        console.error('Bulk approval error:', error);
      }
    });
  };

  const handleBulkReject = () => {
    startTransition(async () => {
      try {
        await Promise.all(selected.map(id => rejectUser(id, 'Bulk Rejected by Admin')));
        setUsers(prevUsers => prevUsers.filter(user => !selected.includes(user.id)));
        setSelected([]);
        toast.info(`${selected.length} users rejected.`);
      } catch (error) {
        toast.error('Failed to reject selected users.');
        console.error('Bulk rejection error:', error);
      }
    });
  };

  if (users.length === 0) {
    return (
      <div className="bg-white shadow-md p-8 rounded-xl text-center text-gray-600 border border-dashed flex flex-col items-center justify-center py-16 animate-in fade-in-0 duration-500">
        <UserPlus className="h-20 w-20 text-gray-300 mb-6" />
        <p className="text-2xl font-semibold text-gray-800">No pending user approvals.</p>
        <p className="text-gray-500 mt-3 max-w-md">All clear! Check back later for new admission requests.</p>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-top-4 duration-500">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Pending User Approvals</h2>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleBulkApprove}
              disabled={selected.length === 0 || isPending}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve Selected
            </Button>
            <Button
              onClick={handleBulkReject}
              disabled={selected.length === 0 || isPending}
              variant="destructive"
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Reject Selected
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Requested
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-blue-50 transition-colors duration-150">
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
                        className="h-4 w-4 text-blue-600 rounded mr-3 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {user.identification}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-600">{user.userType}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(user.id)}
                      disabled={isPending}
                      className="gap-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(user.id)}
                      disabled={isPending}
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
