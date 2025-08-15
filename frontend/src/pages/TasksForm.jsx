import { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TasksForm = () => {
  const { user } = useAuth();
  const [editingTask, setEditingTask] = useState(null);

  const handleFormSubmit = async (payload) => {
    try {
      let res;
      if (editingTask) {
        res = await axiosInstance.put(`/api/items/${editingTask._id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert('Item updated successfully.');
      } else {
        res = await axiosInstance.post('/api/items', payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert('Item submitted successfully.');
      }
      setEditingTask(null);
    } catch (error) {
      alert('Failed to save task.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <TaskForm editingTask={editingTask} setEditingTask={setEditingTask} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default TasksForm;