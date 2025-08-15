import { useAuth } from '../context/AuthContext';

const TaskList = ({ tasks, setEditingTask, onDelete, onApprove, onReject }) => {
  const { user } = useAuth();

  if (!tasks.length) return <div><p className="text-gray-400">You have not submitted any lost or found items yet.</p>
  <p className="text-gray-400">This list is currently empty.</p></div>;

  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{task.title}</h2>
          <p>{task.description}</p>
          {task.deadline && (
            <p className="text-sm text-gray-500">
              {task.type === 'Lost' ? 'Item Lost Date' : 'Item Found Date'}: {new Date(task.deadline).toLocaleDateString()}
            </p>
          )}
          <p>{task.campus}</p>
          <div className="mt-2 space-x-2">
            {user?.role === 'admin' ? (
              <>
                <button
                  onClick={() => onApprove(task._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(task._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
                <button
                  onClick={() => setEditingTask(task)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </>
            ) : (
              task.userId === user.id && (
                <>
                  <button
                    onClick={() => setEditingTask(task)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(task._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;