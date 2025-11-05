import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, fetchMe } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      // try register naming differences gracefully
      const res = await api.post('/api/auth/login', { email, password });
      // backend may return role or not; call /me to refresh
      await fetchMe();
      const me = (await api.get('/api/auth/me')).data;
      setUser(me);
      nav(me.role === 'therapist' ? '/therapist-dashboard' : '/client-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="card auth-card">
      <h2>Welcome back</h2>
      <form onSubmit={submit} className="form">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
        <button className="btn">Log in</button>
      </form>
      <p className="muted">Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}
