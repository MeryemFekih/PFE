'use client';

import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { FaUserCircle, FaHeart, FaRegHeart, FaDownload } from 'react-icons/fa';
import { deletePost,getPostParticipants,participateInPost, requestParticipantRemoval  } from '@/lib/post-action';
import { createComment } from '@/lib/comment-action';
import { Session } from '@/lib/session';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
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
  participantsCount?: number;
  participantLimit?: number;
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
const [showParticipants, setShowParticipants] = useState(false);
const [participants, setParticipants] = useState<any[]>([]);

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
  
  toast.success('Download started!', {
    icon: '📥',
    duration: 4000
  });
};


  const handleDeletePost = async (id: number) => {
  if (window.confirm('Are you sure you want to delete this post?')) {
    try {
      await deletePost(id);
      onDelete(id);
      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    }
  }
};
const handleToggleSave = (postId: number) => {
  onToggleSave(postId);
  toast.success(saved ? 'Post removed from saved' : 'Post saved!');
};
const handleParticipate = async (postId: number) => {
  try {
    await participateInPost(postId);
    toast.success('Participation confirmed!');
  } catch (err: any) {
    toast.error(err.message || 'Could not participate');
  }
};
const handleViewParticipants = async () => {
  try {
    const list = await getPostParticipants(post.id, session.accessToken);
    setParticipants(list);
    setShowParticipants(true);
  } catch (err) {
    toast.error('Could not load participants');
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
              className="block border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">PDF Document</h3>
                  <p className="text-sm text-gray-500">Click to view the PDF file</p>
                </div>
                <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
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
        {/* Replace the existing save/delete section with this */}
<div className="flex justify-between items-center pt-4">
  <div className="flex gap-4 items-center">
    {/* Save Button */}
    <button 
      onClick={() => handleToggleSave(post.id)} 
      title={saved ? 'Unsave' : 'Save'}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      {saved ? (
        <FaHeart className="text-red-500 text-lg" />
      ) : (
        <FaRegHeart className="text-lg" />
      )}
    </button>

    {/* Download Button */}
    {post.mediaUrl && (
      <button 
        onClick={downloadMedia} 
        title="Download Media"
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <FaDownload className="text-lg" />
      </button>
    )}

    {/* Participate Button - Only shows if event is in future */}
    {(post.type === 'EVENT' || post.type === 'FORMATION') && 
      new Date(post.startDate || '') > new Date() && (
      <button
        onClick={() => handleParticipate(post.id)}
        disabled={(post.participantsCount ?? 0) >= (post.participantLimit || Infinity)}
        title={
          (post.participantsCount ?? 0) >= (post.participantLimit || Infinity)
            ? 'Event is full'
            : 'Participate'
        }
        className={`p-2 rounded-full transition-colors ${
          (post.participantsCount ?? 0) >= (post.participantLimit || Infinity)
            ? 'text-gray-400 cursor-not-allowed'
            : 'hover:bg-blue-50 text-blue-600'
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
          />
        </svg>
      </button>
    )}

    {/* View Participants Button - Only for post author */}
    {(post.type === 'EVENT' || post.type === 'FORMATION') && 
      session?.user.id === post.author.id && (
      <button
        onClick={handleViewParticipants}
        title="View participants"
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
          />
        </svg>
      </button>
    )}
  </div>

  {/* Delete Button (remains the same) */}
  {(session?.user.role === 'ADMIN' || session?.user.id === post.author.id) && (
    <div className="border-gray-100 text-right">
      <button
        onClick={() => handleDeletePost(post.id)}
        disabled={isPending}
        className="inline-flex items-center px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-0.5 hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Deleting...
          </>
        ) : (
          <>
            <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
            Delete
          </>
        )}
      </button>
    </div>
  )}
</div>
      </div>
   {showParticipants && (
  <div className="fixed inset-0  bg-black/70 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-lg relative max-h-[90vh] overflow-y-auto">
      <button
        onClick={() => setShowParticipants(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Participants</h3>

      {participants.length === 0 ? (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="mt-2 text-gray-500">No participants yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                        {p.user?.firstName?.charAt(0) || p.name?.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {p.user?.firstName} {p.user?.lastName || p.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.user?.email || p.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.user?.identification || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!p.removalRequested ? (
                      <button
                        onClick={async () => {
                          const reason = prompt('Enter reason for removal request:');
                          if (!reason) return;
                          try {
                            await requestParticipantRemoval(p.id, reason);
                            toast.success('Removal request sent');
                            setParticipants(prev =>
                              prev.map(x =>
                                x.id === p.id ? { ...x, removalRequested: true } : x
                              )
                            );
                          } catch (err) {
                            toast.error('Failed to request removal');
                          }
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors px-3 py-1 border border-red-200 rounded-md hover:bg-red-50"
                      >
                        Request Removal
                      </button>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Removal Requested
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
}
