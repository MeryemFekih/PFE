'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaUserCircle, FaEdit, FaSignOutAlt, FaGraduationCap,
  FaBriefcase, FaChalkboardTeacher, FaUniversity, FaBookmark,
  FaLock, FaUsers, FaEnvelope,
  FaTimes,
  FaBars,
  FaFacebook,
  FaLinkedin,
  FaTwitter
} from 'react-icons/fa';
import { MdEmail, MdSchool, MdInterests, MdPublic } from 'react-icons/md';
import ProfileSidebar from '@/components/ProfileSidebar';

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
import { getFollowDetails } from '@/lib/user-action';
import { input } from '@nextui-org/react';
interface BioData {
  bio: string;
  linkedin: string;
  facebook: string;
  twitter: string;
}

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
function formatUrl(url: string): string {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

export default function ProfilePage() {
  // All state declarations at the top - no conditional hooks
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<{ id: number; firstName: string; lastName?: string } | null>(null);
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
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture ?? null);

  const [showSidebar, setShowSidebar] = useState(false);
  const [isMessageAnimating, setIsMessageAnimating] = useState(false);
  const [conversations, setConversations] = useState<
    { senderId: number; name: string; unreadCount: number }[]
  >([]);
  const [selectedChatFilter, setSelectedChatFilter] = useState<'unread' | 'read' | 'all'>('all');
const [followDetails, setFollowDetails] = useState<{
  followersCount: number;
  followingCount: number;
  followers: any[];
  following: any[];
} | null>(null);
const [showFollowersModal, setShowFollowersModal] = useState(false);
const [showFollowingModal, setShowFollowingModal] = useState(false);
const [modalType, setModalType] = useState<'followers' | 'following'>('followers');
const [bioData, setBioData] = useState<BioData>({
  bio: '',
  linkedin: '',
  facebook: '',
  twitter: ''
});
const [isBioEditing, setIsBioEditing] = useState(false);

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

  const saveBio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const updatedBio: BioData = {
      bio: formData.get('bio') as string,
      linkedin: formData.get('linkedin') as string,
      facebook: formData.get('facebook') as string,
      twitter: formData.get('twitter') as string
    };
    
    // Validate and format URLs
    const formatUrl = (url: string) => {
      if (!url) return '';
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
      }
      return url;
    };
    
    updatedBio.linkedin = formatUrl(updatedBio.linkedin);
    updatedBio.facebook = formatUrl(updatedBio.facebook);
    updatedBio.twitter = formatUrl(updatedBio.twitter);
    
    setBioData(updatedBio);
    localStorage.setItem('userBio', JSON.stringify(updatedBio));
    setIsBioEditing(false);
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
useEffect(() => {
  const fetchFollowDetails = async () => {
    try {
      const sessionRes = await fetch('/api/session');
      if (!sessionRes.ok) return;
      
      const { accessToken } = await sessionRes.json();
      const details = await getFollowDetails(accessToken);
      setFollowDetails(details);
    } catch (error) {
      console.error('Error fetching follow details:', error);
    }
  };

  fetchFollowDetails();
}, []);
    
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
    
    // Extract first and last name from senderMap
    const fullName = senderMap[senderId] || `User ${senderId}`;
    const [firstName, lastName] = fullName.split(' ');
    
    // Set conversation + user with guaranteed string values
    setActiveChatId(convoId);
    setActiveChatUser({ 
      id: senderId, 
      firstName: firstName || `User ${senderId}`,
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
  const handleProfilePicUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/profile-pictures`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.accessToken || ''}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();

    // If backend returns relative path like 'profile-pictures/xyz.png'
    const imageUrl = data.url.startsWith('http')
      ? data.url
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${data.url}`;

    setProfilePicture(imageUrl);
  } catch (error) {
    console.error('❌ Upload failed:', error);
    alert('Upload failed. Please try again.');
  }
};


  // Loading state
