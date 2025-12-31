'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication on load
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [router]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call backend chat API
      const response = await fetch(`http://localhost:8000/api/chat/${currentUser.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getAuthToken()}`,
        },
        body: JSON.stringify({
          conversation_id: conversationId || null,
          message: inputValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to get response from AI');
      }

      // Update conversation ID if it's the first message
      if (!conversationId) {
        setConversationId(data.conversation_id);
      }

      // Add AI response to messages
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Header with Neon Effect */}
      <header className="bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200 p-3 sm:p-4 shadow-lg shadow-blue-500/30 border-2 border-blue-400 rounded-2xl mx-2 sm:mx-4 mt-2 sm:mt-4">
        <div className="container mx-auto flex justify-between items-center px-2 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <span className="text-lg sm:text-xl font-bold">🤖</span>
            </div>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-blue-700 drop-shadow-[0_2px_4px_rgba(29,78,216,0.5)]">
              Todo AI Chatbot
            </h1>
          </div>
          <button
            onClick={() => {
              authService.logout();
              router.push('/auth/login');
            }}
            className="text-xs sm:text-sm bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold shadow-lg shadow-red-500/50 transition-all duration-300 hover:scale-105 text-white"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col w-full mx-auto h-[calc(100vh-6rem)] px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex-1 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 rounded-2xl shadow-2xl shadow-indigo-900/50 border-2 border-cyan-400/50 overflow-hidden flex flex-col max-w-5xl mx-auto w-full">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-600 mt-10 sm:mt-20 px-2">
                <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 sm:p-6 rounded-2xl shadow-xl shadow-cyan-500/50 mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl md:text-5xl">💬</span>
                </div>
                <p className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Start a conversation!</p>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <p className="text-cyan-600 font-medium">✨ Try: "Add a task to buy groceries"</p>
                  <p className="text-blue-600 font-medium">📋 Try: "Show me my tasks"</p>
                  <p className="text-indigo-600 font-medium">✅ Try: "Mark task 1 as complete"</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/50'
                        : 'bg-gradient-to-r from-cyan-100 to-blue-100 text-gray-800 shadow-cyan-500/30 border border-cyan-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-xs sm:text-sm break-words">{message.content}</div>
                    <div className={`text-[10px] sm:text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-gradient-to-r from-cyan-100 to-blue-100 text-gray-800 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-lg max-w-xs border border-cyan-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce shadow-lg shadow-cyan-400/50"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100 shadow-lg shadow-blue-400/50"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200 shadow-lg shadow-indigo-400/50"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t-2 border-cyan-400/50 bg-gradient-to-r from-blue-100 to-indigo-100 p-2 sm:p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-2 border-cyan-400 bg-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 placeholder-gray-600 font-semibold placeholder:font-semibold text-xs sm:text-sm shadow-inner min-w-0"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 font-semibold shadow-lg shadow-cyan-500/50 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 text-xs sm:text-sm whitespace-nowrap"
                disabled={!inputValue.trim() || isLoading}
              >
                Send
              </button>
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
              <div className="text-[10px] sm:text-xs text-gray-600">
                <span className="font-semibold text-cyan-700">💡 Examples:</span> "Add groceries", "Show tasks", "Mark task 1 complete"
              </div>
              <div className="text-[10px] sm:text-xs text-blue-700 font-semibold">
                ✨ Designed by <span className="text-indigo-600">Azmat Ali</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}