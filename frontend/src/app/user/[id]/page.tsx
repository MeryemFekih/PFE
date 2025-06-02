'use client';

import { useEffect, useState, MouseEvent } from 'react';
import Image from 'next/image';
import {
  FaUserCircle, FaGraduationCap, FaBriefcase, 
  FaChalkboardTeacher, FaUniversity, FaBookmark,
  FaArrowLeft, FaPaperclip, FaTimes
} from 'react-icons/fa';
import { MdEmail, MdSchool, MdInterests } from 'react-icons/md';

import Sidebar from '@/components/sidebar';
import PostCard from '@/components/post-card';

import { Session } from '@/lib/session';
import { checkIfFollowing, getUserProfileWithPosts, toggleFollow } from '@/lib/user-action';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getOrCreateConversation } from '@/lib/firebase-chat';
import { ChatBox } from '@/components/ChatBox';

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    degree: any;
    formation: any;
    university: any;
    profilePicture: any;
  };
  comments: any[];
}

export default function UserPage() {
  const [session, setSession] = useState<Session | null>(null);
  interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    profilePicture?: string;
    university?: string;
    formation?: string;
    degree?: string;
    graduationYear?: string;
    occupation?: string;
    subject?: string;
    rank?: string;
    interests?: string[];
    canMessage?: boolean;
    canFollow?: boolean;
    posts?: Post[];
  }
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTab, setSelectedTab] = useState<'posts' | 'saved'>('posts');
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [showChat, setShowChat] = useState(false);
  const [convoId, setConvoId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const urlParams = useParams();
  const id = Number(urlParams.id);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const sessionRes = await fetch('/api/session');
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        setSession(sessionData);
      }

      const userData = await getUserProfileWithPosts(id);
      setUser(userData);
      setPosts(userData.posts || []);
    };

    const loadFollowState = async () => {
      const result = await checkIfFollowing(id);
      setIsFollowing(result);
    };

    loadData();
    loadFollowState();
  }, [id]);

  const handleFollow = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newStatus = await toggleFollow(id, isFollowing);
    setIsFollowing(newStatus);
  };

  async function handleMessage() {
    if (!user) return;
    const sessionRes = await fetch('/api/session');
    const { user: me } = await sessionRes.json();
    if (!session) return;

    const convoId = await getOrCreateConversation(session.user.id, user.id);
    setConvoId(convoId);
    setShowChat(true);
  }

  const getRoleIcon = () => {
    if (!user?.role) return <FaUserCircle />;
    switch (user.role) {
      case 'STUDENT': return <MdSchool className="text-blue-500" />;
      case 'PROFESSOR': return <FaChalkboardTeacher className="text-purple-500" />;
      case 'ALUMNI': return <FaGraduationCap className="text-green-500" />;
      default: return <FaUserCircle />;
    }
  };

  const getRoleColor = () => {
    if (!user?.role) return 'bg-gray-100 text-gray-800';
    switch (user.role) {
      case 'STUDENT': return 'bg-blue-100 text-blue-800';
      case 'PROFESSOR': return 'bg-purple-100 text-purple-800';
      case 'ALUMNI': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleSave = (postId: number) => {
    console.log(`Toggle save for post ${postId}`);
  };

  const handleDeletePost = (postId: number) => {
    console.log(`Delete post ${postId}`);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-gray-500">Loading profile...</div>
      </div>
    );
  }

  // Mobile chat view
  if (isMobile && showChat && convoId && session) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="bg-blue-600 text-white p-4 flex items-center">
          <button 
            onClick={() => setShowChat(false)}
            className="mr-4 text-white"
          >
            <FaArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">Chat with {user.firstName}</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatBox convoId={convoId} currentUserId={session.user.id} fullScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - hidden on mobile when chat is open */}
      {(!isMobile || !showChat) && (
        <div className="hidden md:block h-full fixed left-0 top-0 shadow z-30">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 py-8 px-4 sm:px-4 lg:px-8 transition-all duration-300 ${showChat && !isMobile ? 'md:ml-64' : ''}`}>
        <div className="flex">
          <div className="w-200 flex flex-col gap-6 mx-auto ">
            {/* Profile content - hidden on mobile when chat is open */}
            {(!isMobile || !showChat) && (
              <>
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="relative">
                        {user.profilePicture ? (
                          <Image
                            src={user.profilePicture}
                            alt="Profile"
                            width={120}
                            height={120}
                            className="rounded-full object-cover border-4 border-white shadow-md"
                          />
                        ) : (
                          <FaUserCircle className="w-[120px] h-[120px] text-gray-300" />
                        )}
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor()}`}>
                            {getRoleIcon()}
                            <span className="ml-1">{user.role?.toLowerCase() || 'user'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col justify-around">
                            <h1 className="text-2xl font-bold text-gray-900">
                              {user.firstName} {user.lastName || ''}
                            </h1>
                            
                            <div className="flex items-center mt-1 text-gray-600">
                              <MdEmail className="mr-2" />
                              <span>{user.email}</span>
                            </div>
                            {user.university && (
                              <div className="mt-4 flex items-center text-gray-700">
                                <FaUniversity className="mr-2 text-gray-500" />
                                <span>{user.university}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 mt-4 border-t border-gray-200 pt-4">
                          {user.canMessage && (
                            <button 
                              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              onClick={handleMessage}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                              Message
                            </button>
                          )}
                          
                          {user.canFollow && (
                            <button 
                              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                                isFollowing 
                                  ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-gray-500' 
                                  : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                              }`}
                              onClick={handleFollow}
                            >
                              {isFollowing ? (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Following
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                  Follow
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Sections */}
                <div className="flex flex-col md:flex-row gap-6">
                  {(user.formation || user.graduationYear || user.degree) && (
                    <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <MdSchool className="text-blue-500 text-xl mr-2" />
                          <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                        </div>
                        <div className="space-y-3">
                          {user.formation && (
                            <div>
                              <p className="text-sm text-gray-500">Formation</p>
                              <p className="font-medium">{user.formation}</p>
                            </div>
                          )}
                          {user.degree && (
                            <div>
                              <p className="text-sm text-gray-500">Degree</p>
                              <p className="font-medium">{user.degree}</p>
                            </div>
                          )}
                          {user.graduationYear && (
                            <div>
                              <p className="text-sm text-gray-500">Graduation Year</p>
                              <p className="font-medium">{user.graduationYear?.slice(0, 10)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {(user.occupation || user.subject || user.rank) && (
                    <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <FaBriefcase className="text-purple-500 text-xl mr-2" />
                          <h2 className="text-lg font-semibold text-gray-900">
                            {user.role === 'PROFESSOR' ? 'Teaching' : 'Professional'} Information
                          </h2>
                        </div>
                        <div className="space-y-3">
                          {user.occupation && (
                            <div>
                              <p className="text-sm text-gray-500">Occupation</p>
                              <p className="font-medium">{user.occupation}</p>
                            </div>
                          )}
                          {user.subject && (
                            <div>
                              <p className="text-sm text-gray-500">Subject</p>
                              <p className="font-medium">{user.subject}</p>
                            </div>
                          )}
                          {user.rank && (
                            <div>
                              <p className="text-sm text-gray-500">Rank</p>
                              <p className="font-medium">{user.rank}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {user.interests && user.interests.length > 0 && (
                    <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <MdInterests className="text-green-500 text-xl mr-2" />
                          <h2 className="text-lg font-semibold text-gray-900">Interests</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {user.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Posts Section */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="flex justify-around rounded-2xl bg-white p-3">
                      <button
                        onClick={() => setSelectedTab('posts')}
                        className={`px-1 border-b-2 font-medium text-sm flex gap-2 ${
                          selectedTab === 'posts'
                            ? 'border-blue-800 text-blue-800'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <FaGraduationCap className="text-lg" />
                        <span>Posts</span>
                      </button>
                      {session?.user?.id === user.id && (
                        <button
                          onClick={() => setSelectedTab('saved')}
                          className={`px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                            selectedTab === 'saved'
                              ? 'border-blue-800 text-blue-800'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <FaBookmark className="text-lg" />
                          <span>Saved Posts</span>
                        </button>
                      )}
                    </nav>
                  </div>

                  <div className="mt-6">
                    {selectedTab === 'posts' ? (
                      <div className="space-y-6">
                        {posts.length > 0 ? (
                          posts.map(post => session && (
                            <PostCard
                              key={post.id}
                              post={post}
                              session={session}
                              isPending={false}
                              saved={false}
                              onToggleSave={handleToggleSave}
                              onDelete={handleDeletePost}
                            />
                          ))
                        ) : (
                          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <FaGraduationCap className="text-gray-400 text-3xl" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
                            <p className="text-gray-500 mb-4">
                              This user hasn't shared any posts yet
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaBookmark className="text-gray-400 text-3xl" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">Saved posts are private</h3>
                          <p className="mt-2 text-gray-500 max-w-md mx-auto">
                            You can only view your own saved posts.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Chat box - desktop view */}
            {!isMobile && showChat && convoId && session && (
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Chat with {user.firstName}</h3>
                  <button 
                    onClick={() => setShowChat(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                <ChatBox convoId={convoId} currentUserId={session.user.id} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Enhanced ChatBox component
