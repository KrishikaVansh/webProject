import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function TherapistDashboard(){
  const [appointments, setAppointments] = useState([]);

  async function fetchData(){
    const res = await api.get('/api/appointments');
    const rows = res.data.asTherapist || res.data;
    setAppointments(rows);
  }

  useEffect(()=>{ fetchData(); }, []);

  return (
    <div>
      <h1>Therapist Dashboard</h1>
      <section className="card">
        <h3>Booked appointments</h3>
        {appointments.length===0 ? <p>No bookings yet</p> : (
          <ul>
            {appointments.map(a => (
              <li key={a.id}>{new Date(a.appointment_time).toLocaleString()} — client id: {a.client_id} — {a.status}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
