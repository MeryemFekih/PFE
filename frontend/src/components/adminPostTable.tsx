'use client';

import { approvePost, rejectPost } from '@/lib/admin-actions';
import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { toast } from 'sonner';
import {
  FileWarning,
  PlusSquare,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  XCircle,
  UserCircle2,
  CalendarDays,
} from 'lucide-react';

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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (post: Post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedPost(null), 300);
  };

  const handleApprove = (postId: number, fromModal = false) => {
    startTransition(async () => {
      try {
        await approvePost(postId);
        toast.success('Post approved successfully!');
        if (fromModal) closeModal();
      } catch (error) {
        toast.error('Failed to approve post.');
        console.error(error);
      }
    });
  };

  const handleReject = (postId: number, fromModal = false) => {
    startTransition(async () => {
      try {
        await rejectPost(postId);
        toast.info('Post rejected.');
        if (fromModal) closeModal();
      } catch (error) {
        toast.error('Failed to reject post.');
        console.error(error);
      }
    });
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white shadow-md p-8 rounded-lg text-center text-gray-600 border border-dashed flex flex-col items-center justify-center py-16 animate-in fade-in-0 duration-500">
        <FileWarning className="h-20 w-20 text-gray-300 mb-6" />
        <p className="text-2xl font-semibold text-gray-800">No pending posts to review at the moment.</p>
        <p className="text-gray-500 mt-3 max-w-md">All caught up! Check back later for new content.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 animate-in slide-in-from-top-4 duration-500">
        <h2 className="text-2xl font-bold px-6 py-5 border-b border-gray-100 text-gray-800 flex items-center gap-3 bg-gray-50">
          <FileWarning className="h-6 w-6 text-yellow-500" />
          Pending Posts for Review
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4 text-gray-500" /> Author
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" /> Created
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-xs line-clamp-1">{post.title}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <span className="font-medium">
                      {post.author.firstName} {post.author.lastName}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">{post.author.email}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => showModal(post)}
                      className="gap-1 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                    >
                      <PlusSquare className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(post.id)}
                      disabled={isPending}
                      className="gap-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(post.id)}
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

      {/* Modal Preview */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            className={`bg-white p-8 rounded-xl max-w-4xl w-full shadow-2xl relative transition-all duration-300 ${
              isModalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100"
              onClick={closeModal}
            >
              ✕
            </Button>
            <h3 className="text-3xl font-bold mb-4 text-gray-900">{selectedPost.title}</h3>
            <div className="text-gray-700 mb-6 whitespace-pre-wrap leading-relaxed text-lg max-h-[30vh] overflow-y-auto custom-scrollbar">
              {selectedPost.content}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Visibility:</span>{' '}
              <span className="capitalize text-blue-700 font-medium">{selectedPost.visibility}</span>
            </p>
            {selectedPost.mediaUrl && (
              <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center min-h-[300px]">
                {selectedPost.mediaUrl.endsWith('.mp4') ? (
                  <video controls className="w-full max-h-[600px] object-contain">
                    <source
                      src={`${selectedPost.mediaUrl.startsWith('http') ? '' : 'http://localhost:4000'}${selectedPost.mediaUrl}`}
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={`${selectedPost.mediaUrl.startsWith('http') ? '' : 'http://localhost:4000'}${selectedPost.mediaUrl}`}
                    alt="Post Media"
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain max-h-[600px]"
                  />
                )}
              </div>
            )}
            <div className="mt-8 flex justify-end gap-3">
              <Button
                variant="destructive"
                onClick={() => handleReject(selectedPost.id, true)}
                disabled={isPending}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                onClick={() => handleApprove(selectedPost.id, true)}
                disabled={isPending}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}