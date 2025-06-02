// components/ClientPostFormProfile.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './dialog';
import { Button } from './button';
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

export default function ClientPostFormProfile({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const logic = usePostFormLogic();

  const handleSubjectChange = (value: string) => {
    if (value === 'Other') {
      logic.setShowCustomSubject(true);
      logic.setSubject('');
    } else {
      logic.setShowCustomSubject(false);
      logic.setSubject(value);
      logic.setCustomSubject('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg space-y-4 bg-white">
        <DialogTitle className="text-lg font-semibold">
          {step === 1 ? 'Post Details' : step === 2 ? 'Extra Information' : 'Media Upload'}
        </DialogTitle>

        {step === 1 && (
          <>
            <input
              className="w-full border p-2 rounded"
              placeholder="Title"
              value={logic.title}
              onChange={(e) => logic.setTitle(e.target.value)}
            />
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Content"
              rows={4}
              value={logic.content}
              onChange={(e) => logic.setContent(e.target.value)}
            />
            
          </>
        )}

  {step === 2 && (
  <>
    <select
      value={logic.subject}
      onChange={(e) => handleSubjectChange(e.target.value)}
      className="w-full border p-2 rounded"
    >
      <option value="">Select a subject</option>
      {INTERESTS.map((interest) => (
        <option key={interest} value={interest}>{interest}</option>
      ))}
      <option value="Other">Other...</option>
    </select>

            
    {logic.showCustomSubject && (
      <input
        className="w-full border p-2 rounded"
        placeholder="Enter your subject"
        value={logic.customSubject}
        onChange={(e) => logic.setCustomSubject(e.target.value)}
      />
    )}
    <select
              value={logic.visibility}
              onChange={(e) => logic.setVisibility(e.target.value as Visibility)}
              className="w-full border p-2 rounded"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
    <select
              value={logic.type}
              onChange={(e) => logic.setType(e.target.value as PostType)}
              className="w-full border p-2 rounded"
            >
              {Object.values(PostType).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
    {(logic.type === 'EVENT' || logic.type === 'FORMATION') && (
      <>
        {logic.type === 'EVENT' && (
          <select
            value={logic.eventType}
            onChange={(e) => logic.setEventType(e.target.value as EventType)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select event type</option>
            {Object.values(EventType).map((et) => (
              <option key={et} value={et}>{et}</option>
            ))}
          </select>
        )}

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={logic.startDate}
          onChange={(e) => logic.setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={logic.endDate}
          onChange={(e) => logic.setEndDate(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Location"
          value={logic.location}
          onChange={(e) => logic.setLocation(e.target.value)}
        />
        {logic.type === 'FORMATION' && (
          <input
            type="number"
            placeholder="Speaker ID (optional)"
            className="w-full border p-2 rounded"
            value={logic.speakerId ?? ''}
            onChange={(e) => logic.setSpeakerId(Number(e.target.value))}
          />
        )}
      </>
    )}
  </>
)}


        {step === 3 && (
          <>
            <input
              type="file"
              className="w-full"
              ref={logic.fileInputRef}
              onChange={(e) => logic.setMedia(e.target.files?.[0] || null)}
            />
          </>
        )}

        <div className="flex justify-between">
          {step > 1 && <Button onClick={() => setStep((s) => s - 1)}>Back</Button>}
          {step < 3 && <Button onClick={() => setStep((s) => s + 1)}>Next</Button>}
          {step === 3 && (
            <Button
              onClick={() => {
                logic.handleSubmit();
                onOpenChange(false);
              }}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Submit
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
