/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import {
  FaUserCircle,
  FaEdit,
  FaSignOutAlt,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUniversity,
  FaBookmark,
  FaTimes
} from 'react-icons/fa';
import { MdEmail, MdSchool } from 'react-icons/md';
import { IoIosMore } from 'react-icons/io';

import {
  getUserProfileAndPosts,
  UserProfile,
  updateProfile
} from '@/lib/profile-actions';

export default function ProfilePage() {
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
      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 flex flex-col items-center text-center md:flex-row md:text-left gap-6">
            {/* Profile Picture */}
            <div className="relative shrink-0">
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = '/default-profile.png';
                  }}
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-gray-300" />
              )}
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor()}`}>
                  {getRoleIcon()} <span className="ml-1 capitalize">{user.role.toLowerCase()}</span>
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName || ''}
                </h1>
                <div className="flex items-center justify-center md:justify-start text-gray-600 mt-2">
                  <MdEmail className="mr-2 text-gray-500" size={18} />
                  <span>{user.email}</span>
                </div>
              </div>

              {/* University/Education Info */}
              {(user.university || user.formation || user.degree || user.graduationYear) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto md:mx-0">
                  {user.university && (
                    <div className="flex items-center text-gray-700">
                      <FaUniversity className="mr-2 text-gray-500" size={16} />
                      <span className="text-sm">{user.university}</span>
                    </div>
                  )}
                  {user.formation && (
                    <div className="flex items-center text-gray-700">
                      <FaGraduationCap className="mr-2 text-gray-500" size={16} />
                      <span className="text-sm">{user.formation}</span>
                    </div>
                  )}
                  {user.degree && (
                    <div className="flex items-center text-gray-700">
                      <FaGraduationCap className="mr-2 text-gray-500" size={16} />
                      <span className="text-sm">{user.degree}</span>
                    </div>
                  )}
                  {user.graduationYear && (
                    <div className="flex items-center text-gray-700">
                      <FaGraduationCap className="mr-2 text-gray-500" size={16} />
                      <span className="text-sm">Graduated {user.graduationYear}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  <FaEdit className="mr-2" /> Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6 border-b border-gray-300 pt-6">
            <button
              onClick={() => setSelectedTab('posts')}
              className={`pb-2 border-b-2 text-sm font-semibold flex items-center gap-1 ${
                selectedTab === 'posts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <FaGraduationCap /> My Posts
            </button>
            <button
              onClick={() => setSelectedTab('saved')}
              className={`pb-2 border-b-2 text-sm font-semibold flex items-center gap-1 ${
                selectedTab === 'saved' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <FaBookmark /> Saved Posts
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {selectedTab === 'posts' ? (
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <p className="mt-1 text-gray-600">{post.description}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <IoIosMore size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
                  <p className="mt-2 text-gray-500">When you create posts, they'll appear here.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900">No saved posts</h3>
              <p className="mt-2 text-gray-500">When you save posts, they'll appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 relative">
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Profile Picture Upload */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      {user.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt="Profile Preview"
                          width={120}
                          height={120}
                          className="rounded-full object-cover border-4 border-white shadow-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/default-profile.png';
                          }}
                        />
                      ) : (
                        <FaUserCircle className="w-32 h-32 text-gray-300" />
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
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Change Profile Picture
                    </button>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* University Field */}
                  <div>
                    <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                      University
                    </label>
                    <input
                      type="text"
                      id="university"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center justify-center"
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