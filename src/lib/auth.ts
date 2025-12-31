// frontend/src/lib/auth.ts
// Real authentication with FastAPI backend

import apiClient from './api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface SignupResponse {
  access_token: string;
  token_type: string;
  user: User;
}

class AuthService {
  private static instance: AuthService;
  private user: User | null = null;

  private constructor() {
    // Load user from localStorage on initialization
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
      const { data, error } = await apiClient.post<LoginResponse>('/api/auth/login', {
        email,
        password,
      });

      if (error || !data) {
        console.error('Login failed:', error);
        return null;
      }

      this.user = data.user;
      const token = data.access_token;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return { user: this.user, token };
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  async signup(email: string, password: string, name: string): Promise<{ user: User; token: string } | null> {
    try {
      const { data, error } = await apiClient.post<SignupResponse>('/api/auth/signup', {
        email,
        password,
        full_name: name,
      });

      if (error || !data) {
        console.error('Signup failed:', error);
        return null;
      }

      this.user = data.user;
      const token = data.access_token;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return { user: this.user, token };
    } catch (error) {
      console.error('Signup failed:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }

  async getAuthToken(): Promise<string | null> {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export types
export type { User };