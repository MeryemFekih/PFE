'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  FaUserCircle, FaEdit, FaSignOutAlt, FaGraduationCap,
  FaBriefcase, FaChalkboardTeacher, FaUniversity, FaBookmark,
  FaLock, FaUsers, FaEnvelope,
  FaTimes,
  FaBars
} from 'react-icons/fa';
import { MdEmail, MdSchool, MdInterests, MdPublic } from 'react-icons/md';

import Sidebar from '@/components/sidebar';
import EditProfile from '@/components/EditProfile';
import PostCard from '@/components/post-card';
import ClientPostFormProfile from '@/components/ui/PostFormProfile';
import { collectionGroup, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Session } from '@/lib/session';
import { UserProfile } from '@/lib/profile-actions';
import { ChatBox } from '@/components/ChatBox';
import { getOrCreateConversation } from '@/lib/firebase-chat';
import SidebarWrapper from '@/components/sidebar';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  mediaUrl: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    degree: any;
    formation: any;
    university: any;
  };
  comments: any[];
}

type TabType = 'posts' | 'saved' | 'rules' ;

export default function ProfilePage() {
  // All state declarations at the top - no conditional hooks
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<{ id: number; firstName: string } | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [posts, setPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [savedMap, setSavedMap] = useState<Record<number, boolean>>({});
  const [selectedTab, setSelectedTab] = useState<TabType | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Record<number, number>>({});
  const [senderMap, setSenderMap] = useState<Record<number, string>>({});
  const [showMessages, setShowMessages] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMessageAnimating, setIsMessageAnimating] = useState(false);
  const [conversations, setConversations] = useState<
    { senderId: number; name: string; unreadCount: number }[]
  >([]);
  const [selectedChatFilter, setSelectedChatFilter] = useState<'unread' | 'read' | 'all'>('all');

  // Derived values
  const unreadSenders = Object.keys(notifications).length;
  const isPublicUser = user?.role === 'PUBLIC';

  // Handle mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const toggleMessages = () => {
    setIsMessageAnimating(true);
    setShowMessages(!showMessages);
    setTimeout(() => setIsMessageAnimating(false), 500);
  };
  // Fetch saved posts
  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const sessionRes = await fetch('/api/session');
        if (!sessionRes.ok) return;
        
        const { accessToken } = await sessionRes.json();

        const res = await fetch('http://localhost:4000/post/saved', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          setSavedPosts(data);
          const map: Record<number, boolean> = {};
          data.forEach((post: any) => {
            map[post.id] = true;
          });
          setSavedMap(map);
        }
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      }
    };

    fetchSavedPosts();
  }, []);

  // Load profile and posts
  useEffect(() => {
    setShowMessages(false);
    const loadProfileAndPosts = async () => {
      try {
        const sessionRes = await fetch('/api/session');
        if (!sessionRes.ok) return;

        const { accessToken, refreshToken, user: sessionUser } = await sessionRes.json();

        const profileRes = await fetch('http://localhost:4000/user/profile', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUser(profile);
          setFormData(profile);
          setSession({ accessToken, refreshToken, user: sessionUser });

          // Set default tab based on user role and notifications
          if (!selectedTab) {
            const defaultTab: TabType =
              profile.role === 'PUBLIC' ? 'rules' : 'posts';
            setSelectedTab(defaultTab);
          }


          // Fetch user posts if not public user
          if (profile.role !== 'PUBLIC' && sessionUser?.id) {
            const postsRes = await fetch(`http://localhost:4000/post/user/${sessionUser.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (postsRes.ok) {
              const data = await postsRes.json();
              setPosts(data);
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile and posts:', error);
      }
    };

    loadProfileAndPosts();
  }, [notifications, selectedTab]); // Include selectedTab in dependencies

  // Handle Firebase notifications
  useEffect(() => {
  if (!session?.user?.id || !session?.accessToken) return;

  const messagesRef = collectionGroup(db, 'messages');
  const q = query(
    messagesRef,
    where('recipientId', '==', session.user.id)
  );

  const unsubscribe = onSnapshot(q, async (snap) => {
    const unread: Record<number, number> = {};
    const senderIds: Set<number> = new Set();

    snap.forEach((doc) => {
      const data = doc.data();
      senderIds.add(data.senderId);
      if (!data.read) {
        unread[data.senderId] = (unread[data.senderId] || 0) + 1;
      }
    });

    setNotifications(unread);

    // Fetch user info for all senders
    if (senderIds.size > 0) {
      try {
        const ids = Array.from(senderIds).join(',');
        const res = await fetch(`http://localhost:4000/user/batch?ids=${ids}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          }
        });
        if (res.ok) {
          const data = await res.json();
          const nameMap: Record<number, string> = {};
          data.forEach((u: any) => {
            nameMap[u.id] = `${u.firstName} ${u.lastName}`;
          });
          setSenderMap(nameMap);

          // Set conversation info
          const conversationList = data.map((u: any) => ({
            senderId: u.id,
            name: `${u.firstName} ${u.lastName}`,
            unreadCount: unread[u.id] || 0
          }));
          setConversations(conversationList); // 👈 optional if you're displaying tabs
        }
      } catch (error) {
        console.error('Error fetching sender info:', error);
      }
    }
  });

  return unsubscribe;
}, [session?.user?.id]);

    
  const handleSubmit = useCallback(async () => {
    try {
      const sessionRes = await fetch('/api/session');
      const { accessToken } = await sessionRes.json();

      const res = await fetch('http://localhost:4000/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }, [formData]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = 'auth/signIn';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  const handleToggleSave = useCallback((postId: number) => {
    console.log(`Toggle save for post ${postId}`);
  }, []);

  const handleDeletePost = useCallback((postId: number) => {
    console.log(`Delete post ${postId}`);
  }, []);

  const openChatWith = useCallback(async (senderId: number) => {
  if (!session?.user?.id) return;

  // If already chatting with this user, close the chat
  if (activeChatUser?.id === senderId) {
    setActiveChatId(null);
    setActiveChatUser(null);
    return;
  }

  try {
    const convoId = await getOrCreateConversation(session.user.id, senderId);
    
    // ✅ Set conversation + user
    setActiveChatId(convoId);
    setActiveChatUser({ 
      id: senderId, 
      firstName: senderMap[senderId] || `User ${senderId}` 
    });

    // ✅ Clear unread notification for this sender
    setNotifications(prev => {
      const newNotifications = { ...prev };
      delete newNotifications[senderId];
      return newNotifications;
    });

    setShowMessages(true); // Show chat box
  } catch (error) {
    console.error('Error opening chat:', error);
  }
}, [session?.user?.id, senderMap, activeChatUser]);


  // Utility functions
  const getRoleIcon = () => {
    switch (user?.role) {
      case 'STUDENT': return <MdSchool className="text-blue-500" />;
      case 'PROFESSOR': return <FaChalkboardTeacher className="text-purple-500" />;
      case 'ALUMNI': return <FaGraduationCap className="text-green-500" />;
      case 'PUBLIC': return <MdPublic className="text-gray-500" />;
      default: return <FaUserCircle />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'STUDENT': return 'bg-blue-100 text-blue-800';
      case 'PROFESSOR': return 'bg-purple-100 text-purple-800';
      case 'ALUMNI': return 'bg-green-100 text-green-800';
      case 'PUBLIC': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (!user || !selectedTab) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}

      <SidebarWrapper />
      
      

      {/* Main Content */}
      <main className="flex-1 overflow-auto py-8 sm:px-4 lg:px-4">
        <div className="max-w-4xl flex flex-col gap-6 mx-auto">
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
                      <span className="ml-1">{user.role.toLowerCase()}</span>
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

                    <div className="flex flex-col justify-items-end gap-2">
                      {!isPublicUser && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-900 hover:bg-gray-100 hover:border-2 hover:border-b-blue-900 hover:text-blue-900 text-white px-4 h-10 rounded-lg font-semibold flex items-center justify-center transition-colors"
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="bg-red-700 hover:bg-white hover:border-2 hover:border-red-900 hover:text-red-900 text-white px-4 h-10 rounded-lg font-semibold flex items-center justify-center transition-colors"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
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

          {/* Tabs */}
          <div className="border-gray-200 rounded-full shadow-md">
            <nav className="flex justify-around rounded-2xl bg-white p-3">
              {!isPublicUser ? (
                <>
                  <button
                    onClick={() => setSelectedTab('posts')}
                    className={`px-1 border-b-2 font-medium text-sm flex gap-2 transition-colors ${
                      selectedTab === 'posts'
                        ? 'border-blue-800 text-blue-800'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <FaGraduationCap className="text-lg" />
                    <span>My Posts</span>
                  </button>
                  <button
                    onClick={() => setSelectedTab('saved')}
                    className={`px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                      selectedTab === 'saved'
                        ? 'border-blue-800 text-blue-800'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <FaBookmark className="text-lg" />
                    <span>Saved Posts</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedTab('rules')}
                    className={`px-1 border-b-2 font-medium text-sm flex gap-2 transition-colors ${
                      selectedTab === 'rules'
                        ? 'border-blue-800 text-blue-800'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <FaLock className="text-lg" />
                    <span>Access Rules</span>
                  </button>
                  <button
                    onClick={() => setSelectedTab('saved')}
                    className={`px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                      selectedTab === 'saved'
                        ? 'border-blue-800 text-blue-800'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <FaBookmark className="text-lg" />
                    <span>Saved Posts</span>
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="">
            {selectedTab === 'posts' && !isPublicUser && (
              <div className="space-y-6">
                {posts.length > 0 && session ? (
                  posts
                    .filter(post => post.status === 'APPROVED')
                    .map(post => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onDelete={handleDeletePost}
                        session={session}
                        isPending={false}
                        saved={false}
                        onToggleSave={() => {}}
                      />
                    ))
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FaGraduationCap className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-4">
                      Share your thoughts and ideas with the community
                    </p>
                    <button
                      onClick={() => setPostModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create your first post
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'saved' && (
              <div className="space-y-6">
                {savedPosts.length > 0 ? (
                  savedPosts.map(post => session && (
                    <PostCard
                      key={post.id}
                      post={post}
                      session={session}
                      saved={!!savedMap[post.id]}
                      onToggleSave={handleToggleSave}
                      onDelete={() => {}}
                      isPending={false}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FaBookmark className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No saved posts</h3>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                      {isPublicUser 
                        ? "When you save public posts, they'll appear here."
                        : "When you save posts, they'll appear here."
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'rules' && isPublicUser && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Public User Access Rules</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <MdPublic className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Current Access Level</h3>
                      <p className="text-gray-600 mt-1">
                        As a public user, you have limited access to the platform.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <FaUsers className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">What You Can Do</h3>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                        <li>View and interact with public posts</li>
                        <li>Comment on public posts</li>
                        <li>Save posts for later reference</li>
                        <li>Download public content</li>
                        <li>Participate in open events and formations</li>
                        <li>Send messages to alumni, students, and professors</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-100 rounded-full">
                      <FaLock className="text-red-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Restrictions</h3>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                        <li>Cannot create posts in internal university spaces</li>
                        <li>Cannot view private posts from university members</li>
                        <li>Cannot follow university members</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <FaUniversity className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">University Verification</h3>
                      <p className="text-gray-600 mt-1">
                        If you're part of the university community, your account will be approved after less than 3 days of your account creation after verification
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals - Only render for non-public users */}
        {!isPublicUser && (
          <>
            <EditProfile
              isOpen={isEditing}
              onClose={() => setIsEditing(false)}
              onSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
              role={user.role as 'STUDENT' | 'PROFESSOR' | 'ALUMNI'}
            />
            <ClientPostFormProfile
              open={postModalOpen}
              onOpenChange={setPostModalOpen}
            />
          </>
        )}
      </main>
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMessageAnimating ? 'animate-bounce' : ''
        }`}
      >
        <button
          onClick={toggleMessages}
          className="relative p-4 bg-blue-700 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <FaEnvelope className="text-white text-2xl" />
          {unreadSenders > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadSenders}
            </span>
          )}
        </button>
      </div>

      {/* Messages Panel */}
      {showMessages && (
  <div className="fixed bottom-22 right-5 rounded-xl border-1 border-gray-300 h-2/3 w-full max-w-xs bg-white  shadow-2xl z-40">
    
    {/* Header */}
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <h3 className="font-bold text-gray-800">Messages</h3>
      <button
        onClick={toggleMessages}
        className="text-gray-500 hover:text-red-700"
      >
        <FaTimes />
      </button>
    </div>

    {/* 👇 Insert FILTER TABS here */}
    <div className="flex justify-around border-b border-gray-200 bg-gray-100 text-sm font-medium">
      <button
        onClick={() => setSelectedChatFilter('unread')}
        className={`flex-1 py-2 ${selectedChatFilter === 'unread' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-500'}`}
      >
        Unread
      </button>
      <button
        onClick={() => setSelectedChatFilter('read')}
        className={`flex-1 py-2 ${selectedChatFilter === 'read' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-500'}`}
      >
        Read
      </button>
      <button
        onClick={() => setSelectedChatFilter('all')}
        className={`flex-1 py-2 ${selectedChatFilter === 'all' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-500'}`}
      >
        All
      </button>
    </div>

    {/* 👇 Insert CONVERSATION LIST here */}
    <div className="overflow-y-auto h-[calc(100%-100px)]">
      {conversations
        .filter(c => {
          if (selectedChatFilter === 'unread') return c.unreadCount > 0;
          if (selectedChatFilter === 'read') return c.unreadCount === 0;
          return true;
        })
        .map(({ senderId, name, unreadCount }) => (
          <button
            key={senderId}
            onClick={() => openChatWith(senderId)}
            className="flex items-center justify-between w-full p-3 hover:bg-gray-50 border-b border-gray-200"
          >
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-indigo-800 w-6 h-6" />
              <span>{name}</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </button>
        ))}
    

    {/* 👇 Show full-screen ChatBox inside the panel if open */}
    {activeChatId && activeChatUser && session?.user?.id && (
      <div className="absolute inset-0 rounded-xl bg-white z-10">
        <ChatBox
          convoId={activeChatId}
          currentUserId={session.user.id}
          user={activeChatUser}
          fullScreen={true}
          onBack={() => {
            setActiveChatId(null);
            setActiveChatUser(null);
          }}
        />
      


            </div>
          )}
        </div>
    );
  </div>
      )}
    </div>
  );}
