// frontend/src/types.ts
// Shared TypeScript types

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  pending: number;
  completed: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    details?: any;
  };
}