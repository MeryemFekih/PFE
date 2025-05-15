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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Feed</h1>
          <p className="text-gray-600">Connect and collaborate with your peers</p>
        </div>

        {/* Create Post (if you add this feature) */}
        {/* <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {session.user.firstName.charAt(0)}{session.user.lastName.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Share something with the faculty..."
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No posts yet</h3>
            <p className="text-gray-500">Be the first to share something with the faculty!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
              {/* Post Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {post.author.firstName.charAt(0)}{post.author.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {post.author.firstName} {post.author.lastName}
                      </p>
                      {(session?.user.role === 'ADMIN' || session?.user.id === post.author.id) && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          disabled={isPending}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete post"
                        >
                          {isPending ? (
                            <svg className="animate-spin h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4 space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
                <p className="text-gray-700 whitespace-pre-line">{post.content}</p>

                {post.mediaUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                    {post.mediaUrl.endsWith('.mp4') ? (
                      <video 
                        controls 
                        className="w-full"
                      >
                        <source 
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}${post.mediaUrl}`} 
                        />
                      </video>
                    ) : (
                      <div className="relative aspect-video">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}${post.mediaUrl}`}
                          alt="Post media"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="border-t border-gray-100 p-4 space-y-4">
                {post.comments?.length > 0 && (
                  <div className="space-y-3">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                          <span className="text-xs text-blue-600 font-medium">
                            {comment.author.firstName.charAt(0)}{comment.author.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {comment.author.firstName} {comment.author.lastName}
                            </p>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="text-xs text-blue-600 font-medium">
                      {session?.user.firstName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={e => handleCommentChange(post.id, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handlePostComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                          commentInputs[post.id]?.trim()
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        } transition-colors`}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}