
// frontend/src/components/layout/header.tsx
// Top navigation (logo, user menu, logout)

'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentUser(authService.getCurrentUser());
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Don't render auth-dependent UI until mounted
  if (!mounted) {
    return (
      <header className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg neon-glow-blue">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0 flex-shrink">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center neon-glow-purple">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h1 className="ml-2 sm:ml-3 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent whitespace-nowrap">
                  NeonTask
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              {/* Loading space */}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg neon-glow-blue">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
          <div className="flex items-center min-w-0 flex-shrink overflow-hidden">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center neon-glow-purple">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h1 className="ml-2 sm:ml-3 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent whitespace-nowrap">
                NeonTask
              </h1>
            </div>
          </div>
          <div className="flex items-center flex-shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                <span className="hidden md:inline text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                  Welcome, {currentUser.name}
                </span>
                <span className="md:hidden text-[10px] text-gray-700 dark:text-gray-300 font-medium truncate max-w-[70px]">
                  {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-red-500 to-pink-600 text-white rounded hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl neon-glow-pink whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-1 sm:gap-2">
                <a
                  href="/login"
                  className="px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl neon-glow-blue whitespace-nowrap"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded hover:from-pink-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl neon-glow-pink whitespace-nowrap"
                >
                
                  Sign up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}