import { useState, useRef } from 'react';
import { createPost } from '@/lib/post-action';
import { PostType, Visibility, EventType } from '@/lib/enums';

export function usePostFormLogic() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [type, setType] = useState<PostType>('GENERAL');
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');
  const [eventType, setEventType] = useState<EventType | ''>('');
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [speakerId, setSpeakerId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMedia(null);
    setMediaPreview(null);
    setType('GENERAL');
    setVisibility('PUBLIC');
    setEventType('');
    setSubject('');
    setCustomSubject('');
    setShowCustomSubject(false);
    setStartDate('');
    setEndDate('');
    setLocation('');
    setSpeakerId(null);
  };

  const handleSubmit = async () => {
    if ((!content.trim() && !media) || !title.trim()) return;

    const finalSubject = showCustomSubject ? customSubject : subject;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('visibility', visibility);
    formData.append('type', type);
    if (eventType) formData.append('eventType', eventType);
    if (finalSubject) formData.append('subject', finalSubject);
    if (startDate) formData.append('startDate', startDate);
    if (endDate) formData.append('endDate', endDate);
    if (location) formData.append('location', location);
    if (speakerId !== null) formData.append('speakerId', speakerId.toString());
    if (media) formData.append('media', media);

    await createPost(formData);
    resetForm();
  };

  return {
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
    endDate, setEndDate,
    location, setLocation,
    speakerId, setSpeakerId,
    fileInputRef,
    handleSubmit,
    resetForm
  };
}
