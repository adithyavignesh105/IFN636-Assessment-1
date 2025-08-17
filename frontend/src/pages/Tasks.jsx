// src/pages/Tasks.jsx
import { useEffect, useState, useRef, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth(); // { token, ... }
  const token = user?.token;

  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // force reload after mutations
  const abortRef = useRef(null);

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    // cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // Optional: add pagination/sort filters via query params
      // e.g., /api/tasks?sort=-deadline&limit=100
      const res = await axiosInstance.get('/api/tasks', {
        headers: { Authorization: `Bearer {token}`.replace('{token}', token) },
        signal: controller.signal,
      });
      setTasks(Array.isArray(res.data) ? res.data : res.data.items || []);
    } catch (err) {
      if (err.name !== 'CanceledError') {
        alert('Failed to fetch tasks.');
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
    return () => abortRef.current?.abort();
  }, [fetchTasks, refreshKey]);

  // When the form creates/updates a task, we keep the list in sync locally,
  // but we also expose a "hard" refresh helper in case the backend applies
  // server-side defaults/hook logic.
  const hardRefresh = () => setRefreshKey((k) => k + 1);

  if (!token) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-600">
        You must be logged in to view tasks.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          onClick={hardRefresh}
          className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Form */}
      <TaskForm
        tasks={tasks}
        setTasks={setTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-4 mt-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-white p-4 rounded shadow">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          setEditingTask={setEditingTask}
        />
      )}
    </div>
  );
};

export default Tasks;
