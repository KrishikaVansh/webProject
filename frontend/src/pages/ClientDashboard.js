import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function ClientDashboard(){
  const [upcoming, setUpcoming] = useState([]);
  const [therapists, setTherapists] = useState([]);

  async function fetchData(){
    const appts = (await api.get('/api/appointments')).data;
    // server returns { asClient, asTherapist } — pick asClient
    setUpcoming(appts.asClient || appts);
    const t = (await api.get('/api/therapists')).data;
    setTherapists(t);
  }

  useEffect(()=>{ fetchData(); }, []);

  return (
    <div>
      <h1>Client Dashboard</h1>
      <section className="card">
        <h3>Upcoming appointments</h3>
        {upcoming.length===0 ? <p>No upcoming appointments</p> : (
          <ul>
            {upcoming.map(a => <li key={a.id}>{new Date(a.appointment_time).toLocaleString()} — with therapist #{a.therapist_id} — status: {a.status}</li>)}
          </ul>
        )}
      </section>

      <section className="card">
        <h3>Find a therapist</h3>
        <div className="grid">
          {therapists.map(t => (
            <div key={t.id} className="mini-card">
              <h4>{t.name}</h4>
              <p>{t.email}</p>
              <Link to={`/appointments`} className="btn-ghost">Book</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
