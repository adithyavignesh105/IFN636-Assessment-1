// src/components/TaskList.jsx
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const fmtDate = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
};

const TaskList = ({ tasks, setTasks, setEditingTask }) => {
  const { user } = useAuth();
  const token = user?.token;

  const handleDelete = async (taskId) => {
    const ok = window.confirm('Delete this task? This action cannot be undone.');
    if (!ok) return;

    // Optimistic UI update
    const prev = tasks;
    setTasks(prev.filter((t) => t._id !== taskId));
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      // Rollback on failure
      setTasks(prev);
      alert('Failed to delete task.');
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-600">
        No tasks yet. Create your first one above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white p-4 rounded shadow border border-gray-100"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-lg">{task.title || '(Untitled)'}</h2>
              {task.description && (
                <p className="text-gray-700 mt-1">{task.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Deadline: {fmtDate(task.deadline)}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setEditingTask(task)}
                className="px-3 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
