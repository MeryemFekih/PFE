/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createComment } from '@/lib/comment-action';
import Image from 'next/image';
import { useState } from 'react';

interface Comment {
  id: number;
  text: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  mediaUrl:string;
  createdAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  comments :Comment[]
}

interface FacultyFeedPageProps {
  posts: Post[];
}

export default function FacultyFeedPage({ posts }: FacultyFeedPageProps) {
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handlePostComment = async (postId: number) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    await createComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">🎓 Faculty Feed</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No approved posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="text-gray-700 font-semibold">
              {post.author.firstName} {post.author.lastName}
            </div>
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p>{post.content}</p>

            {post.mediaUrl && (
              <div className="mt-2">
                {post.mediaUrl.endsWith('.mp4') ? (
                  <video controls className="rounded-md max-h-60">
                    <source src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}${post.mediaUrl}`} />
                  </video>
                ) : (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}${post.mediaUrl}`}
                    alt="Post media"
                    width={600}
                    height={400}
                    className="rounded-md max-h-96 object-contain"
                  />
                )}
              </div>
            )}

            <div>
              <textarea
                placeholder="Write a comment..."
                value={commentInputs[post.id] || ''}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
              <div className="flex justify-end mt-1">
                <button
                  onClick={() => handlePostComment(post.id)}
                  className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                >
                  Comment
                </button>
              </div>
            </div>

            {post.comments?.length > 0 && (
              <div className="pt-2 border-t text-sm space-y-1">
                {post.comments.map((comment: any) => (
                  <div key={comment.id} className="text-gray-600">
                    <span className="font-semibold">
                      {comment.author.firstName} {comment.author.lastName}:
                    </span>{' '}
                    {comment.content}

                  </div>
                ))}
              
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
