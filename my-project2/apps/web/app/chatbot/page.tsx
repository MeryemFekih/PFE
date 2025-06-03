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
} from 'lucide-react';
import AppBar from '../components/ui/appbar';

export default function Chat() {
  const chatRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChatSidebar, setShowChatSidebar] = useState(true);
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
        setConversationId(convs[0].id);
        const msgs = await getMessagesByConversationId(convs[0].id, sess.accessToken);
        setMessages(Array.isArray(msgs) ? msgs : []);
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

    setInput('');
    setIsLoading(true);

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
    setMessages(Array.isArray(msgs) ? msgs : []);
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
    <div className="flex h-screen bg-blue-50">

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-48 h-full">
        {/* Header */}
        <header className="bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
          <h1 className="font-semibold flex gap-2 items-center">
            <Bot size={21} className="text-blue-200" /> AI Assistant
          </h1>
          <button
            onClick={() => setShowChatSidebar(!showChatSidebar)}
            className="md:hidden bg-blue-800 p-2 rounded-lg hover:bg-blue-700 transition"
            aria-label={showChatSidebar ? "Hide sidebar" : "Show sidebar"}
          >
            {showChatSidebar ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Chat Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Content */}
          <div className="flex-1 flex flex-col h-full">
            {/* Messages */}
            <div 
              ref={chatRef} 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-white"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-blue-500">
                  <MessageSquare size={40} className="mb-3 text-blue-300" />
                  <p>Start a new conversation</p>
                  <button
                    onClick={startNewChat}
                    className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition flex items-center gap-2"
                  >
                    <Plus size={18} /> New Chat
                  </button>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start gap-3 px-4 py-3 rounded-xl max-w-[90%] md:max-w-[85%] ${
                      msg.role === 'user'
                        ? 'bg-blue-700 text-white rounded-br-none shadow-md'
                        : 'bg-blue-50 text-blue-900 rounded-bl-none border border-blue-100 shadow-sm'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-full ${
                        msg.role === 'user' ? 'bg-blue-600' : 'bg-blue-100'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Bot size={16} className="text-blue-800" />
                      )}
                    </div>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="p-1.5 rounded-full bg-blue-100">
                      <Bot size={16} className="text-blue-800" />
                    </div>
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <footer className="bg-white border-t border-blue-100 p-4">
              <div className="max-w-3xl mx-auto flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white text-blue-900 border border-blue-200 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-700 p-2 text-white px-4 py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </footer>
          </div>

          {/* Conversations Sidebar */}
          <div className={`
            ${showChatSidebar ? 'translate-x-0' : 'translate-x-full'}
            fixed md:relative md:translate-x-0
            right-0 top-0 h-full w-72 bg-white border-l border-blue-100
            transition-transform duration-300 ease-in-out z-20
            shadow-lg md:shadow-none
          `}>
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-blue-900">Conversations</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={startNewChat}
                    className="bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800 transition flex items-center gap-1 text-sm"
                  >
                    <Plus size={16} />
                    <span className="hidden md:inline">New</span>
                  </button>
                  <button 
                    onClick={() => setShowChatSidebar(false)}
                    className="md:hidden text-blue-500 hover:text-blue-700"
                    aria-label="Close sidebar"
                  >
                    <ChevronLeft size={20} />
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1">
                {conversations.length === 0 && (
                  <div className="text-center text-blue-500 py-4">
                    <p>No conversations yet</p>
                  </div>
                )}
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`group cursor-pointer flex justify-between items-center px-3 py-3 rounded-lg mb-1 ${
                      conversationId === conv.id
                        ? 'bg-blue-100 text-blue-800 font-medium border border-blue-200'
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate w-full">
                      <MessageSquare size={16} className="text-blue-500 shrink-0" />
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
                          className="text-sm px-2 py-1 rounded border bg-white text-blue-900 border-blue-300 focus:outline-none w-full"
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
                      className="text-blue-400 hover:text-red-500 hidden group-hover:block shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}