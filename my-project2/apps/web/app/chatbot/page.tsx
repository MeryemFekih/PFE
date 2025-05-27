/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  fetchAIResponse,
  createConversation,
  sendUserMessage,
  saveAssistantMessage,
  getConversations,
  getMessagesByConversationId,
  deleteConversation,
} from '@/lib/chatBot-action';
import { getSession } from '@/lib/session';
import { useEffect, useRef, useState } from 'react';
import {
  Plus,
  Send,
  MessageSquare,
  User,
  Bot,
  Loader2,
  Trash2,
  Menu,
  Pencil,
} from 'lucide-react';

export default function Chat() {
  const chatRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [editingTitleId, setEditingTitleId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  // LocalStorage helpers
  const getConversationTitle = (id: number) => {
    if (typeof window === 'undefined') return `Chat #${id}`;
    return localStorage.getItem(`chat-title-${id}`) || `Chat #${id}`;
  };

  const setConversationTitle = (id: number, title: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`chat-title-${id}`, title);
    }
  };

  useEffect(() => {
    (async () => {
      const sess = await getSession();
      if (!sess?.accessToken) return;
      setSession(sess);
      const convs = await getConversations(sess.accessToken);
      setConversations(convs);
      if (convs.length) {
        setConversationId(convs[0].id);
        const msgs = await getMessagesByConversationId(convs[0].id, sess.accessToken);
        setMessages(msgs);
      }
    })();
  }, []);

  const startNewChat = async () => {
    if (!session?.accessToken) return;
    const newConv = await createConversation(session.accessToken);
    setConversationId(newConv.id);
    setMessages([
      { role: 'assistant', content: 'Hello! How can I help you today? 😊' },
    ]);
    setConversations((prev) => [newConv, ...prev]);
  };

  const handleSendMessage = async () => {
    const question = input.trim();
    if (!question || isLoading || !conversationId || !session?.accessToken) return;

    const newUserMsg = { role: 'user', content: question };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    await sendUserMessage(conversationId, question, session.accessToken);
    const aiReply = await fetchAIResponse([...messages, newUserMsg]);
    await saveAssistantMessage(conversationId, aiReply, session.accessToken);

    setMessages((prev) => [...prev, { role: 'assistant', content: aiReply }]);
    setIsLoading(false);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const loadConversation = async (id: number) => {
    if (!session?.accessToken) return;
    const msgs = await getMessagesByConversationId(id, session.accessToken);
    setConversationId(id);
    setMessages(msgs);
  };

  const deleteConversationApi = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation(id, session.accessToken);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  return (
    <div className="flex h-screen bg-[#f9fafb] text-sm text-gray-800 relative">
      {/* Show Sidebar Button when hidden */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="absolute top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          title="Show sidebar"
        >
          <Menu size={18} />
        </button>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <aside className="w-72 bg-white border-r shadow-sm p-4 flex flex-col transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700">Conversations</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={startNewChat}
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center gap-1 text-xs"
              >
                <Plus size={16} />
                New
              </button>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-500 hover:text-red-600"
                title="Hide sidebar"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto space-y-1 flex-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`group cursor-pointer flex justify-between items-center px-3 py-2 rounded-lg ${
                  conversationId === conv.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate w-full">
                  <MessageSquare size={16} className="text-gray-500 shrink-0" />
                  {editingTitleId === conv.id ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onBlur={() => {
                        setConversationTitle(conv.id, editedTitle);
                        setEditingTitleId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setConversationTitle(conv.id, editedTitle);
                          setEditingTitleId(null);
                        }
                      }}
                      autoFocus
                      className="text-sm px-2 py-1 rounded border bg-white text-black border-gray-300 focus:outline-none w-full"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => {
                        setEditingTitleId(conv.id);
                        setEditedTitle(getConversationTitle(conv.id));
                      }}
                      className="truncate cursor-pointer hover:underline w-full"
                      title="Double-click to rename"
                    >
                      {getConversationTitle(conv.id)}
                    </span>
                  )}
                </div>
                <Trash2
                  size={14}
                  onClick={(e) => deleteConversationApi(conv.id, e)}
                  className="text-gray-400 hover:text-red-500 hidden group-hover:block shrink-0"
                />
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* Chat Panel */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          showSidebar ? '' : 'ml-0'
        }`}
      >
        <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 text-center">
          <h1 className="text-base font-semibold flex items-center justify-center gap-2">
            <Bot size={18} /> AI Assistant
          </h1>
        </header>

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-6 bg-white space-y-6"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageSquare size={40} className="mb-3" />
              <p>Start a new conversation above</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start gap-3 px-4 py-3 rounded-xl max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200'
                }`}
              >
                <div
                  className={`p-1.5 rounded-full ${
                    msg.role === 'user' ? 'bg-blue-700' : 'bg-blue-100'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-blue-600" />
                  )}
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl border border-gray-200">
                <div className="p-1.5 rounded-full bg-blue-100">
                  <Bot size={16} className="text-blue-600" />
                </div>
                <Loader2 size={16} className="animate-spin text-blue-500" />
              </div>
            </div>
          )}
        </div>

        <footer className="bg-white border-t p-4">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-md bg-white text-black border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
