import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ editingTask, setEditingTask, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Lost'); // default
  const [deadline, setDeadline] = useState('');
  const [image, setImage] = useState(null);

  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const [campus, setCampus] = useState('');
  const [campuses, setCampuses] = useState([]);
  const [loadingCampuses, setLoadingCampuses] = useState(true);

  const [location, setLocation] = useState('');

  // Fetch type LOV from backend
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axiosInstance.get('/api/items/types');
        const enumTypes = Array.isArray(res.data) ? res.data : [];
        setTypes(enumTypes);
        setType(prev => prev || (enumTypes.includes('Lost') ? 'Lost' : enumTypes[0] || ''));
      } catch (err) {
        console.error('Failed to fetch item types:', err);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  // Set campus LOV
  useEffect(() => {
    const enumCampuses = ['Gardens Point', 'Kelvin Grove'];
    setCampuses(enumCampuses);
    setCampus(prev => prev || enumCampuses[0]);
    setLoadingCampuses(false);
  }, []);

  // Initialize form values for editing or new item
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setType(types.includes(editingTask.type) ? editingTask.type : 'Lost');
      setDeadline(editingTask.deadline ? editingTask.deadline.split('T')[0] : '');
      setCampus(campuses.includes(editingTask.campus) ? editingTask.campus : 'Gardens Point');
      setLocation(editingTask.location || '');
      setImage(null);
    } else {
      setTitle('');
      setDescription('');
      setType(types[0] || 'Lost');
      setDeadline('');
      setCampus(campuses[0] || 'Gardens Point');
      setLocation('');
      setImage(null);
    }
  }, [editingTask, campuses, types]);

const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData();

  formData.append('title', title || '');
  formData.append('description', description || '');

  const validType = types.includes(type) ? type : 'Lost';
  formData.append('type', validType);

  const validCampus = campuses.includes(campus) ? campus : 'Gardens Point';
  formData.append('campus', validCampus);
  formData.append('location', location || '');

  if (deadline) {formData.append('deadline', deadline);}
  //if (image) formData.append('image', image);

  onSubmit(formData, image);
};


  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">{editingTask ? 'Edit Item' : 'Submit Lost / Found Item'}</h2>

      {/* Title */}
      <div className="mb-2">
        <label>Item Name</label>
        <input
          className="border p-1 w-full"
          type="text"
          placeholder="Enter a clear item name (Provide the brand name if possible)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div className="mb-2">
        <label>Description</label>
        <textarea
          className="border p-1 w-full"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Type */}
      <div className="mb-4">
        <label className="block mb-1">Type</label>
        {loadingTypes ? (
          <p>Loading types...</p>
        ) : (
          <p>
            This is a{' '}
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="border p-1"
            >
              {types.map(t => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>{' '}
            item.
          </p>
        )}
      </div>

      {/* Campus */}
      <div className="mb-4">
        <label className="block mb-1">Campus</label>
        {loadingCampuses ? (
          <p>Loading campuses...</p>
        ) : (
          <select
            value={campus}
            onChange={e => setCampus(e.target.value)}
            className="border p-1 w-full"
          >
            {campuses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      </div>

      {/* Location */}
      <div className="mb-2">
        <label>Location</label>
        <input
          type="text"
          className="border p-1 w-full"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </div>

      {/* Deadline */}
      <div className="mb-2">
        <label>Item Lost / Found Date</label>
        <input
          type="date"
          className="border p-1 w-full"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />
      </div>

      {/* Image */}
      <div className="mb-2">
        <label>Image Upload</label>
        <input
          type="file"
          className="w-full"
          onChange={e => setImage(e.target.files[0])}
        />
      </div>

      {/* Buttons */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingTask ? 'Update' : 'Add'}
      </button>
      {editingTask && (
        <button
          type="button"
          className="ml-2 px-4 py-2 border rounded"
          onClick={() => setEditingTask(null)}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default TaskForm;