'use client';

import { createComment } from '@/lib/comment-action';
import { deletePost } from '@/lib/post-action';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { Session } from '@/lib/session';

interface Comment {
  id: number;
  content: string;
  author: {
    firstName: string;
    lastName: string;
  };
}

interface Post {
  id: number;
  title: string;
  content: string;
  mediaUrl: string;
  createdAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  comments: Comment[];
}

interface FacultyFeedPageProps {
  posts: Post[];
  session: Session;
}

export default function FacultyFeedPage({ posts, session }: FacultyFeedPageProps) {
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [isPending, startTransition] = useTransition();

  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handlePostComment = async (postId: number) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    await createComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleDeletePost = (postId: number) => {
    startTransition(() => {
      deletePost(postId);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 bg-clip-text bg-gradient-to-r from-customBlue to-blue-600 text-transparent">
            Faculty Feed
          </h1>
          <p className="mt-2 text-lg text-gray-600">Connect and collaborate with your peers</p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No posts yet</h3>
            <p className="mt-1 text-gray-500">Be the first to share something with the faculty!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-customBlue/10 flex items-center justify-center">
                    <span className="text-customBlue font-medium">
                      {post.author.firstName.charAt(0)}{post.author.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {post.author.firstName} {post.author.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
                  <p className="text-gray-700">{post.content}</p>
                </div>

                {post.mediaUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    {post.mediaUrl.endsWith('.mp4') ? (
                      <video 
                        controls 
                        className="w-full rounded-lg border border-gray-200"
                      >
                        <source 
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}${post.mediaUrl}`} 
                        />
                      </video>
                    ) : (
                      <div className="relative aspect-video rounded-lg border border-gray-200 overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}${post.mediaUrl}`}
                          alt="Post media"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <div className="relative">
                    <textarea
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={e => handleCommentChange(post.id, e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-customBlue focus:border-customBlue"
                      rows={2}
                    />
                    <div className="absolute bottom-2 right-2">
                      <button
                        onClick={() => handlePostComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                          commentInputs[post.id]?.trim()
                            ? 'bg-gradient-to-r from-customBlue to-blue-600 text-white shadow-md hover:shadow-lg'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        } transition-all`}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>

                {post.comments?.length > 0 && (
                  <div className="space-y-3 pt-3">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                          <span className="text-xs text-customBlue font-medium">
                            {comment.author.firstName.charAt(0)}{comment.author.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {comment.author.firstName} {comment.author.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(session?.user.role === 'ADMIN' || session?.user.id === post.author.id) && (
                  <div className="pt-2 border-t border-gray-100 text-right">
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      disabled={isPending}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : 'Delete Post'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}