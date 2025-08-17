import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Shifts = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '', role: '', location: '', notes: '' });

  const headers = user ? { Authorization: `Bearer ${user.token}` } : {};

  const fetchShifts = async () => {
    try {
      const res = await axiosInstance.get('/api/shifts', { headers });
      setShifts(res.data);
    } catch { alert('Failed to fetch shifts'); }
  };

  useEffect(() => { fetchShifts(); }, []); // eslint-disable-line

  const create = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/api/shifts', form, { headers });
      setShifts([res.data, ...shifts]);
      setForm({ date: '', startTime: '', endTime: '', role: '', location: '', notes: '' });
    } catch (e) { alert(e.response?.data?.message || 'Failed to create'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete shift?')) return;
    await axiosInstance.delete(`/api/shifts/${id}`, { headers });
    setShifts(shifts.filter(s => s._id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shift Allocations</h1>
      <form onSubmit={create} className="grid md:grid-cols-6 gap-2 mb-6">
        <input required type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="border p-2 rounded"/>
        <input required placeholder="Start HH:mm" value={form.startTime} onChange={e=>setForm({...form, startTime:e.target.value})} className="border p-2 rounded"/>
        <input required placeholder="End HH:mm" value={form.endTime} onChange={e=>setForm({...form, endTime:e.target.value})} className="border p-2 rounded"/>
        <input placeholder="Role" value={form.role} onChange={e=>setForm({...form, role:e.target.value})} className="border p-2 rounded"/>
        <input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} className="border p-2 rounded"/>
        <button className="bg-blue-600 text-white rounded px-4">Create</button>
      </form>

      <ul className="space-y-2">
        {shifts.map(s => (
          <li key={s._id} className="border p-3 rounded flex justify-between">
            <div>
              <div className="font-semibold">{new Date(s.date).toLocaleDateString()} {s.startTime}-{s.endTime}</div>
              <div className="text-sm">{s.role} @ {s.location} • status: {s.status}</div>
            </div>
            <button onClick={()=>remove(s._id)} className="px-3 py-1 border rounded">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Shifts;
