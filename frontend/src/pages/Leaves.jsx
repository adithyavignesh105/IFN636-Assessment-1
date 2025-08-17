import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Leaves = () => {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ type: 'annual', startDate: '', endDate: '', reason: '' });
  const headers = user ? { Authorization: `Bearer ${user.token}` } : {};

  const fetch = async () => {
    const res = await axiosInstance.get('/api/leaves', { headers });
    setList(res.data);
  };
  useEffect(()=>{ fetch(); }, []); // eslint-disable-line

  const create = async (e) => {
    e.preventDefault();
    const res = await axiosInstance.post('/api/leaves', form, { headers });
    setList([res.data, ...list]);
    setForm({ type: 'annual', startDate: '', endDate: '', reason: '' });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>
      <form onSubmit={create} className="grid md:grid-cols-5 gap-2 mb-6">
        <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})} className="border p-2 rounded">
          <option value="annual">Annual</option>
          <option value="sick">Sick</option>
          <option value="unpaid">Unpaid</option>
          <option value="compassionate">Compassionate</option>
          <option value="other">Other</option>
        </select>
        <input required type="date" value={form.startDate} onChange={e=>setForm({...form, startDate:e.target.value})} className="border p-2 rounded"/>
        <input required type="date" value={form.endDate} onChange={e=>setForm({...form, endDate:e.target.value})} className="border p-2 rounded"/>
        <input placeholder="Reason" value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})} className="border p-2 rounded"/>
        <button className="bg-blue-600 text-white rounded px-4">Request</button>
      </form>

      <ul className="space-y-2">
        {list.map(l => (
          <li key={l._id} className="border p-3 rounded">
            <div className="font-semibold">{l.type} leave: {new Date(l.startDate).toLocaleDateString()} → {new Date(l.endDate).toLocaleDateString()}</div>
            <div className="text-sm">Status: {l.status} {l.reason && `• ${l.reason}`}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaves;
