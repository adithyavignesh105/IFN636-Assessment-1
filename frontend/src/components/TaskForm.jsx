import { useState, useEffect } from 'react';

const TaskForm = ({ editingTask, setEditingTask, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Lost');
  const [deadline, setDeadline] = useState('');
  const [campus, setCampus] = useState('Gardens Point');
  const [location, setLocation] = useState('');

  const typeOptions = ['Lost', 'Found'];
  const campusOptions = ['Gardens Point', 'Kelvin Grove'];

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setType(typeOptions.includes(editingTask.type) ? editingTask.type : 'Lost');
      setDeadline(editingTask.deadline ? editingTask.deadline.split('T')[0] : '');
      setCampus(campusOptions.includes(editingTask.campus) ? editingTask.campus : 'Gardens Point');
      setLocation(editingTask.location || '');
    } else {
      setTitle('');
      setDescription('');
      setType('Lost');
      setDeadline('');
      setCampus('Gardens Point');
      setLocation('');
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 用 JSON 直接送資料
    const payload = {
      title,
      description,
      type,
      campus,
      location,
      deadline: deadline || null
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">{editingTask ? 'Edit Item' : 'Submit Lost / Found Item'}</h2>

      <div className="mb-2">
        <label>Item Name</label>
        <input className="border p-1 w-full" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div className="mb-2">
        <label>Description</label>
        <textarea className="border p-1 w-full" value={description} onChange={e => setDescription(e.target.value)} required />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Type</label>
        <select value={type} onChange={e => setType(e.target.value)} className="border p-1">
          {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Campus</label>
        <select value={campus} onChange={e => setCampus(e.target.value)} className="border p-1 w-full">
          {campusOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="mb-2">
        <label>Location</label>
        <input type="text" className="border p-1 w-full" value={location} onChange={e => setLocation(e.target.value)} />
      </div>

      <div className="mb-2">
        <label>Date</label>
        <input type="date" className="border p-1 w-full" value={deadline} onChange={e => setDeadline(e.target.value)} />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingTask ? 'Update' : 'Add'}</button>
      {editingTask && (
        <button type="button" className="ml-2 px-4 py-2 border rounded" onClick={() => setEditingTask(null)}>Cancel</button>
      )}
    </form>
  );
};

export default TaskForm;