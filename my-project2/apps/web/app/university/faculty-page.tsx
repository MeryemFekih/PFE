
'use client';

import { deletePost } from '@/lib/post-action';
import { useTransition } from 'react';
import { Session } from '@/lib/session';
import PostCard from '../components/post-card';
import type { Post } from '@/lib/type';



interface FacultyFeedPageProps {
  posts: Post[];
  session: Session;
}

export default function FacultyFeedPage({ posts, session }: FacultyFeedPageProps) {
  const [isPending, startTransition] = useTransition();

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
            <PostCard
              key={post.id}
              post={post}
              currentUserId={session.user.id}
              onDelete={handleDeletePost}
              session= {session}
            >
              
            </PostCard>
          ))
          
        )}
      </div>
    </div>
  );
}