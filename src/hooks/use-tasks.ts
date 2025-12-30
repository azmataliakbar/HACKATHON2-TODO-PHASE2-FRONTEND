// frontend/src/hooks/use-tasks.ts
// Custom hook for task operations with React Query-like pattern

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import { Task } from '@/types';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (id: number, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskCompletion: (id: number, completed: boolean) => Promise<void>;
}

// Backend response type
interface TaskListResponse {
  tasks: Task[];
  total: number;
  pending: number;
  completed: number;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<TaskListResponse>('/tasks');

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Fix: Extract tasks array from response
      setTasks(response.data?.tasks || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const response = await apiClient.post<Task>('/tasks', taskData);

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Optimistically update the UI
      if (response.data) {
        setTasks(prev => [...prev, response.data!]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const updateTask = async (id: number, taskData: Partial<Task>) => {
    try {
      setError(null);
      const response = await apiClient.put<Task>(`/tasks/${id}`, taskData);

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Optimistically update the UI
      if (response.data) {
        setTasks(prev => prev.map(task => task.id === id ? response.data! : task));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const toggleTaskCompletion = async (id: number, completed: boolean) => {
    try {
      setError(null);
      const response = await apiClient.patch<Task>(`/tasks/${id}/complete`, { completed });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Optimistically update the UI
      if (response.data) {
        setTasks(prev => prev.map(task =>
          task.id === id
            ? { ...task, completed: response.data!.completed, completed_at: response.data!.completed_at }
            : task
        ));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update task completion');
      console.error('Error updating task completion:', err);
      throw err;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setError(null);
      const response = await apiClient.delete(`/tasks/${id}`);

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Optimistically update the UI
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
};