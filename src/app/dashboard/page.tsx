// frontend/src/app/dashboard/page.tsx
// Task list page (main UI)

'use client';

import { useState } from 'react';
import TaskList from '@/components/tasks/task-list';
import TaskForm from '@/components/tasks/task-form';
import { useTasks } from '@/hooks/use-tasks';

export default function DashboardPage() {
  const [showForm, setShowForm] = useState(false);
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();

  const handleCreateTask = async (taskData: { title: string; description?: string }) => {
    try {
      await createTask({
        ...taskData,
        completed: false
      });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-responsive-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Your Tasks
          </h1>
          <p className="mt-2 text-responsive-base text-gray-600 dark:text-gray-400">
            Manage your tasks efficiently with NeonTask
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="btn-responsive bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl neon-glow-pink"
          >
            Add task
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg p-4 mt-4 bg-red-100 border border-red-400 text-red-700 neon-glow-yellow">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-medium">Error loading tasks</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 neon-glow-purple"></div>
        </div>
      ) : (
        <div className="mt-6 flow-root w-full overflow-hidden">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm neon-glow-blue w-full">
            <div className="w-full">
              <TaskList 
                tasks={tasks}
                onToggle={toggleTaskCompletion}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <TaskForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
}