import { Message, listenToMessages, sendMessage, markMessagesAsRead } from "@/lib/firebase-chat";
import { useEffect, useRef, useState, useMemo } from "react";
import { FaPaperclip, FaArrowLeft, FaFilter, FaCheck, FaRegCircle, FaEnvelope } from "react-icons/fa";

interface ChatBoxProps {
  convoId: string;
  currentUserId: number;
  user?: {
    id: number;
    firstName: string;
    
  };
  fullScreen?: boolean;
  onBack?: () => void;
  onMarkAsRead?: (convoId: string) => void;
  onClose?: () => void;    
}

type MessageFilter = 'all' | 'unread' | 'read';

export function ChatBox({
  convoId,
  currentUserId,
  user,
  fullScreen = false,
  onBack,
  onMarkAsRead
}: ChatBoxProps) {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<MessageFilter>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const filteredMsgs = useMemo(() => {
  switch (filter) {
    case 'unread':
      return msgs.filter(msg => 
        msg.recipientId === currentUserId && !msg.read
      );
    case 'read':
      return msgs.filter(msg => 
        (msg.recipientId === currentUserId && msg.read) || 
        msg.senderId === currentUserId
      );
    default:
      return msgs;
  }
}, [msgs, filter, currentUserId]);

  const messageCounts = useMemo(() => ({
    all: msgs.length,
    unread: msgs.filter(msg => msg.recipientId === currentUserId && !msg.read).length,
    read: msgs.filter(msg => (msg.recipientId === currentUserId && msg.read) || msg.senderId === currentUserId).length
  }), [msgs, currentUserId]);

  useEffect(() => {
  if (!convoId) return;
  
  const unsubscribe = listenToMessages(convoId, (messages) => {
    console.log('Received messages:', messages); // Add this for debugging
    setMsgs(messages);
    
    // Mark messages as read if there are unread ones
    const hasUnread = messages.some(msg => 
      !msg.read && msg.recipientId === currentUserId
    );
    
    if (hasUnread) {
      markMessagesAsRead(convoId, currentUserId).then(count => {
        console.log(`Marked ${count} messages as read`);
        if (count > 0 && onMarkAsRead) onMarkAsRead(convoId);
      });
    }
  });

  return () => unsubscribe();
}, [convoId, currentUserId, onMarkAsRead]);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [filteredMsgs]);

  const handleSend = async () => {
    if (!text.trim() || !user || isSending) return;
    setIsSending(true);
    try {
      await sendMessage(convoId, currentUserId, user.id, {
        type: 'text',
        content: text
      });
      setText('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFile = async () => {
    const file = fileRef.current?.files?.[0];
    if (file && user) {
      setIsSending(true);
      try {
        await sendMessage(convoId, currentUserId, user.id, {
          type: 'file',
          content: file,
          fileName: file.name,
          mimeType: file.type
        });
        fileRef.current!.value = '';
      } catch (error) {
        console.error('Error sending file:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const formatTimestamp = (msg: Message) => {
    const ts = msg.timestamp?.toDate?.() || msg.createdAt?.toDate?.();
    return ts
      ? ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      : 'Sending...';
  };

  return (
    <div className={`${fullScreen ? 'h-full flex flex-col ' : 'border rounded-xl bg-white shadow-sm'}`}>
      

      <div ref={messagesContainerRef} className={`flex-1 overflow-y-auto p-4 ${fullScreen ? 'h-[calc(100%-128px)]' : 'max-h-80'}`}>
        {filteredMsgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <FaEnvelope className="text-4xl mb-3 opacity-30" />
            <p className="text-center">
              {filter === 'all' 
                ? user 
                  ? `Start a conversation with ${user.firstName}` 
                  : 'No messages yet'
                : filter === 'unread'
                  ? 'No unread messages'
                  : 'No read messages'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMsgs.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                  msg.senderId === currentUserId 
                    ? 'bg-blue-700 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.type === 'text' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <a
                      href={msg.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline"
                    >
                      <FaPaperclip className="mr-2" />
                      {msg.fileName}
                    </a>
                  )}
                  <div className="text-xs mt-1 opacity-70 text-right">
                    {formatTimestamp(msg)}
                    {msg.senderId === currentUserId && msg.read && (
                      <span className="ml-1 text-blue-300">✓✓</span>
                    )}
                    {!msg.read && msg.recipientId === currentUserId && (
                      <span className="ml-1 text-red-300 animate-pulse">NEW</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className=" p-3 bg-gray-50">
        <div className="flex items-center ">
          <div  className="flex border w-full border-gray-300 shadow-lg rounded-full">
            <input type="file" ref={fileRef} className="hidden" onChange={handleFile} disabled={isSending} />
              <button
                onClick={() => fileRef.current?.click()}
                className="text-gray-600 py-2 pl-2 pr-1 mr-1.5 border-r border-gray-200 hover:bg-gray-200 hover:rounded-l-full transition-colors disabled:opacity-50"
                disabled={isSending}
              >
                <FaPaperclip />
              </button>
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${user?.firstName || ''}`}
                className="flex-1  py-2"
                disabled={isSending}
              />
          </div>
          <button
            onClick={handleSend}
            disabled={!text.trim() || isSending}
              className="ml-2 bg-blue-700 hover:bg-blue-900 rounded-full text-white py-1 px-2 text-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"   >
            {isSending ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
            ) : (
            <span>➤</span>

            )}
          </button>
          
        </div>
      </div>
    </div>
  );
}
