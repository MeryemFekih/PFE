// app/components/admin_table.tsx
'use client';
import { useState } from 'react';
import { approveUser, rejectUser } from '@/lib/admin-actions';
import { Button } from './ui/button'; // Assuming Shadcn Button
import { User, Mail, Calendar, CheckCircle2, XCircle, UserPlus, Trash2 } from 'lucide-react'; // More descriptive icons
import { Badge } from './ui/badge'; // Assuming Shadcn Badge
import { toast } from 'sonner'; // Recommend installing sonner for toasts
import {user} from '../../../backend/node_modules/.prisma/client';
// You'll need to install sonner: npm install sonner
// And add <Toaster /> to your root layout or a high-level component

export default function AdminTable({ users: initialUsers }: { users: user[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [users, setUsers] = useState(initialUsers); // Manage users state locally for immediate UI updates

  const handleApprove = async (userId: number) => {
    try {
      await approveUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId)); // Remove user from list
      setSelected(prevSelected => prevSelected.filter(id => id !== userId)); // Unselect if approved
      toast.success('User approved successfully!');
    } catch (error) {
      toast.error('Failed to approve user.');
      console.error('Approval error:', error);
    }
  };

  const handleReject = async (userId: number) => {
    try {
      await rejectUser(userId, "Rejected by Admin"); // You might want a modal to get the reason
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId)); // Remove user from list
      setSelected(prevSelected => prevSelected.filter(id => id !== userId)); // Unselect if rejected
      toast.info('User rejected.');
    } catch (error) {
      toast.error('Failed to reject user.');
      console.error('Rejection error:', error);
    }
  };

  const handleBulkApprove = async () => {
    try {
      await Promise.all(selected.map(id => approveUser(id)));
      setUsers(prevUsers => prevUsers.filter(user => !selected.includes(user.id)));
      setSelected([]);
      toast.success(`${selected.length} users approved!`);
    } catch (error) {
      toast.error('Failed to approve selected users.');
      console.error('Bulk approval error:', error);
    }
  };

  // Optional: Handle bulk reject if needed.
  // const handleBulkReject = async () => {
  //   try {
  //     await Promise.all(selected.map(id => rejectUser(id, "Bulk Rejected by Admin")));
  //     setUsers(prevUsers => prevUsers.filter(user => !selected.includes(user.id)));
  //     setSelected([]);
  //     toast.info(`${selected.length} users rejected.`);
  //   } catch (error) {
  //     toast.error('Failed to reject selected users.');
  //     console.error('Bulk rejection error:', error);
  //   }
  // };

  if (users.length === 0) {
    return (
      <div className="bg-white shadow-sm p-6 rounded-lg text-center text-gray-600 border border-dashed flex flex-col items-center justify-center py-12">
        <UserPlus className="h-16 w-16 text-gray-300 mb-4" />
        <p className="text-xl font-semibold">No pending user admission requests at the moment.</p>
        <p className="text-gray-500 mt-2">Check back later!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Pending User Approvals</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {selected.length} selected
            </span>
            <Button
              variant="default" // Using default variant for primary action
              onClick={handleBulkApprove}
              disabled={selected.length === 0}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve Selected
            </Button>
            {/* Optional: Bulk reject button */}
            {/* <Button
              variant="destructive"
              onClick={handleBulkReject}
              disabled={selected.length === 0}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Reject Selected
            </Button> */}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
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
                  SID
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
            <tbody className="bg-white divide-y divide-gray-100"> {/* Softer divider */}
              {users.map(user => (
                <tr key={user.id} className="hover:bg-blue-50/50 transition-colors"> {/* Lighter hover effect */}
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
                        className="h-4 w-4 text-blue-600 rounded mr-3 border-gray-300 focus:ring-blue-500" // Styled checkbox
                      />
                      <span className="font-semibold text-gray-900"> {/* Bolder name */}
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600"> {/* Darker text */}
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200"> {/* Styled badge */}
                      {user.identification}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 capitalize">
                    {user.userType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
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
                      className="gap-1 bg-green-500 hover:bg-green-600 text-white" // Green for approve
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive" // Red for reject
                      onClick={() => handleReject(user.id)}
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