import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Overtime = () => {
  const { user } = useAuth();
  const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
  const [rules, setRules] = useState([]);
  const [requests, setRequests] = useState([]);
  const [ruleForm, setRuleForm] = useState({ name: '', dayOfWeek: 1, startHour: 18, endHour: 24, multiplier: 1.5, minHours: 1 });
  const [reqForm, setReqForm] = useState({ date: '', hours: 2, reason: '' });

  const load = async () => {
    const r = await axiosInstance.get('/api/overtime/rules', { headers });
    setRules(r.data);
    const reqs = await axiosInstance.get('/api/overtime/requests', { headers });
    setRequests(reqs.data);
  };
  useEffect(()=>{ load(); }, []); // eslint-disable-line

  const addRule = async (e) => {
    e.preventDefault();
    const res = await axiosInstance.post('/api/overtime/rules', ruleForm, { headers });
    setRules([res.data, ...rules]);
    setRuleForm({ name: '', dayOfWeek: 1, startHour: 18, endHour: 24, multiplier: 1.5, minHours: 1 });
  };

  const addRequest = async (e) => {
    e.preventDefault();
    const res = await axiosInstance.post('/api/overtime/requests', reqForm, { headers });
    setRequests([res.data, ...requests]);
    setReqForm({ date: '', hours: 2, reason: '' });
  };

  const delRule = async (id) => {
    await axiosInstance.delete(`/api/overtime/rules/${id}`, { headers });
    setRules(rules.filter(r => r._id !== id));
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Overtime Rules</h1>
        <form onSubmit={addRule} className="grid md:grid-cols-6 gap-2 mb-4">
          <input required placeholder="Name" value={ruleForm.name} onChange={e=>setRuleForm({...ruleForm, name:e.target.value})} className="border p-2 rounded"/>
          <select value={ruleForm.dayOfWeek} onChange={e=>setRuleForm({...ruleForm, dayOfWeek:Number(e.target.value)})} className="border p-2 rounded">
            <option value={0}>Sun</option><option value={1}>Mon</option><option value={2}>Tue</option><option value={3}>Wed</option><option value={4}>Thu</option><option value={5}>Fri</option><option value={6}>Sat</option>
          </select>
          <input type="number" min="0" max="24" value={ruleForm.startHour} onChange={e=>setRuleForm({...ruleForm, startHour:Number(e.target.value)})} className="border p-2 rounded"/>
          <input type="number" min="0" max="24" value={ruleForm.endHour} onChange={e=>setRuleForm({...ruleForm, endHour:Number(e.target.value)})} className="border p-2 rounded"/>
          <input type="number" step="0.1" min="1" value={ruleForm.multiplier} onChange={e=>setRuleForm({...ruleForm, multiplier:Number(e.target.value)})} className="border p-2 rounded"/>
          <button className="bg-blue-600 text-white rounded px-4">Add Rule</button>
        </form>
        <ul className="space-y-2">
          {rules.map(r => (
            <li key={r._id} className="border p-3 rounded flex justify-between">
              <div>{r.name} • DOW {r.dayOfWeek} • {r.startHour}:00-{r.endHour}:00 • x{r.multiplier}</div>
              <button onClick={()=>delRule(r._id)} className="px-3 py-1 border rounded">Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Overtime Requests</h2>
        <form onSubmit={addRequest} className="grid md:grid-cols-5 gap-2 mb-4">
          <input required type="datetime-local" value={reqForm.date} onChange={e=>setReqForm({...reqForm, date:e.target.value})} className="border p-2 rounded"/>
          <input required type="number" step="0.25" min="0.25" value={reqForm.hours} onChange={e=>setReqForm({...reqForm, hours:Number(e.target.value)})} className="border p-2 rounded"/>
          <input placeholder="Reason" value={reqForm.reason} onChange={e=>setReqForm({...reqForm, reason:e.target.value})} className="border p-2 rounded"/>
          <button className="bg-blue-600 text-white rounded px-4">Request</button>
        </form>
        <ul className="space-y-2">
          {requests.map(o => (
            <li key={o._id} className="border p-3 rounded">
              <div className="font-semibold">{new Date(o.date).toLocaleString()} • {o.hours}h • status: {o.status}</div>
              <div className="text-sm">Rule x{o.multiplier}{o.appliedRule ? ` (${o.appliedRule.name})` : ''}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Overtime;
