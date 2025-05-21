'use client';

import { useRef, useState, useEffect } from 'react';
import { fetchAIResponse,createConversation, sendUserMessage, saveAssistantMessage } from '@/lib/chatBot-action'; // already has AI call
import { getSession } from '@/lib/session'; // or however you fetch session

export default function Chat() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hello! How can I help you today? 👋😊' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session?.accessToken) return;
      const conv = await createConversation(session.accessToken);
      setConversationId(conv.id);
    })();
  }, []);

  const handleSendMessage = async () => {
    const session = await getSession();
    if (!session?.accessToken || !conversationId) return;

    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    await sendUserMessage(conversationId, userMessage, session.accessToken);
    const aiReply = await fetchAIResponse([...messages, { role: 'user', content: userMessage }]);

    await saveAssistantMessage(conversationId, aiReply, session.accessToken);
    setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);

    setIsLoading(false);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <main className="bg-[#4F6CFE1A] flex items-center justify-center min-h-screen font-poppins px-4">
      <div className="bg-white w-full max-w-md max-h-[90vh] rounded-xl shadow-md flex flex-col overflow-hidden">
        <header className="bg-[#4F6BFE] text-white text-center p-4">
          <h2 className="text-xl font-semibold">Deepseek API</h2>
        </header>

        <div ref={chatRef} className="flex-1 overflow-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <section
              key={i}
              className={`max-w-fit px-3 py-2 rounded-lg text-sm whitespace-pre-wrap break-words ${
                msg.role === 'user'
                  ? 'bg-[#4F6BFE] text-white ml-auto rounded-br-none'
                  : 'bg-[#4F6BFE1A] text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.content}
            </section>
          ))}
          {isLoading && (
            <section className="bg-[#4F6BFE1A] px-3 py-2 rounded-lg text-sm text-gray-700 max-w-fit">
              Loading...
            </section>
          )}
        </div>

        <footer className="border-t border-gray-200 p-4 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type message"
            className="flex-1 h-10 px-3 rounded-md border border-gray-300 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className={`w-11 h-11 flex items-center justify-center rounded-full ${
              isLoading ? 'bg-black opacity-10 pointer-events-none' : 'bg-[#4F6BFE]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="m21.426 11.095-17-8A1 1 0 0 0 3.03 4.242l1.212 4.849L12 12l-7.758 2.909-1.212 4.849a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81z" />
            </svg>
          </button>
        </footer>
      </div>
    </main>
  );
}
