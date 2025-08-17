import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', university: '', address: '' });

  useEffect(() => {
    const load = async () => {
      const res = await axiosInstance.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setForm(res.data);
    };
    if (user) load();
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    const res = await axiosInstance.put('/api/auth/profile', form, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    login(res.data);
    alert('Profile updated');
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <form onSubmit={save} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Name" value={form.name || ''} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input className="w-full border p-2 rounded" placeholder="Email" value={form.email || ''} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="w-full border p-2 rounded" placeholder="University" value={form.university || ''} onChange={e=>setForm({...form, university:e.target.value})}/>
        <input className="w-full border p-2 rounded" placeholder="Address" value={form.address || ''} onChange={e=>setForm({...form, address:e.target.value})}/>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
};

export default Profile;
