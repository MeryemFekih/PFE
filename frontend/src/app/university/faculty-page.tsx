'use client';

import { createComment } from '@/lib/comment-action';
import { toggleSavePost, getSuggestedEvents, deletePost } from '@/lib/post-action';
import { getSuggestedUsers, searchUsers } from '@/lib/user-action';
import SpinnerOverlay from '@/components/spinneroverlay';
import ClientPostForm from '@/components/clientPostForm';
import PostCard from '@/components/post-card';
import SuggestedEventList from '@/components/SuggestedEventList';
import { FaUserCircle,  FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useRef, useState, useTransition } from 'react';
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

interface FacultyFeedPageProps {
  posts: Post[];
  session: Session;
}

export default function FacultyFeedPage({ posts, session }: FacultyFeedPageProps) {
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [suggestedPosts, setSuggestedPosts] = useState<{ events: Post[]; followedPosts: Post[] }>({
    events: [],
    followedPosts: [],
  });
  const [savedMap, setSavedMap] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SuggestedUser[]>([]);

  const canCreatePosts = ['STUDENT', 'ALUMNI', 'PROFESSOR', 'ADMIN'].includes(session?.user?.role || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [events, users] = await Promise.all([
          getSuggestedEvents(),
          getSuggestedUsers(),
        ]);

        setSuggestedPosts({
          events: Array.isArray(events?.events) ? events.events : [],
          followedPosts: Array.isArray(events?.followedPosts) ? events.followedPosts : [],
        });

        const facultyUsers = users.filter((user: SuggestedUser) =>
          ['STUDENT', 'ALUMNI', 'PROFESSOR'].includes(user.role)
        );
        setSuggestedUsers(facultyUsers);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  useEffect(() => {
  const delayDebounce = setTimeout(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const users = await searchUsers(searchQuery);
      setSearchResults(users);
    } catch (err) {
      console.error('Search error:', err);
    }
  }, 300); // debounce

  return () => clearTimeout(delayDebounce);
}, [searchQuery]);

  
  if (isLoading || isPending) {
    return <SpinnerOverlay />;
  }


  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Desktop Sidebar - Hidden on mobile */}
      
      {/* Main Content */}
      <div className="flex-1 w-full md:mr-79  p-4 relative">
        <div className="max-w-4xl  mx-auto">
          <h1 className="text-2xl text-center text-blue-900 font-bold ">Faculty Feed</h1>
          <h2 className='text-center text-gray-500 mb-6'> Where you can find everything you need for your dream university</h2>

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
                  <div key={user.id} className="flex  items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
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
      <div className="hidden md:block w-85 fixed right-0 top-0 bg-gray-100 p-5 overflow-y-auto">
  <div className="bg-white rounded-xl shadow-lg px-4 py-4">
    <div className="mb-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-800" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
        </svg>
        Suggested Connections
      </h2>
      <p className="text-sm text-gray-500 mt-1">People you might want to connect with</p>
    </div>

    {/* 🔍 Search Form */}
    <form className="mb-4">
      <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search users..."
      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    />

    </form>

    {/* 🔁 Search Results / Suggested Users */}
    {searchQuery && searchResults.length === 0 ? (
      <div className="text-sm text-gray-500 mt-2">
        No users found for "<span className="font-medium">{searchQuery}</span>".
      </div>
    ) : searchResults.length > 0 ? (
      <div className="space-y-4 mt-2">
        {searchResults.map(user => (
          <Link href={`/user/${user.id}`} key={user.id}>
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                {user.profilePicture ? (
                  <img src={user.profilePicture} className="w-full h-full object-cover" />
                ) : (
                  <FaUserCircle size={24} className="text-gray-500 mx-auto" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <div className="space-y-4 mt-2">
        {suggestedUsers.map(user => (
          <Link href={`/user/${user.id}`} key={user.id}>
            <div className="flex flex-col px-4 py-2 mb-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 hover:border-indigo-100 cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="flex justify-center items-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 overflow-hidden ring-2 ring-white">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={`${user.firstName}'s avatar`} className="w-full h-full object-cover" />
                    ) : (
                      <FaUserCircle className="text-indigo-500 w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-xs font-medium mt-1">
                      {user.role === 'PROFESSOR' && 'Professor'}
                      {user.role === 'ALUMNI' && 'Alumni'}
                      {user.role === 'STUDENT' && 'Student'}
                    </p>
                  </div>
                </div>
                <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Follow</button>
              </div>

              <div className="mt-2">
                <p className="text-xs text-gray-600">
                  {user.role === 'PROFESSOR' && `Teaches ${user.subject} at ${user.university}`}
                  {user.role === 'ALUMNI' && `Graduated from ${user.university}`}
                  {user.role === 'STUDENT' && `Studies ${user.formation} at ${user.university}`}
                </p>
                {user.sharedInterests?.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1 items-center">
                    <span className="flex items-center">
                      <svg className="mr-1 h-3 w-3 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      Both interested in:
                    </span>
                    <p className="font-medium text-indigo-600">{user.sharedInterests.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>

  {/* 🎯 Suggested Events */}
  <div className=" ">
    <section className="bg-white rounded-xl shadow-lg p-6 mt-3">
      <div className='flex justify-center items-baseline gap-2'>
        <FaCalendarAlt className='text-blue-800'/>
        <h1 className="text-xl font-bold "> Suggested events </h1>
      </div>
            <p className="text-sm text-center text-gray-500 mb-4">Events that matches your interests</p>

      <SuggestedEventList session={session} />
    </section>
  </div>
</div>
 
        
        
      </div>
   
  );
}