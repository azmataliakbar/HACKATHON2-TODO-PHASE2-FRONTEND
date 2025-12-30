// frontend/src/app/page.tsx
// Landing page (redirect to /dashboard if logged in)

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (authService.isAuthenticated()) {
      // Redirect to dashboard if logged in
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center py-6 sm:px-6 lg:px-8 neon-float">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mx-responsive">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center neon-glow-purple">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-responsive-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          NeonTask
        </h2>
        <p className="mt-2 text-center text-responsive-base text-gray-600 dark:text-gray-300">
          Manage your tasks with our colorful, secure todo app
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mx-responsive">
        <div className="card-responsive neon-glow-blue">
          <div className="space-y-6">
            <div>
              <button
                onClick={() => router.push('/signup')}
                className="btn-responsive w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl neon-glow-pink"
              >
                Sign up
              </button>
            </div>

            <div>
              <button
                onClick={() => router.push('/login')}
                className="btn-responsive w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl neon-glow-blue"
              >
                Log in
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-responsive-sm text-gray-600 dark:text-gray-400">
              Experience the power of organized productivity
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements for more visual appeal */}
      <div className="fixed top-10 left-10 w-20 h-20 rounded-full bg-pink-500 opacity-20 blur-xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 rounded-full bg-blue-500 opacity-20 blur-xl animate-pulse delay-300"></div>
      <div className="fixed top-1/3 right-1/4 w-16 h-16 rounded-full bg-purple-500 opacity-20 blur-xl animate-pulse delay-700"></div>

      {/* Designed by text */}
      <div className="mt-8 text-center">
        <p className="text-responsive-lg font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent shadow-lg py-4">
          Designed By: Azmat Ali
        </p>
      </div>
    </div>
  );
}