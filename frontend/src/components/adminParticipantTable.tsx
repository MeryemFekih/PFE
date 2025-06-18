'use client';

import { Button } from '@/components/ui/button';
import { approveRemoval } from '@/lib/admin-actions';

export default function AdminRemovalTable({ requests }: { requests: any[] }) {
  const handleApprove = async (id: number) => {
    try {
      await approveRemoval(id);
    } catch (err) {
      console.error('Failed to approve removal:', err);
    }
  };

  if (requests.length === 0) return <p className="text-gray-500">No removal requests.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3">User</th>
            <th className="p-3">Post</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-t">
              <td className="p-3">{req.user.firstName} {req.user.lastName}</td>
              <td className="p-3">{req.post.title}</td>
              <td className="p-3 text-gray-700">{req.removalReason}</td>
              <td className="p-3">
                <Button onClick={() => handleApprove(req.id)}>Approve</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
