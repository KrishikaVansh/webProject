import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AppointmentsPage(){
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(()=>{ load(); }, []);

  async function load(){
    const t = (await api.get('/api/therapists')).data;
    setTherapists(t);
    const appts = (await api.get('/api/appointments')).data;
    setAppointments(appts.asClient || appts);
  }

  async function viewAvailability(id){
    setSelectedTherapist(id);
    const res = await api.get(`/api/therapists/${id}/availability`);
    // backend stores availability JSON; transform into simple time slots for UI.
    const availability = res.data.availability || res.data; // try both shapes
    // We'll flatten to day->ranges, but show as text for simple booking
    setSlots(Object.entries(availability || {}).map(([day, range])=> ({ day, range })));
  }

  async function bookSlot(slotText){
    // For simplicity ask user for date/time manually:
    const time = prompt('Enter appointment date/time (YYYY-MM-DD HH:mm:ss)', '');
    if (!time) return;
    await api.post('/api/appointments', { therapist_id: selectedTherapist, appointment_time: time });
    alert('Booked — refresh to see it');
    load();
  }

  async function cancel(id){
    if (!window.confirm('Cancel appointment?')) return;
    await api.delete(`/api/appointments/${id}`);
    load();
  }

  return (
    <div>
      <h1>Appointments</h1>
      <div className="card">
        <h3>Book a therapist</h3>
        <div className="grid">
          {therapists.map(t=>(
            <div key={t.id} className="mini-card">
              <h4>{t.name}</h4>
              <p className="muted">{t.email}</p>
              <button className="btn-ghost" onClick={()=>viewAvailability(t.id)}>View availability</button>
            </div>
          ))}
        </div>

        {selectedTherapist && (
          <div className="card">
            <h4>Availability</h4>
            {slots.length===0 ? <p>No availability data</p> : (
              <ul>
                {slots.map((s,i)=>(
                  <li key={i}>
                    <strong>{s.day}</strong>: {JSON.stringify(s.range)} <button onClick={()=>bookSlot(JSON.stringify(s.range))} className="btn">Book</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Your appointments</h3>
        {appointments.length===0 ? <p>No appointments</p> : (
          <ul>
            {appointments.map(a=>(
              <li key={a.id}>
                {new Date(a.appointment_time).toLocaleString()} — with therapist #{a.therapist_id} — {a.status}
                <button className="btn-ghost" onClick={()=>cancel(a.id)}>Cancel</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
