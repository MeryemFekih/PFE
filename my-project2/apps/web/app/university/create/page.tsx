'use client';

import { useState } from 'react';
import { createPost } from '@/lib/post-action';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (media) formData.append('media', media);

    await createPost(formData);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">📢 Create New Post</h1>
      <input
        type="text"
        placeholder="Title"
        className="w-full mb-2 border px-3 py-2 rounded"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Write something..."
        className="w-full mb-2 border px-3 py-2 rounded"
        rows={5}
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <input
        type="file"
        accept="image/*,video/*"
        className="mb-4"
        onChange={e => setMedia(e.target.files?.[0] || null)}
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
