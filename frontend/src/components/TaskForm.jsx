// src/components/TaskForm.jsx
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const isoToYMD = (val) => {
  if (!val) return '';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return '';
  // Return YYYY-MM-DD for <input type="date">
  return d.toISOString().slice(0, 10);
};

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { user } = useAuth();
  const token = user?.token;

  const initial = useMemo(
    () => ({
      title: '',
      description: '',
      deadline: '',
    }),
    []
  );

  const [formData, setFormData] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        deadline: isoToYMD(editingTask.deadline),
      });
    } else {
      setFormData(initial);
    }
    setErrors({});
  }, [editingTask, initial]);

  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = 'Title is required';
    if (formData.deadline && Number.isNaN(new Date(formData.deadline).getTime())) {
      e.deadline = 'Invalid date';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        // Send ISO string so backend can store a proper date
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      };

      if (editingTask) {
        const { data } = await axiosInstance.put(`/api/tasks/${editingTask._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
      } else {
        const { data } = await axiosInstance.post('/api/tasks', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks([...tasks, data]);
      }

      setEditingTask(null);
      setFormData(initial);
    } catch (error) {
      // You can inspect error.response?.data?.message for API messages
      alert('Failed to save task.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setFormData(initial);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {editingTask ? 'Task Form: Edit' : 'Task Form: Create'}
        </h1>
        {editingTask && (
          <button
            type="button"
            onClick={cancelEdit}
            className="text-sm px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>

      <label className="block mb-3">
        <span className="block text-sm font-medium mb-1">Title</span>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full p-2 border rounded ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
      </label>

      <label className="block mb-3">
        <span className="block text-sm font-medium mb-1">Description</span>
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded border-gray-300"
        />
      </label>

      <label className="block mb-5">
        <span className="block text-sm font-medium mb-1">Deadline</span>
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          className={`w-full p-2 border rounded ${
            errors.deadline ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.deadline && <p className="text-red-600 text-sm mt-1">{errors.deadline}</p>}
      </label>

      <button
        type="submit"
        disabled={saving}
        className={`w-full text-white p-2 rounded ${
          saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {saving ? 'Saving…' : editingTask ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;
