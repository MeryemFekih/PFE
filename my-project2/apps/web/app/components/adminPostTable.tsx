'use client';

import { approvePost, rejectPost } from '@/lib/admin-actions';
import { useState, useTransition } from 'react';
import Image from 'next/image';

interface Post {
  id: number;
  title: string;
  content: string;
  mediaUrl: string | null;
  visibility: 'PUBLIC' | 'PRIVATE';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  author: {
    id: number;
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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleApprove = (postId: number) => {
    startTransition(() => approvePost(postId));
  };

  const handleReject = (postId: number) => {
    startTransition(() => rejectPost(postId));
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white shadow p-4 rounded-lg text-center text-gray-600">
        No pending posts
      </div>
    );
  }

  return (
    <>
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
                  {new Date(post.createdAt).toISOString().split('T')[0]}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    onClick={() => setSelectedPost(post)}
                  >
                    Preview
                  </button>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    onClick={() => handleApprove(post.id)}
                    disabled={isPending}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
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

      {/* Modal Preview */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-3xl w-full shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedPost(null)}
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">{selectedPost.title}</h3>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{selectedPost.content}</p>
            <p className="text-sm text-gray-600 mb-2">
              Visibility: <strong>{selectedPost.visibility}</strong>
            </p>
            {selectedPost.mediaUrl && (
              <div className="mt-4">
                {selectedPost.mediaUrl.endsWith('.mp4') ? (
                  <video controls className="rounded w-full max-h-[500px]">
                    <source
                      src={`${'http://localhost:4000'}${selectedPost.mediaUrl}`}
                    />
                  </video>
                ) : (
                  <Image
                    src={`${   'http://localhost:4000'}${selectedPost.mediaUrl}`}
                    alt="Media"
                    width={800}
                    height={600}
                    className="rounded border"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
