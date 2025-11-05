import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const { fetchMe } = useContext(AuthContext);
  const nav = useNavigate();

  const update = (e) => setForm({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    try {
      // backend may expect /register or /signup — try register first then fallback
      try {
        await api.post('/api/auth/register', form);
      } catch (err) {
        await api.post('/api/auth/signup', form);
      }
      alert('Registered. Please login.');
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="card auth-card">
      <h2>Create account</h2>
      <form onSubmit={submit} className="form">
        <input name="name" value={form.name} onChange={update} placeholder="Full name" required />
        <input name="email" type="email" value={form.email} onChange={update} placeholder="Email" required />
        <input name="password" type="password" value={form.password} onChange={update} placeholder="Password" required />
        <label className="label-inline">
          Role:
          <select name="role" value={form.role} onChange={update}>
            <option value="client">Client</option>
            <option value="therapist">Therapist</option>
          </select>
        </label>
        <button className="btn">Sign up</button>
      </form>
    </div>
  );
}
