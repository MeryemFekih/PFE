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
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/app/components/ui/tooltip';
import { Skeleton } from '@/app/components/ui/skeleton';

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
  const [isHydrating, setIsHydrating] = useState(true);

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
      setIsHydrating(false);
    })();

    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-50 font-sans antialiased text-gray-800 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Conversations Sidebar */}
      <motion.aside
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-200 shadow-xl z-30 flex flex-col
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                   md:relative md:translate-x-0`}
      >
          <div className="p-4  border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
              <MessageSquare className="text-blue-900" />
              Conversations
              
            </h2>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
              aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>
          </div>

          <div className="p-4 flex-grow flex flex-col">
            <Button
              onClick={startNewChat}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3 rounded-lg flex items-center justify-center gap-2 mb-4 transition-colors duration-200 shadow-md"
            >
              <Plus size={20} />
              New Chat
            </Button>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
              <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                  height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(0, 0, 0, 0.1);
                  border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: rgba(0, 0, 0, 0.2);
                }
              `}</style>
              {isHydrating ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 py-4"
                >
                  <p className="text-sm">No conversations yet.</p>
                  <p className="text-xs mt-1">Start a new one above!</p>
                </motion.div>
              ) : (
                conversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      onClick={() => loadConversation(conv.id)}
                      className={`group relative cursor-pointer flex items-center justify-between px-3 py-2.5 rounded-lg mb-1
                                  transition-all duration-150 ease-in-out ${
                                    conversationId === conv.id
                                      ? 'bg-blue-100 text-blue-900 font-semibold shadow-sm'
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                    >
                      <div className="flex items-center gap-2 truncate flex-grow">
                        <MessageSquare
                          size={16}
                          className={`${
                            conversationId === conv.id ? 'text-blue-800' : 'text-gray-500'
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTitleId(conv.id);
                                  setEditedTitle(getConversationTitle(conv.id));
                                }}
                                className="p-1 rounded-full text-gray-400 hover:text-blue-600 hover:bg-gray-200 transition-colors"
                              >
                                <Edit size={14} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Rename</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(e) => deleteConversationApi(conv.id, e)}
                                className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-200 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
          
          <div className="p-4 md:p-6 border-t border-gray-200 mt-auto">
            <Link href="/profile" passHref>
              <Button
                variant="ghost"
                className="w-full text-blue-950 hover:text-blue-800 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
              >
                <LogOut size={20} />
                <span className="font-semibold">Profile</span>
              </Button>
            </Link>
          </div>
        </motion.aside>

        {/* Main Chat Area */}
        <div
        className={cn(
          "flex-1 flex flex-col  duration-300 ease-in-out",
          
        )}
      >
        {/* AppBar/Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          {/* Always show toggle button on mobile, and on desktop when sidebar is closed */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 hover:text-gray-800 p-4 rounded-full hover:bg-gray-100 transition"
            aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {isSidebarOpen ? (
              <Menu size={24} className="md:hidden" />
            ) : (
              <Menu size={24} />
            )}
          </button>

          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold text-gray-800 flex items-center gap-2 flex-grow justify-center md:justify-start"
          >
            <Bot size={24} className="text-blue-900" /> 
            <span className="bg-blue-950  bg-clip-text text-transparent">
              AI Assistant
            </span>
          </motion.h1>
          
          <div className="w-10"></div>
        </header>


          {/* Chat Messages Container */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar"
          >
            {messages.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-4"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-100 rounded-full blur-md opacity-60"></div>
                  <MessageSquare size={56} className="relative text-blue-900" />
                </div>
                <p className="text-xl font-medium mb-2">
                  Start a New Conversation
                </p>
                <p className="text-md mb-6 max-w-sm">
                  Ask me anything! I'm here to help you.
                </p>
                <Button
                  onClick={startNewChat}
                  className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:from-blue-800 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 text-lg"
                >
                  <Plus size={20} /> New Chat
                </Button>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={messageVariants}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-start gap-3 p-4 rounded-2xl max-w-[90%] md:max-w-[70%] shadow-md transition-all duration-200 ease-in-out ${
                      msg.role === 'user'
                        ? 'bg-blue-900  text-white rounded-br-none'
                        : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full flex-shrink-0 ${
                        msg.role === 'user' ? 'bg-blue-800' : 'bg-gray-100'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User size={18} className="text-white" />
                      ) : (
                        <Bot size={18} className="text-blue-900" />
                      )}
                    </div>
                    <p className="whitespace-pre-wrap text-base leading-relaxed">
                      {msg.content}
                    </p>
                  </motion.div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="p-2 rounded-full bg-gray-100">
                      <Bot size={18} className="text-blue-900" />
                    </div>
                    <Loader2 size={20} className="animate-spin text-blue-600" />
                    <span className="text-gray-600 italic">Thinking...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <motion.footer 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-t border-gray-200 p-4 md:p-6 shadow-lg"
          >
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-5 py-3.5 rounded-xl bg-gray-50 text-gray-900 border border-gray-300
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent
                           transition-all duration-200 ease-in-out text-base"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="bg-gradient-to-r from-blue-900 to-blue-700 p-3.5 text-white rounded-xl shadow-md hover:from-blue-800 hover:to-blue-600 transition-all
                           duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </Button>
            </div>
          </motion.footer>
        </div>
      </div>
    </TooltipProvider>
  );
}