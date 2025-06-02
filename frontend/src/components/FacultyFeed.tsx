'use client';

import { createComment } from '@/lib/comment-action';
import { toggleSavePost, getSuggestedEvents, deletePost } from '@/lib/post-action';
import Image from 'next/image';
import { useState, useTransition, useRef, useEffect } from 'react';
import { Session } from '@/lib/session';
import Sidebar from '@/components/sidebar';
import { FaUserCircle } from 'react-icons/fa';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import { getSuggestedUsers } from '@/lib/user-action';
import PostCard from '@/components/post-card';
import ClientPostForm from '@/components/clientPostForm';
import SidebarWrapper from '@/components/sidebar';
import SuggestedEventList from '@/components/SuggestedEventList';

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
  type?: string;
  eventType?: string;
  subject?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  speakerId?: number;
  author: {
    degree: any;
    formation: any;
    university: any;
    profilePicture: any;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  comments: Comment[];
}

interface SuggestedUser {
  sharedInterests: any;
  online: any;
  profilePicture: any;
  interests: any;
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  subject?: string;
  university?: string;
  formation?: string;
}
interface FacultyFeedClientProps {
  posts: Post[];
  session: Session;
  suggestedEvents?: Post[];
}

export default function FacultyFeedClient({ posts, session, suggestedEvents: suggestedEventsProp }: FacultyFeedClientProps) {
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [isPending, startTransition] = useTransition();
  const [showPicker, setShowPicker] = useState<number | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [savedMap, setSavedMap] = useState<Record<number, boolean>>({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isUniversityUser = ['STUDENT', 'ALUMNI', 'PROFESSOR', 'ADMIN'].includes(session?.user?.role || '');
  const isPublicUser = session?.user?.role === 'PUBLIC';
  const [suggestedPosts, setSuggestedPosts] = useState<{ events: Post[]; followedPosts: Post[] }>({
    events: [],
    followedPosts: [],
  });
  const [suggestedEvents, setSuggestedEvents] = useState<Post[]>(suggestedEventsProp ?? []);


  useEffect(() => {
    const loadSuggestions = async () => {
      if (!session?.user?.id) return;
      const data = await getSuggestedEvents();
      setSuggestedPosts(data);
    };
    loadSuggestions();
  }, [session?.user?.id]);

  useEffect(() => {
    const loadSuggestedUsers = async () => {
      try {
        const users = await getSuggestedUsers();
        const facultyUsers = users.filter((user: SuggestedUser) => ['STUDENT', 'ALUMNI', 'PROFESSOR'].includes(user.role));
        setSuggestedUsers(facultyUsers);
      } catch (err) {
        console.error('Error loading suggested users:', err);
      }
    };

    loadSuggestedUsers();
  }, []);

  

  const ALLOWED_ROLES = ['STUDENT', 'ALUMNI', 'PROFESSOR', 'ADMIN'];
  const canCreatePosts = session?.user?.role && ALLOWED_ROLES.includes(session.user.role);

  const addEmoji = (emoji: any, postId: number) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: (prev[postId] || '') + (emoji.native || '')
    }));
    setShowPicker(null);
  };

  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handlePostComment = async (postId: number) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    await createComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleToggleSave = async (postId: number) => {
    const isSaved = savedMap[postId];
    try {
      await toggleSavePost(postId, isSaved);
      setSavedMap((prev) => ({
        ...prev,
        [postId]: !isSaved,
      }));
    } catch (error) {
      console.error('Failed to toggle save:', error);
    }
  };

  const handleDeletePost = (postId: number) => {
    startTransition(() => {
      deletePost(postId);
    });
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Desktop Sidebar - Hidden on mobile */}
      <SidebarWrapper />

      {/* Main Content */}
      <div className="flex-1 w-full md:ml-56 md:mr-80 p-4 relative">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl text-center text-blue-900 font-bold">Faculty Feed</h1>
          <h2 className='text-center text-gray-500 mb-6'>Where you can find everything you need for your dream university</h2>

          {/* User Post Form */}
          {canCreatePosts ? (
            <ClientPostForm user={session.user} />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center">
              <h3 className="text-lg font-medium text-gray-900">Want to share something?</h3>
              <p className="text-gray-500 mt-2">
                {session?.user ? (
                  "Your account type doesn't have posting privileges."
                ) : (
                  <Link href="/auth/signIn" className="text-blue-600 hover:underline">
                    Sign in
                  </Link>
                )}
              </p>
              {!session?.user && (
                <p className="text-sm text-gray-500 mt-1">
                  Students, alumni, professors and admins can create posts
                </p>
              )}
            </div>
          )}

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h3 className="mt-2 text-lg font-medium text-gray-900">No posts yet</h3>
              <p className="mt-1 text-gray-500">
                {canCreatePosts ? "Be the first to share something with the faculty!" : "Check back later for updates"}
              </p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                session={session}
                isPending={isPending}
                saved={!!savedMap[post.id]}
                onToggleSave={handleToggleSave}
                onDelete={handleDeletePost}
              />
            ))
          )}

          {/* Mobile-only Suggestions Section */}
          <div className="md:hidden space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800">Suggested Connections</h2>
                <p className="text-sm text-gray-500">People you might want to connect with</p>
              </div>

              <div className="space-y-4">
                {suggestedUsers.slice(0, 5).map(user => (
                  <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={`${user.firstName}'s avatar`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <FaUserCircle size={20} />
                          </div>
                        )}
                      </div>
                      {user.online && (
                        <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {user.role === 'PROFESSOR' && `Professor at ${user.university}`}
                        {user.role === 'ALUMNI' && `Alumni of ${user.university}`}
                        {user.role === 'STUDENT' && `Student at ${user.university}`}
                      </p>
                    </div>
                    
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded-full">
                      check
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent actualities and events</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">AI Wave</p>
                    <p className="text-xs text-gray-500">Tech conference</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">DevFest</p>
                    <p className="text-xs text-gray-500">GDSC event</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Hackathon</p>
                    <p className="text-xs text-gray-500">TSYP competition</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Right Sidebar - Hidden on mobile */}
      <div className="hidden md:block w-90 h-full fixed right-0 top-0 bg-gray-100 p-5 z-20 overflow-y-auto">
        <div className='bg-white rounded-xl shadow-lg px-4 py-4'>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-800" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
              </svg>
              Suggested Connections
            </h2>
            <p className="text-sm text-gray-500 mt-1">People you might want to connect with</p>
          </div>

          <div className="space-y-4 mt-2">
            {suggestedUsers.map(user => (
              <Link href={`/user/${user.id}`} key={user.id}>
                <div className="flex flex-col px-4 py-2 mb-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 hover:border-indigo-100 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="flex justify-center items-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 transition-all duration-300 overflow-hidden ring-2 ring-white">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={`${user.firstName}'s avatar`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg viewBox="0 0 15 15" className="w-6 fill-indigo-500">
                            <path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-xs font-medium mt-1">
                          {user.role === 'PROFESSOR' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                              <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                              </svg>
                              Professor
                            </span>
                          )}
                          {user.role === 'ALUMNI' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                              <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                              </svg>
                              Alumni
                            </span>
                          )}
                          {user.role === 'STUDENT' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                              <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                              </svg>
                              Student
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                      Follow
                    </button>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">
                      {user.role === 'PROFESSOR' && `Teaches ${user.subject} in ${user.university}`}
                      {user.role === 'ALUMNI' && `Graduated from ${user.university}`}
                      {user.role === 'STUDENT' && `Studies ${user.formation} at ${user.university}`}
                    </p>
                    
                    {user.sharedInterests?.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1 items-center">
                        <span className='flex items-center'>
                          <svg className="mr-1 h-3 w-3 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          Both interested in :
                        </span>
                        <p className="font-medium text-indigo-600">
                          {user.sharedInterests.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Event Suggestions */}
          <div>
            <h2 className="text-lg font-bold text-blue-800">Events matching your interests</h2>
            {suggestedPosts.events.length === 0 ? (
              <p className="text-sm text-gray-500">No event suggestions found.</p>
            ) : (
              suggestedPosts.events.map((post) => (
                <div key={post.id} className="p-2 border-b">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-gray-500">{post.subject}</p>
                </div>
              ))
            )}
            <section className="p-6">
              <h1 className="text-xl font-bold mb-4">🎯 Suggested Events</h1>
              <SuggestedEventList session={session} />
            </section>
          </div>

          {/* Followed Users' Posts */}
          <div>
            <h2 className="text-lg font-bold text-indigo-800">Recent posts from people you follow</h2>
            {suggestedPosts.followedPosts.length === 0 ? (
              <p className="text-sm text-gray-500">No posts from followed users yet.</p>
            ) : (
              suggestedPosts.followedPosts.map((post) => (
                <div key={post.id} className="p-2 border-b">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-gray-500">
                    By {post.author.firstName} {post.author.lastName}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Advertising (optional)</p>
        </div>
      </div>
    </div>
  );
}