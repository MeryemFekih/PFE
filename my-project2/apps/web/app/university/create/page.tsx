'use client';

import { useState, useRef } from 'react';
import { createPost } from '@/lib/post-action';
import Image from 'next/image';
import { FiX, FiSmile } from 'react-icons/fi';

export default function EnhancedCreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setMedia(null);
      setMediaPreview(null);
      return;
    }
    setMedia(file);
    const type = file.type.split('/')[0];
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else if (type === 'video') {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    } else {
      setMediaPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() && !content.trim() && !media) return;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (media) formData.append('media', media);

    await createPost(formData);
    setTitle('');
    setContent('');
    setMedia(null);
    setMediaPreview(null);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">📸 Create New Post</h1>

      <input
        type="text"
        placeholder="Title"
        className="w-full mb-2 border px-3 py-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="What's on your mind?"
        className="w-full mb-2 border px-3 py-2 rounded"
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="button"
        onClick={() => alert('Feeling picker coming soon!')}
        className="text-sm flex items-center gap-1 border px-2 py-1 mb-4 rounded"
      >
        <FiSmile /> Feeling
      </button>

      {mediaPreview && (
        <div className="relative mb-4">
          {media?.type.startsWith('image') ? (
            <Image
              src={mediaPreview}
              alt="Preview"
              width={600}
              height={400}
              className="rounded border"
            />
          ) : (
            <video src={mediaPreview} controls className="rounded w-full max-h-[400px]" />
          )}
          <button
            className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
            onClick={() => handleFileChange(null)}
          >
            <FiX />
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Post
      </button>
    </div>
  );
}
