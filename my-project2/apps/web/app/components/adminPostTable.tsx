'use client';

import { approvePost, rejectPost } from '@/lib/admin-actions';
import { useTransition } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface AdminPostTableProps {
  posts: Post[];
}

export default function AdminPostTable({ posts }: AdminPostTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (postId: number) => {
    startTransition(() => {
      approvePost(postId);
    });
  };

  const handleReject = (postId: number) => {
    startTransition(() => {
      rejectPost(postId);
    });
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white shadow p-4 rounded-lg text-center text-gray-600">
        No pending posts
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <h2 className="text-xl font-semibold px-6 py-4 border-b">Pending Posts</h2>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Title</th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Author</th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Created</th>
            <th className="px-6 py-3 text-right font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {posts.map(post => (
            <tr key={post.id}>
              <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
              <td className="px-6 py-4 text-gray-700">
                {post.author.firstName} {post.author.lastName}
                <br />
                <span className="text-xs text-gray-500">{post.author.email}</span>
              </td>
              <td className="px-6 py-4 text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm"
                  onClick={() => handleApprove(post.id)}
                  disabled={isPending}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                  onClick={() => handleReject(post.id)}
                  disabled={isPending}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
