// frontend/src/components/tasks/task-item.tsx
// Single task card with actions (edit, delete, toggle)

import { useState } from 'react';
import { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onUpdate: (id: number, data: Partial<Task>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [copied, setCopied] = useState(false);

  // Generate 6-digit ID from task.id
  const taskId = String(task.id).padStart(6, '0');

  // Format date - shorter for mobile
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggle = async () => {
    try {
      await onToggle(task.id, !task.completed);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      await onUpdate(task.id, { title, description });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setIsEditing(false);
  };

  const handleCopy = () => {
    const taskText = `ID: ${taskId}\nTitle: ${title}\nDescription: ${description}\nCreated: ${formatDate(task.created_at)}`;
    navigator.clipboard.writeText(taskText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <li className="py-3 px-2 sm:py-4 sm:px-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
      <div className="flex items-start gap-2 w-full">
        {/* Checkbox */}
        <input
          id={`task-${task.id}`}
          name={`task-${task.id}`}
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 neon-glow-purple flex-shrink-0"
        />
        
        {/* Content Area - Takes remaining space */}
        <div className="min-w-0 flex-1 overflow-hidden">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="block w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm transition-all duration-300"
                autoFocus
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="block w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm transition-all duration-300"
                rows={2}
              />
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 text-xs bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg neon-glow-green"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-xs bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <label htmlFor={`task-${task.id}`} className="block">
                <span className={`block text-xs sm:text-sm font-medium break-words ${task.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-200'}`}>
                  {task.title}
                </span>
                {task.description && (
                  <p className={`mt-0.5 text-[10px] sm:text-xs break-words ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                    {task.description}
                  </p>
                )}
              </label>
              {/* Task ID and Created Date */}
              <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[9px] sm:text-xs">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-mono whitespace-nowrap">
                  ID:{taskId}
                </span>
                <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  📅 {formatDate(task.created_at)}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons - Fixed width */}
        <div className="flex-shrink-0 flex flex-col gap-1 w-[50px] sm:w-[60px]">
          {!isEditing && (
            <>
              <button
                onClick={handleCopy}
                className="w-full px-1.5 py-1 text-[10px] sm:text-xs bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow neon-glow-yellow"
                title="Copy"
              >
                {copied ? '✓' : '📋'}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-1.5 py-1 text-[10px] sm:text-xs bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow neon-glow-blue"
              >
                Edit
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="w-full px-1.5 py-1 text-[10px] sm:text-xs bg-gradient-to-r from-red-500 to-pink-600 text-white rounded hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow neon-glow-pink"
          >
            Del
          </button>
        </div>
      </div>
    </li>
  );
}