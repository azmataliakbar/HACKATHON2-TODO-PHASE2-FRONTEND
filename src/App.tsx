import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';

const App: React.FC = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Check for existing user session on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    if (token && userId) {
      setUserToken(token);
      setUserId(userId);
    }
  }, []);

  if (!userToken || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Todo AI Chatbot</h1>
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-indigo-600 text-white p-4">
        <h1 className="text-xl font-bold">Todo AI Chatbot</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatInterface userId={userId} />
      </main>
    </div>
  );

  function handleLogin(token: string, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', userId);
    setUserToken(token);
    setUserId(userId);
  }
};

const LoginForm: React.FC<{ onLogin: (token: string, userId: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isSignup
        ? 'http://localhost:8000/api/auth/signup'
        : 'http://localhost:8000/api/auth/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isSignup
            ? { email, password, full_name: name }
            : { email, password }
        ),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.access_token, data.user.id);
      } else {
        setError(data.detail || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignup && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
      >
        {isSignup ? 'Sign Up' : 'Log In'}
      </button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          className="text-indigo-600 hover:text-indigo-800 text-sm"
        >
          {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </form>
  );
};

export default App;