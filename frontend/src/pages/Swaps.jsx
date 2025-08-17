import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Swaps = () => {
  const { user } = useAuth();
  const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
  const [swaps, setSwaps] = useState([]);
  const [form, setForm] = useState({ shiftId: '', toEmployeeEmail: '', reason: '' });

  const load = async () => {
    const res = await axiosInstance.get('/api/swaps', { headers });
    setSwaps(res.data);
  };
  useEffect(()=>{ load(); }, []); // eslint-disable-line

  const requestSwap = async (e) => {
    e.preventDefault();
    const res = await axiosInstance.post('/api/swaps', form, { headers });
    setSwaps([res.data, ...swaps]);
    setForm({ shiftId: '', toEmployeeEmail: '', reason: '' });
  };

  const approve = async (id) => {
    const res = await axiosInstance.put(`/api/swaps/${id}/approve`, {}, { headers });
    setSwaps(swaps.map(s => s._id === id ? res.data : s));
  };
  const reject = async (id) => {
    const res = await axiosInstance.put(`/api/swaps/${id}/reject`, {}, { headers });
    setSwaps(swaps.map(s => s._id === id ? res.data : s));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shift Swaps</h1>
      <form onSubmit={requestSwap} className="grid md:grid-cols-4 gap-2 mb-6">
        <input required placeholder="Shift ID" value={form.shiftId} onChange={e=>setForm({...form, shiftId:e.target.value})} className="border p-2 rounded"/>
        <input required placeholder="To Employee Email" value={form.toEmployeeEmail} onChange={e=>setForm({...form, toEmployeeEmail:e.target.value})} className="border p-2 rounded"/>
        <input placeholder="Reason" value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})} className="border p-2 rounded"/>
        <button className="bg-blue-600 text-white rounded px-4">Request Swap</button>
      </form>

      <ul className="space-y-2">
        {swaps.map(s => (
          <li key={s._id} className="border p-3 rounded flex justify-between">
            <div>
              <div className="font-semibold">Shift {s.shift?._id} • {s.fromEmployee?.email} → {s.toEmployee?.email}</div>
              <div className="text-sm">Status: {s.status} {s.reason && `• ${s.reason}`}</div>
            </div>
            <div className="space-x-2">
              <button onClick={()=>approve(s._id)} className="px-3 py-1 border rounded">Approve</button>
              <button onClick={()=>reject(s._id)} className="px-3 py-1 border rounded">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Swaps;
