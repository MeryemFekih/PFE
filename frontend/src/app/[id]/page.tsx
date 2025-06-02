'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getOrCreateConversation, sendMessage, listenToMessages } from '@/lib/firebase-chat';
import { Session } from '@/lib/session';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const convoId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [session, setSession] = useState<Session|null>(null);
  const [msgs, setMsgs] = useState<any[]>([]);
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadSession() {
      const res = await fetch('/api/session');
      if (res.ok) setSession(await res.json());
    }
    loadSession();
  }, []);

  useEffect(() => {
    if (!convoId) return;
    const unsubscribe = listenToMessages(convoId, setMsgs);
    return unsubscribe;
  }, [convoId]);

  const handleSend = async () => {
    if (!session || !convoId || typeof convoId !== 'string') return;
    await sendMessage(convoId, session.user.id, { type: 'text', content: text });
    setText('');
  };

  const handleFile = async () => {
  const handleFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (file && session && convoId && typeof convoId === 'string') {
      await sendMessage(convoId, session.user.id, {
        type: 'file',
        content: file,
        fileName: file.name,
        mimeType: file.type
      });
    }
  };
  if (!session) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <button onClick={() => router.back()}>Back</button>
      <div className="h-[60vh] overflow-y-auto mb-4 space-y-2">
        {msgs.map(m => (
          <div key={m.id} className={`p-2 ${m.senderId === session.user.id ? 'text-right' : 'text-left'}`}>
            {m.type === 'text' && <p>{m.content}</p>}
            {m.type === 'file' && (
              <a href={m.content} download={m.fileName} className="text-blue-600">Download {m.fileName}</a>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input className="flex-1 border p-2" value={text} onChange={e => setText(e.target.value)} />
        <button onClick={handleSend} className="px-4 bg-blue-600 text-white">Send</button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} />
        <button onClick={() => fileInputRef.current?.click()} className="px-4 bg-gray-200">Upload</button>
      </div>
    </div>
  );
}}
