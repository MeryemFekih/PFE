// components/ClientPostFormFeed.tsx
'use client';

import { useState, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import { FiImage, FiVideo, FiPaperclip, FiX, FiHash, FiAtSign, FiChevronDown, FiCheck } from 'react-icons/fi';
import Image from 'next/image';
import { usePostFormLogic } from '@/hooks/usePostFormLogic';
import { PostType, EventType, Visibility } from '@/lib/enums';

const INTERESTS = [
  'Artificial Intelligence',
  'Web Development',
  'Data Science',
  'Cybersecurity',
  'Blockchain',
  'Cloud Computing',
  'Machine Learning',
  'Mobile Dev',
  'UX/UI Design'
];

export default function ClientPostFormFeed({ user }: { user: { profilePicture?: string } }) {
  const {
    title, setTitle,
    content, setContent,
    media, setMedia,
    mediaPreview, setMediaPreview,
    type, setType,
    visibility, setVisibility,
    eventType, setEventType,
    subject, setSubject,
    customSubject, setCustomSubject,
    showCustomSubject, setShowCustomSubject,
    startDate, setStartDate,
    location, setLocation,
    speakerId, setSpeakerId,
    fileInputRef,
    handleSubmit,
    resetForm
  } = usePostFormLogic();

  const [hasFile, setHasFile] = useState(false);
  const uploadButtonRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setMedia(null);
      setMediaPreview(null);
      setHasFile(false);
      return;
    }
    
    setMedia(file);
    setHasFile(true);
    const fileType = file.type.split('/')[0];
    
    if (fileType === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else if (fileType === 'video') {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    } else {
      setMediaPreview(null);
    }
  };

  const handleSubjectChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomSubject(true);
      setSubject('');
    } else {
      setShowCustomSubject(false);
      setSubject(value);
      setCustomSubject('');
    }
  };

  const triggerFileInput = (accept: string) => {
    if (uploadButtonRef.current) {
      uploadButtonRef.current.accept = accept;
      uploadButtonRef.current.click();
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <div className="flex space-x-3">
        {user.profilePicture ? (
          <Image
            src={user.profilePicture}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <FaUser className="text-gray-500" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2 gap-3">
            <input
              className="w-full font-semibold text-lg py-1 px-3 shadow-md rounded-xl"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as Visibility)}
              className="bg-gray-100 text-sm text-gray-700 rounded-xl px-2 py-1.5 hover:bg-gray-200"
            >
              <option value="PUBLIC">🌍 Public</option>
              <option value="PRIVATE">🔒 Private</option>
            </select>
          </div>
          <textarea
            className="w-full mt-1 text-gray-700 shadow-md rounded-xl p-2"
            placeholder="What's on your mind?"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          {mediaPreview && (
            <div className="relative mt-3 h-64">
              {media?.type.startsWith('image') ? (
                <Image 
                  src={mediaPreview} 
                  alt="Media" 
                  fill 
                  className="rounded-md object-cover"
                />
              ) : (
                <video src={mediaPreview} controls className="w-full h-full rounded-md" />
              )}
              <button
                onClick={() => handleFileChange(null)}
                className="absolute top-2 right-2 bg-black text-white p-1 rounded-full"
              >
                <FiX size={16} />
              </button>
            </div>
          )}

          {(type === 'EVENT' || type === 'FORMATION') && (
            <div className="mt-3 bg-white rounded-lg space-y-2">
              <div className="flex justify-between items-center gap-2">
                {type === 'EVENT' && (
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full text-sm py-2 px-2 shadow-sm rounded-xl border-gray-200 border"
                  >
                    <option value="">Select event type</option>
                    {Object.values(EventType).map((val) => (
                      <option key={val} value={val}>{val.replace('_', ' ')}</option>
                    ))}
                  </select>
                )}
                
                <select
                  value={subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full text-sm py-2 px-2 shadow-sm rounded-xl border border-gray-200"
                >
                  <option value="">Select a subject</option>
                  {INTERESTS.map((interest) => (
                    <option key={interest} value={interest}>{interest}</option>
                  ))}
                  <option value="Other">Other...</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
              
              {showCustomSubject && (
                <input
                  type="text"
                  placeholder="Enter your subject"
                  className="w-full text-sm py-2 px-2 shadow-sm rounded-xl border border-gray-200"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                />
              )}
              
              <div className="flex flex-col justify-baseline sm:flex-row gap-2">
                <label className='text-gray-600 text-sm mt-1' >Select Date</label>
                <input
                  type="date"
                  className="flex-1 w-full text-sm py-1 px-2 shadow-sm rounded-xl border border-gray-200"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                
              </div>
              
              <input
                type="text"
                placeholder="Location"
                className="w-full text-sm py-1 px-2 shadow-md rounded-xl border border-gray-200"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              
              {type === 'FORMATION' && (
                <input
                  type="number"
                  placeholder="Speaker ID (optional)"
                  className="w-full text-sm py-1 px-2 shadow-md rounded-xl border border-gray-200"
                  value={speakerId ?? ''}
                  onChange={(e) => setSpeakerId(Number(e.target.value))}
                />
              )}
            </div>
          )}

          <div className="flex  flex-col sm:flex-row gap-2 justify-between items-center mt-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
              {!hasFile ? (
                <>
                  <button 
                    onClick={() => triggerFileInput('image/*')} 
                    className="text-gray-500 hover:text-blue-700"
                  >
                    <FiImage />
                  </button>
                  <button 
                    onClick={() => triggerFileInput('video/*')} 
                    className="text-gray-500 hover:text-blue-700"
                  >
                    <FiVideo />
                  </button>
                  <button 
                    onClick={() => triggerFileInput('.pdf')} 
                    className="text-gray-500 hover:text-blue-700"
                  >
                    <FiPaperclip />
                  </button>
                </>
              ) : (
                <div className="text-green-500 flex items-center">
                  <FiCheck className="mr-1" />
                  <span className="text-xs">File attached</span>
                </div>
              )}
            
              <input
                type="file"
                ref={uploadButtonRef}
                className="hidden"
                accept="image/*,video/*,.pdf"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PostType)}
                className="bg-gray-100 text-gray-700 rounded-xl px-2 py-1.5 hover:bg-gray-200"
              >
                {Object.values(PostType).map((val) => (
                  <option key={val} value={val}>{val.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            </div>
            
            <button
              disabled={!title.trim() && !content.trim()}
              onClick={handleSubmit}
                        className="bg-blue-900 hover:bg-gray-100 hover:border-2 hover:border-blue-900 hover:text-blue-900 text-white px-3 h-10 rounded-lg font-semibold  flex items-center justify-center disabled:bg-gray-300"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}