'use client';

import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { FaUserCircle, FaHeart, FaRegHeart, FaDownload } from 'react-icons/fa';
import { deletePost } from '@/lib/post-action';
import { createComment } from '@/lib/comment-action';
import { Session } from '@/lib/session';
import { format } from 'date-fns';

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
  mediaUrl?: string;
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

interface Props {
  post: Post;
  session: Session;
  isPending: boolean;
  saved: boolean;
  onToggleSave: (postId: number) => void;
  onDelete: (postId: number) => void;
}

export default function PostCard({
  post,
  session,
  isPending,
  saved,
  onToggleSave,
  onDelete
}: Props) {
  const [comment, setComment] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handlePostComment = async (id?: number) => {
    const text = comment.trim();
    if (!text) return;
    await createComment(post.id, text);
    setComment('');
  };

  const addEmoji = (emoji: any) => {
    setComment(prev => prev + (emoji.native || ''));
    setShowPicker(false);
  };

  
const downloadMedia = () => {
  if (!post.mediaUrl) return;
  const fileName = post.mediaUrl.split('/').pop();
  const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000'}/post/download/${fileName}`;
  
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = fileName!;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};




  const handleDeletePost = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        onDelete(id);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  return (
    <div className="relative mb-7 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Type Badge */}
      <span
        className={`absolute top-5 right-6 text-sm font-semibold px-3 py-1 rounded-full capitalize ${
          post.type === 'GENERAL'
            ? 'bg-green-100 text-green-600 border-green-600'
            : post.type === 'EVENT'
            ? 'bg-blue-100 text-blue-800 border-blue-800'
            : post.type === 'FORMATION'
            ? 'bg-purple-100 text-purple-800 border-purple-800'
            : post.type === 'COURSE_MATERIAL'
            ? 'bg-orange-100 text-orange-800 border-orange-800'
            : post.type === 'REVISION_EXERCISE'
            ? 'bg-pink-100 text-pink-800 border-pink-800'
            : 'bg-gray-100 text-gray-600'
        } border-2`}
      >
        {post.type?.replaceAll('_', ' ').toLowerCase().replace(/(^\w|\s\w)/g, c => c.toUpperCase()) || 'Unknown'}
      </span>

      <div className="p-6 space-y-4">
        {/* Author */}
        <div className="flex items-center space-x-3">
          {post.author.profilePicture ? (
            <Image
              src={post.author.profilePicture}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-customBlue text-2xl" />
          )}
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {post.author.firstName} {post.author.lastName}
            </p>
              <p className="text-sm text-gray-500">
                {format(new Date(post.createdAt), 'dd/MM/yyyy HH:mm:ss')}
              </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {post.title && <h2 className="text-md font-semibold text-gray-800">{post.title}</h2>}
          <p className="text-gray-700">{post.content}</p>
          <div className="text-sm text-gray-500 space-y-1">
            {post.eventType && <p><strong>Event Type:</strong> {post.eventType}</p>}
            {post.subject && <p><strong>Subject:</strong> {post.subject}</p>}
            {post.startDate && <p><strong>Start Date:</strong> {new Date(post.startDate).toLocaleDateString()}</p>}
            {post.endDate && <p><strong>End Date:</strong> {new Date(post.endDate).toLocaleDateString()}</p>}
            {post.location && <p><strong>Location:</strong> {post.location}</p>}
            {post.speakerId && <p><strong>Speaker ID:</strong> {post.speakerId}</p>}
          </div>
        </div>

        {/* Media */}
        {post.mediaUrl && (
          <div className="mt-3 rounded-lg overflow-hidden">
            {post.mediaUrl.endsWith('.pdf') ? (
              <a
                href={`${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000'}${post.mediaUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-fit text-blue-600 underline hover:text-blue-800"
              >
                📄 View PDF Document
              </a>
            ) : post.mediaUrl.endsWith('.mp4') ? (
              <video controls className="w-full rounded-lg border border-gray-200">
                <source src={`${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000'}${post.mediaUrl}`} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000'}${post.mediaUrl}`}
                alt="Post media"
                layout="intrinsic"
                width={0}
                height={0}
                sizes="100vw"
                className="h-auto w-full object-contain"
                unoptimized
              />
            )}
          </div>
        )}

        {/* Comment Input */}
        <div className="mt-7 flex items-baseline justify-between text-gray-600 bg-white rounded-full px-4 py-2 border-1 border-gray-200 shadow-md">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPicker(!showPicker)} className="text-xl">😊</button>
            {showPicker && (
              <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 shadow-lg" ref={pickerRef}>
                <Picker data={data} onEmojiSelect={addEmoji} />
              </div>
            )}
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePostComment()}
              placeholder="Leave a comment..."
              className="outline-none bg-transparent flex-1"
            />
          </div>
          <button onClick={() => handlePostComment(post.id)} className=" bg-blue-950 hover:bg-blue-900 rounded-full text-white py-2 px-3 text-xl">➤</button> 
        </div>

        {/* Comments */}
        {post.comments?.length > 0 && (
          <div className="space-y-3 pt-3">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex space-x-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="text-xs text-customBlue font-medium">
                    {comment.author.firstName.charAt(0)}{comment.author.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{comment.author.firstName} {comment.author.lastName}</p>
                  <p className="text-sm text-gray-600">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save / Delete */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-4 items-center">
            <button onClick={() => onToggleSave(post.id)} title={saved ? 'Unsave' : 'Save'}>
              {saved ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
            {post.mediaUrl && (
              <button onClick={downloadMedia} title="Download Media">
                <FaDownload className="text-gray-800 hover:text-black" />
              </button>
            )}
          </div>
           {(session?.user.role === 'ADMIN' || session?.user.id === post.author.id) && (
                    <div className="pt-2 border-t border-gray-100 text-right">
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={isPending}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPending ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </>
                        ) : 'Delete Post'}
                      </button>
                    </div>
                  )}
        </div>
      </div>
    </div>
  );
}
