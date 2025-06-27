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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0">
          <div
            className={`bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 ${
              isModalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedPost.title}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <UserCircle2 className="h-4 w-4 mr-1.5 text-blue-500" />
                    <span className="font-medium">
                      {selectedPost.author.firstName} {selectedPost.author.lastName}
                    </span>
                    <span className="mx-1.5">·</span>
                    <span className="text-gray-500">{selectedPost.author.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDays className="h-4 w-4 mr-1.5 text-blue-500" />
                    {new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
              {/* Post Content */}
              <div className="prose prose-lg max-w-none mb-8 text-gray-700 whitespace-pre-wrap ">
                {selectedPost.content}
              </div>

              {/* Media */}
              {selectedPost.mediaUrl && (
          <div className="mb-8 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center gap-2">
              {selectedPost.mediaUrl.endsWith('.mp4') ? (
                <>
                  <Video className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">Video Attachment</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">Image Attachment</span>
                </>
              )}
            </div>
            <div className="p-4 max-h-[50vh] overflow-auto">
              <div className="min-w-full min-h-full flex items-center justify-center">
                {selectedPost.mediaUrl.endsWith('.mp4') ? (
                  <video 
                    controls 
                    className="max-w-full max-h-[45vh] rounded-lg"
                  >
                    <source
                      src={`${selectedPost.mediaUrl.startsWith('http') ? '' : 'http://localhost:4000'}${selectedPost.mediaUrl}`}
                    />
                  </video>
                ) : (
                  <Image
                    src={`${selectedPost.mediaUrl.startsWith('http') ? '' : 'http://localhost:4000'}${selectedPost.mediaUrl}`}
                    alt="Post Media"
                    width={1200}
                    height={800}
                    className="max-w-full max-h-[45vh] object-contain rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        )}

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</h4>
                  <div className="flex items-center">
                    {selectedPost.status === 'PENDING' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Pending Review
                      </span>
                    ) : selectedPost.status === 'APPROVED' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Approved
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Visibility</h4>
                  <div className="flex items-center">
                    {selectedPost.visibility === 'PUBLIC' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Public
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Private
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={closeModal}
                className="border-gray-300 hover:bg-gray-100 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(selectedPost.id, true)}
                disabled={isPending}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject Post
              </Button>
              <Button
                onClick={() => handleApprove(selectedPost.id, true)}
                disabled={isPending}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}