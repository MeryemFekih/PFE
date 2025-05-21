
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useState, useRef, startTransition } from 'react';
import Image from 'next/image';
import {
  FaUserCircle,
  FaEdit,
  FaSignOutAlt,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaBookmark,
  FaTimes,
  FaBriefcase
} from 'react-icons/fa';
import { MdEmail, MdInterests, MdSchool } from 'react-icons/md';
import {
  getUserProfileAndPosts,
  UserProfile,
  updateProfile
} from '@/lib/profile-actions';
import PostCard from '../../components/post-card';
import { Session } from '@/lib/session';
import { deletePost } from '@/lib/post-action';
interface ProfilePageProps {
  session: Session;
}


export default function ProfilePage({  session }: ProfilePageProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'posts' | 'saved'>('posts');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    university: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeletePost = (postId: number) => {
    startTransition(() => {
      deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
    });
  };

  useEffect(() => {
    (async () => {
      const { profile, posts } = await getUserProfileAndPosts();
      if (profile) {
        setUser(profile);
        setFormData({
          firstName: profile.firstName,
          lastName: profile.lastName || '',
          university: profile.university || ''
        });
      }
      setPosts(posts);
    })();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUser(prev => prev ? {
            ...prev,
            profilePicture: event.target?.result as string
          } : null);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('university', formData.university);
      
      if (fileInputRef.current?.files?.[0]) {
        formDataToSend.append('profilePicture', fileInputRef.current.files[0]);
      }

      const updatedProfile = await updateProfile(formDataToSend);
      if (updatedProfile) {
        setUser(prev => prev ? { ...prev, ...updatedProfile } : null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/signout';
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'STUDENT': return <MdSchool className="text-blue-500" size={18} />;
      case 'PROFESSOR': return <FaChalkboardTeacher className="text-purple-500" size={18} />;
      case 'ALUMNI': return <FaGraduationCap className="text-green-500" size={18} />;
      default: return <FaUserCircle size={18} />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'STUDENT': return 'bg-blue-100 text-blue-800';
      case 'PROFESSOR': return 'bg-purple-100 text-purple-800';
      case 'ALUMNI': return 'bg-green-100 text-green-800';
      case 'PUBLIC': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Profile Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 flex flex-col items-center text-center md:flex-row md:text-left gap-8">
            {/* Profile Picture Section */}
            <div className="relative shrink-0">
              <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt="Profile"
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-profile.png';
                    }}
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-gray-300" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor()}`}>
                  {getRoleIcon()} <span className="ml-1 capitalize">{user.role.toLowerCase()}</span>
                </span>
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {user.firstName} {user.lastName || ''}
                </h1>
                <div className="flex items-center justify-center md:justify-start text-gray-600">
                  <MdEmail className="mr-2 text-gray-500 text-lg" />
                  <span className="text-base">{user.email}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all text-sm shadow-sm hover:shadow-md"
                >
                  <FaEdit className="mr-2" /> Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-all text-sm shadow-sm hover:shadow-md"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Education Card */}
          {(user.formation || user.graduationYear || user.degree) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MdSchool className="text-blue-600 text-2xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 ml-3">Education</h2>
                </div>
                <div className="space-y-4">
                  {user.formation && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</p>
                      <p className="text-gray-900 font-medium mt-1">{user.formation}</p>
                    </div>
                  )}
                  {user.degree && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</p>
                      <p className="text-gray-900 font-medium mt-1">{user.degree}</p>
                    </div>
                  )}
                  {user.graduationYear && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Graduation Year</p>
                      <p className="text-gray-900 font-medium mt-1">{user.graduationYear?.slice(0, 10)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Professional Info Card */}
          {(user.occupation || user.subject || user.rank) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <FaBriefcase className="text-purple-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 ml-3">
                    {user.role === 'PROFESSOR' ? 'Teaching' : 'Professional'} Info
                  </h2>
                </div>
                <div className="space-y-4">
                  {user.occupation && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</p>
                      <p className="text-gray-900 font-medium mt-1">{user.occupation}</p>
                    </div>
                  )}
                  {user.subject && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</p>
                      <p className="text-gray-900 font-medium mt-1">{user.subject}</p>
                    </div>
                  )}
                  {user.rank && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</p>
                      <p className="text-gray-900 font-medium mt-1">{user.rank}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Interests Card */}
          {user.interests && user.interests.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <MdInterests className="text-green-600 text-2xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 ml-3">Interests</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setSelectedTab('posts')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                selectedTab === 'posts' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaGraduationCap className="text-lg" /> 
              <span>My Posts</span>
            </button>
            <button
              onClick={() => setSelectedTab('saved')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                selectedTab === 'saved' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaBookmark className="text-lg" /> 
              <span>Saved Posts</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {selectedTab === 'posts' ? (
            <div className="space-y-6">
            {posts.length > 0 ? (
                posts
                  .filter(post => post.status === 'APPROVED')
                  .map(post => (
                    <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={session.user.id}
                    onDelete={handleDeletePost}
                    session= {session}
                    />
                  ))
              )  : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaGraduationCap className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Share your thoughts and ideas with the community</p>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {/* Add your create post handler here */}}
                >
                  Create your first post
                </button>
              </div>
            )}
          </div>
        ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaBookmark className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No saved posts</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                When you save posts, they'll appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal - Enhanced */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 relative">
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <FaTimes size={20} />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Profile Picture Upload */}
                  <div className="flex flex-col items-center">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3">
                      {user.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt="Profile Preview"
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-profile.png';
                          }}
                        />
                      ) : (
                        <FaUserCircle className="w-full h-full text-gray-300" />
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      id="profilePicture"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <FaEdit className="mr-1.5" /> Change Photo
                    </button>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* University Field */}
                  <div>
                    <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1.5">
                      University
                    </label>
                    <input
                      type="text"
                      id="university"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}