if (!user || !selectedTab) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <img
        src="/images/logo.png"
        alt="Loading..."
        className="w-30 h-30 bg-blue-800 rounded-full p-4 animate-spin"
      />
    </div>
  );
}


  function formatUrl(arg0: string): string {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-gray-100  ">
      {/* Main Content */}
      <main className="  overflow-auto pt-6 flex  ">
        <div className=" flex-1/3 flex flex-col gap-6 mx-9 mr-60">
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
      
      {/* Email */}
      <div className="flex items-center mt-1 text-gray-600">
        <MdEmail className="mr-2" />
        <span>{user.email}</span>
      </div>
      
      {/* University */}
      {user.university && (
        <div className="mt-1 flex items-center text-gray-700">
          <FaUniversity className="mr-2 text-gray-500" />
          <span>{user.university}</span>
        </div>
      )}
      
      {/* Follow Counts - Horizontal Layout */}
      <div className="flex gap-4 mt-3">
        <button 
          onDoubleClick={() => {
            setModalType('followers');
            setShowFollowersModal(true);
          }}
          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
        >
          <span className="font-semibold text-gray-900">{followDetails?.followersCount || 0}</span>
          <span className="text-sm text-gray-500">Followers</span>
        </button>
        
        <button 
          onDoubleClick={() => {
            setModalType('following');
            setShowFollowingModal(true);
          }}
          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
        >
          <span className="font-semibold text-gray-900">{followDetails?.followingCount || 0}</span>
          <span className="text-sm text-gray-500">Following</span>
        </button>
      </div>
    </div>

    {/* Edit and Logout Buttons */}
    <div className="flex flex-col justify-items-end gap-2">
      {!isPublicUser && (
  <button
    onClick={() => setIsEditing(true)}
    className="flex items-center gap-2 px-4 py-2 bg-blue-800/90 text-white border border-gray-300 rounded-lg shadow-sm hover:bg-indigo-600  hover:font-medium hover:border-2 hover:border-blue-800  transition-colors"
  >
    <FaEdit className="" />
    <span className="text-sm font-medium ">Edit Profile</span>
  </button>
)}
      
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
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
  <div className="p-6 relative">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center">
        <div className="p-2 bg-blue-50 rounded-lg">
          <FaUserCircle className="text-blue-600 text-xl" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 ml-3">About</h2>
      </div>
      <button
        onClick={() => setIsBioEditing(true)}
        className="text-sm px-2 py-1 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
      >
        <FaEdit size={16} className='h-6 '/> 
      </button>
    </div>

    <div className="space-y-4">
      {bioData.bio ? (
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {bioData.bio}
        </p>
      ) : (
        <p className="text-gray-500 italic">No bio added yet. Tell others about yourself!</p>
      )}

      {(bioData.linkedin || bioData.facebook || bioData.twitter) && (
        <div className="flex flex-wrap gap-4 mt-4">
          {bioData.linkedin && (
            <a href={bioData.linkedin} target="_blank" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <FaLinkedin className="mr-2" /> LinkedIn
            </a>
          )}
          {bioData.facebook && (
            <a href={bioData.facebook} target="_blank" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <FaFacebook className="mr-2" /> Facebook
            </a>
          )}
          {bioData.twitter && (
            <a href={bioData.twitter} target="_blank" className="flex items-center text-blue-400 hover:text-blue-600 transition-colors">
              <FaTwitter className="mr-2" /> Twitter
            </a>
          )}
        </div>
      )}
    </div>
  </div>
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
   <ProfileSidebar />

        {/*  <aside className='w-22 lg:w-1/6 xl:w-1/6 bg-white rounded-xl shadow-md p-6 hidden md:block'>
  <div className="mb-4">
    <h3 className="font-semibold text-gray-800 mb-2">Followers</h3>
    {followDetails?.followers.length ? (
      <div className="space-y-3">
        {followDetails.followers.slice(0, 5).map(user => (
          <Link 
            key={user.id} 
            href={`/user/${user.id}`}
            className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded transition-colors"
          >
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <FaUserCircle className="text-gray-400 text-xl" />
            )}
            <span className="text-sm">
              {user.firstName} {user.lastName?.charAt(0)}.
            </span>
          </Link>
        ))}
        {followDetails.followers.length > 5 && (
          <button 
            onClick={() => {
              setModalType('followers');
              setShowFollowersModal(true);
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            View all {followDetails.followers.length} followers
          </button>
        )}
      </div>
    ) : (
      <p className="text-sm text-gray-500">No followers yet</p>
    )}
  </div>
  
  <div>
    <h3 className="font-semibold text-gray-800 mb-2">Following</h3>
    {followDetails?.following.length ? (
      <div className="space-y-3">
        {followDetails.following.slice(0, 5).map(user => (
          <Link 
            key={user.id} 
            href={`/user/${user.id}`}
            className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded transition-colors"
          >
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <FaUserCircle className="text-gray-400 text-xl" />
            )}
            <span className="text-sm">
              {user.firstName} {user.lastName?.charAt(0)}.
            </span>
          </Link>
        ))}
        {followDetails.following.length > 5 && (
          <button 
            onClick={() => {
              setModalType('following');
              setShowFollowingModal(true);
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            View all {followDetails.following.length} following
          </button>
        )}
      </div>
    ) : (
      <p className="text-sm text-gray-500">Not following anyone</p>
    )}
  </div>
</aside> */}
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
  <>
    {/* 🟦 Blurred Background Overlay */}
    <div
      className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity duration-300 "
      onClick={toggleMessages}
    />

    {/* 🟩 Messages Panel */}
    <div className="fixed bottom-23 right-6 z-40 rounded-xl border border-gray-300 h-2/3 w-full max-w-xs bg-white shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-800">Messages</h3>
        <button onClick={toggleMessages} className="text-gray-500 hover:text-red-700">
          <FaTimes />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-around border-b border-gray-200 bg-gray-100 text-sm font-medium">
        {['unread', 'read', 'all'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedChatFilter(filter as 'unread' | 'read' | 'all')}
            className={`flex-1 py-2 ${
              selectedChatFilter === filter
                ? 'text-indigo-700 border-b-2 border-indigo-700'
                : 'text-gray-500'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto relative">
        {!activeChatId && conversations
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

        {/* ChatBox shown inside the same panel */}
        
      </div>
    </div>
  </>
)}
{/* Fullscreen Chat Modal */}
{activeChatId && activeChatUser && session?.user?.id && (
  <>
    {/* Blurred overlay */}
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={() => {
        setActiveChatId(null);
        setActiveChatUser(null);
      }}
    />

    {/* Chat popup modal */}
    <div className="fixed z-50 inset-0 flex items-center justify-center">
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Chat with {activeChatUser.firstName}
          </h3>
          <button
            onClick={() => {
              setActiveChatId(null);
              setActiveChatUser(null);
            }}
            className="text-gray-500 hover:text-red-600"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
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
      </div>
    </div>
  </>
)}

 {/* Add this at the bottom of your component, before the closing </div> */}
{(showFollowersModal || showFollowingModal) && (
  <div className="fixed inset-0 bg-black/70 bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-bold text-lg">
          {modalType === 'followers' ? 'Followers' : 'Following'}
        </h3>
        <button 
          onClick={() => {
            setShowFollowersModal(false);
            setShowFollowingModal(false);
          }}
          className="text-gray-500 hover:text-red-700"
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {(modalType === 'followers' ? followDetails?.followers : followDetails?.following)?.length ? (
          <div className="divide-y">
            {(modalType === 'followers' ? followDetails?.followers : followDetails?.following)?.map(user => (
              <Link 
                key={user.id} 
                href={`/user/${user.id}`}
                className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    width={48}
                    height={48}
                    className="rounded-full"
                     onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-profile.png';
                    }}
                  />
                ) : (
                  <FaUserCircle className="text-gray-400 text-4xl" />
                )}
                <div>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaUsers className="text-gray-400 text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {modalType === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
            </h3>
            <p className="mt-2 text-gray-500">
              {modalType === 'followers' 
                ? "When someone follows you, they'll appear here."
                : "When you follow someone, they'll appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
{isBioEditing && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-40 backdrop-blur-sm px-4">
    <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6 relative">
      <button
        onClick={() => setIsBioEditing(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <FaTimes size={20} />
      </button>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Your Bio</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const updatedBio: BioData = {
            bio: formData.get('bio') as string,
            linkedin: formatUrl(formData.get('linkedin') as string),
            facebook: formatUrl(formData.get('facebook') as string),
            twitter: formatUrl(formData.get('twitter') as string),
          };
          setBioData(updatedBio);
          localStorage.setItem('userBio', JSON.stringify(updatedBio));
          setIsBioEditing(false);
        }}
        className="space-y-5"
      >
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio <span className="text-gray-500 text-xs">(Max 500 characters)</span>
          </label>
          <textarea
            name="bio"
            defaultValue={bioData.bio}
            maxLength={500}
            rows={6}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Social Links</h3>
          {(([
            ['linkedin', FaLinkedin],
            ['facebook', FaFacebook],
            ['twitter', FaTwitter]
          ] as const).map(([name, Icon]) => (
            <div className="flex items-center gap-3" key={name}>
              <Icon className="text-xl" />
              <input
                type="url"
                name={name}
                defaultValue={bioData[name as keyof BioData]}
                placeholder={`${name}.com/yourname`}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />
            </div>
          )))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setIsBioEditing(false)}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Save Bio
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      </div>
   
  );}