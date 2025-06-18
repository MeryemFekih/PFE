'use client';

import { useEffect, useState, MouseEvent } from 'react';
import Image from 'next/image';
import {
  FaUserCircle, FaGraduationCap, FaBriefcase, 
  FaChalkboardTeacher, FaUniversity, FaBookmark,
  FaArrowLeft, FaPaperclip, FaTimes, FaEllipsisV,
  FaUsers, FaUserFriends,
  FaUserPlus
} from 'react-icons/fa';
import { MdEmail, MdSchool, MdInterests } from 'react-icons/md';
import { IoMdSend } from 'react-icons/io';

import Sidebar from '@/components/sidebar';
import PostCard from '@/components/post-card';

import { Session } from '@/lib/session';
import { checkIfFollowing, getUserProfileWithPosts, toggleFollow } from '@/lib/user-action';
import { useRouter, useParams } from 'next/navigation';
import { getOrCreateConversation } from '@/lib/firebase-chat';
import { ChatBox } from '@/components/ChatBox';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
  followersCount?: number;
  followingCount?: number;
}

export default function UserPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTab, setSelectedTab] = useState<'posts' | 'saved'>('posts');
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [showChat, setShowChat] = useState(false);
  const [convoId, setConvoId] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      try {
        setLoading(true);
        setError(null);
        
        const [sessionRes, userData] = await Promise.all([
          fetch('/api/session'),
          getUserProfileWithPosts(id)
        ]);

        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          setSession(sessionData);
        }

        setUser(userData);
        setPosts(userData.posts || []);

        const followStatus = await checkIfFollowing(id);
        setIsFollowing(followStatus);
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleFollow = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const newStatus = await toggleFollow(id, isFollowing);
      setIsFollowing(newStatus);
    } catch (err) {
      setError('Failed to update follow status');
    }
  };

  const handleMessage = async () => {
    if (!user) return;
    
    try {
      const sessionRes = await fetch('/api/session');
      const sessionData = await sessionRes.json();
      setSession(sessionData);
      if (!sessionData) return;

      const conversationId = await getOrCreateConversation(sessionData.user.id, user.id);
      setConvoId(conversationId);
      setRecipientId(user.id);
      setShowChat(true);
    } catch (err) {
      setError('Failed to start conversation');
    }
  };

  const getRoleIcon = () => {
    if (!user?.role) return <FaUserCircle className="text-gray-500" />;
    switch (user.role) {
      case 'STUDENT': return <MdSchool className="text-blue-500" />;
      case 'PROFESSOR': return <FaChalkboardTeacher className="text-purple-500" />;
      case 'ALUMNI': return <FaGraduationCap className="text-green-500" />;
      default: return <FaUserCircle className="text-gray-500" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden md:block h-full fixed left-0 top-0 shadow z-30">
          <Sidebar />
        </div>
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 md:ml-64">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-6">
              {/* Profile Header Skeleton */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <Skeleton className="w-[120px] h-[120px] rounded-full" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                    <div className="flex gap-3">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Profile Sections Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
              </div>
              
              {/* Posts Skeleton */}
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
          <p className="text-gray-500 mb-4">Please try again later</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            <FaUserCircle className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-500 mb-4">The user profile you're looking for doesn't exist</p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:block h-full fixed left-0 top-0 shadow z-30">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${showChat ? 'md:mr-80' : ''}`}>
        <main className="py-8 px-4 sm:px-6 lg:px-8 md:ml-64">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-6">
              {/* Profile Header */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative shrink-0">
                      {user.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt={`${user.firstName}'s profile`}
                          width={120}
                          height={120}
                          className="rounded-full object-cover border-4 border-white shadow-md aspect-square"
                          priority
                        />
                      ) : (
                        <div className="w-[120px] h-[120px] rounded-full bg-gray-100 flex items-center justify-center">
                          <FaUserCircle className="w-full h-full text-gray-300" />
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor()}`}>
                          {getRoleIcon()}
                          <span className="ml-1 capitalize">{user.role?.toLowerCase() || 'user'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <h1 className="text-2xl font-bold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h1>
                          
                          <div className="flex items-center mt-1 text-gray-600">
                            <MdEmail className="mr-2 shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>

                          {user.university && (
                            <div className="mt-1 flex items-center text-gray-700">
                              <FaUniversity className="mr-2 text-gray-500 shrink-0" />
                              <span>{user.university}</span>
                            </div>
                          )}

                          {/* Follow Counts */}
                          <div className="flex gap-4 mt-3">
                            <button 
                              onClick={() => router.push(`/user/${id}/followers`)}
                              className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                            >
                              <span className="font-semibold text-gray-900">{user.followersCount || 0}</span>
                              <span className="text-sm text-gray-500">Followers</span>
                            </button>
                            
                            <button 
                              onClick={() => router.push(`/user/${id}/following`)}
                              className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                            >
                              <span className="font-semibold text-gray-900">{user.followingCount || 0}</span>
                              <span className="text-sm text-gray-500">Following</span>
                            </button>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                              <FaEllipsisV className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(window.location.href)}>
                              Copy profile link
                            </DropdownMenuItem>
                            {session?.user?.id === user.id && (
                              <DropdownMenuItem onClick={() => router.push('/settings')}>
                                Edit profile
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-3 mt-4 border-t border-gray-200 pt-4">
                        {user.canMessage && (
                          <Button 
                            variant="outline"
                            className="gap-2"
                            onClick={handleMessage}
                          >
                            <IoMdSend className="h-4 w-4" />
                            Message
                          </Button>
                        )}
                        
                        {user.canFollow && (
                          <Button 
                            variant={isFollowing ? "outline" : "default"}
                            className="gap-2"
                            onClick={handleFollow}
                          >
                            {isFollowing ? (
                              <>
                                <FaUserFriends className="h-4 w-4" />
                                Following
                              </>
                            ) : (
                              <>
                                <FaUserPlus className="h-4 w-4" />
                                Follow
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(user.formation || user.graduationYear || user.degree) && (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <MdSchool className="text-blue-500 text-xl mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                      </div>
                      <div className="space-y-4">
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
                            <p className="font-medium">{new Date(user.graduationYear).getFullYear()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {(user.occupation || user.subject || user.rank) && (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <FaBriefcase className="text-purple-500 text-xl mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          {user.role === 'PROFESSOR' ? 'Teaching' : 'Professional'} Information
                        </h2>
                      </div>
                      <div className="space-y-4">
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
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
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
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="border-b border-gray-200">
                  <nav className="flex justify-around">
                    <button
                      onClick={() => setSelectedTab('posts')}
                      className={`px-4 py-4 text-sm font-medium flex items-center gap-2 relative ${
                        selectedTab === 'posts'
                          ? 'text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <FaGraduationCap className="text-lg" />
                      <span>Posts</span>
                      {selectedTab === 'posts' && (
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t"></span>
                      )}
                    </button>
                    {session?.user?.id === user.id && (
                      <button
                        onClick={() => setSelectedTab('saved')}
                        className={`px-4 py-4 text-sm font-medium flex items-center gap-2 relative ${
                          selectedTab === 'saved'
                            ? 'text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <FaBookmark className="text-lg" />
                        <span>Saved Posts</span>
                        {selectedTab === 'saved' && (
                          <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t"></span>
                        )}
                      </button>
                    )}
                  </nav>
                </div>

                <div className="p-6">
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
                            onToggleSave={() => {}}
                            onDelete={() => {}}
                          />
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaGraduationCap className="text-gray-400 text-3xl" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
                          <p className="text-gray-500">
                            {session?.user?.id === user.id ? (
                              "You haven't shared any posts yet"
                            ) : (
                              "This user hasn't shared any posts yet"
                            )}
                          </p>
                          {session?.user?.id === user.id && (
                            <Button className="mt-4" onClick={() => router.push('/create-post')}>
                              Create your first post
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FaBookmark className="text-gray-400 text-3xl" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">Saved posts</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-4">
                        Your saved posts appear here. Only you can see your saved items.
                      </p>
                      <Button variant="outline" onClick={() => setSelectedTab('posts')}>
                        View your posts
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Chat Sidebar */}
      {showChat && convoId && session && recipientId && (
    <div className={`
      fixed inset-0 bg-white z-50 
      md:fixed md:right-0 md:top-0 md:bottom-0 md:w-80 md:left-auto
      md:border-l md:shadow-lg 
      ${isMobile ? '' : 'hidden md:block'}
    `}>
      {isMobile && (
        <div className="bg-blue-600 text-white p-4 flex items-center">
          <button 
            onClick={() => setShowChat(false)} 
            className="mr-4 text-white"
          >
            <FaArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">Chat with {user.firstName}</h2>
        </div>
      )}
      {!isMobile && (
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Chat with {user.firstName}</h2>
          <button 
            onClick={() => setShowChat(false)} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
      )}
      <div className="h-full overflow-y-auto">
        <ChatBox 
          convoId={convoId} 
          currentUserId={session.user.id}  
          user={{ id: recipientId, firstName: user.firstName, lastName: user.lastName }}
          fullScreen={isMobile}
          onClose={() => setShowChat(false)}
        />
      </div>
    </div>
  )}
</div>
);
}