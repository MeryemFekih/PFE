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
  ChevronLeft,
  ChevronRight,
  Edit,
} from 'lucide-react';

export default function Chat() {
  const chatRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingTitleId, setEditingTitleId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

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
        const latestConv = convs[0];
        setConversationId(latestConv.id);
        const msgs = await getMessagesByConversationId(
          latestConv.id,
          sess.accessToken
        );
        setMessages(Array.isArray(msgs) ? msgs : []);
      }
    })();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const startNewChat = async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    const newConv = await createConversation(session.accessToken);
    setConversationId(newConv.id);
    setMessages([
      { role: 'assistant', content: 'Hello! How can I help you today? 😊' },
    ]);
    setConversations((prev) => [newConv, ...prev]);
    setIsLoading(false);
    scrollToBottom();
  };

  const handleSendMessage = async () => {
    const question = input.trim();
    if (!question || isLoading || !conversationId || !session?.accessToken)
      return;

    setInput('');
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: 'user', content: question }]);

    await sendUserMessage(conversationId, question, session.accessToken);

    const aiReply = await fetchAIResponse([
      ...messages,
      { role: 'user', content: question },
    ]);

    await saveAssistantMessage(conversationId, aiReply, session.accessToken);

    const updatedMessages = await getMessagesByConversationId(
      conversationId,
      session.accessToken
    );
    setMessages(Array.isArray(updatedMessages) ? updatedMessages : []);

    const updatedConversations = await getConversations(session.accessToken);
    setConversations(updatedConversations);

    setIsLoading(false);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  };

  const loadConversation = async (id: number) => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    setConversationId(id);
    const msgs = await getMessagesByConversationId(id, session.accessToken);
    setMessages(Array.isArray(msgs) ? msgs : []);
    setIsLoading(false);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const deleteConversationApi = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session?.accessToken) return;
    try {
      await deleteConversation(id, session.accessToken);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
        if (conversations.length > 1) {
          loadConversation(conversations[0].id);
        } else {
          startNewChat();
        }
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  return (
    // Added md:ml-64 to push content to the right on desktop for the main app sidebar
    <div className="flex h-screen bg-gray-50 font-sans antialiased text-gray-800 ">
      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col bg-gray-100 transition-all duration-300 ease-in-out
                   ${isSidebarOpen ? 'md:mr-72' : 'md:mr-0'} `}
      >
        {/* AppBar/Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-20">
          {/* Mobile sidebar toggle button (to open sidebar from right) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Show sidebar"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Bot size={24} className="text-blue-500" /> AI Assistant
          </h1>
          {/* Desktop sidebar toggle button (to hide/show sidebar, pushing content) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:block text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition"
            aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {isSidebarOpen ? <ChevronRight size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Chat Messages Container */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar"
        >
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-4">
              <MessageSquare size={56} className="mb-4 text-blue-300" />
              <p className="text-xl font-medium mb-2">
                Start a New Conversation
              </p>
              <p className="text-md mb-6 max-w-sm">
                Ask me anything! I'm here to help you.
              </p>
              <button
                onClick={startNewChat}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-200 ease-in-out flex items-center gap-2 text-lg"
              >
                <Plus size={20} /> New Chat
              </button>
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
                className={`flex items-start gap-3 p-4 rounded-2xl max-w-[90%] md:max-w-[70%] shadow-md transition-all duration-200 ease-in-out ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                }`}
              >
                <div
                  className={`p-2 rounded-full flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-700' : 'bg-gray-100'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User size={18} className="text-white" />
                  ) : (
                    <Bot size={18} className="text-blue-700" />
                  )}
                </div>
                <p className="whitespace-pre-wrap text-base leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-2 rounded-full bg-gray-100">
                  <Bot size={18} className="text-blue-700" />
                </div>
                <Loader2 size={20} className="animate-spin text-blue-600" />
                <span className="text-gray-600 italic">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <footer className="bg-white border-t border-gray-200 p-4 md:p-6 shadow-lg">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-5 py-3.5 rounded-xl bg-gray-50 text-gray-900 border border-gray-300
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 ease-in-out text-base"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 p-3.5 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors
                         duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center min-w-[50px]"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </footer>
      </div>

      {/* Conversations Sidebar (now on the right) */}
      <aside
        className={`fixed inset-y-0 right-0 w-72 bg-white border-l border-gray-200 shadow-xl
                   transform transition-transform duration-300 ease-in-out z-30 flex flex-col
                   ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                   `}
      >
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
            Conversations
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
            aria-label="Close sidebar"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <button
            onClick={startNewChat}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 mb-4
                       hover:bg-blue-700 transition-colors duration-200 ease-in-out shadow-md"
          >
            <Plus size={20} />
            New Chat
          </button>

          <div className="flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
            {conversations.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                <p className="text-sm">No conversations yet.</p>
                <p className="text-xs mt-1">Start a new one above!</p>
              </div>
            )}
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`group relative cursor-pointer flex items-center justify-between px-3 py-2.5 rounded-lg mb-1
                            transition-all duration-150 ease-in-out ${
                              conversationId === conv.id
                                ? 'bg-blue-100 text-blue-800 font-semibold shadow-sm'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
              >
                <div className="flex items-center gap-2 truncate flex-grow">
                  <MessageSquare
                    size={16}
                    className={`${
                      conversationId === conv.id ? 'text-blue-600' : 'text-gray-500'
                    } shrink-0`}
                  />
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
                      className="text-sm px-1 py-0.5 rounded border border-blue-300 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400 w-full"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => {
                        setEditingTitleId(conv.id);
                        setEditedTitle(getConversationTitle(conv.id));
                      }}
                      className="truncate text-sm"
                      title="Double-click to rename"
                    >
                      {getConversationTitle(conv.id)}
                    </span>
                  )}
                </div>
                {editingTitleId !== conv.id && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTitleId(conv.id);
                        setEditedTitle(getConversationTitle(conv.id));
                      }}
                      className="p-1 rounded-full text-gray-400 hover:text-blue-600 hover:bg-gray-200 transition-colors"
                      title="Rename"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={(e) => deleteConversationApi(conv.id, e)}
                      className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}