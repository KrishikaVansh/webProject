// import React, { useEffect, useState } from 'react';
// import api from '../services/api';
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import dayjs from 'dayjs';

// export default function MoodTracker(){
//   const [moods, setMoods] = useState([]);
//   const [rating, setRating] = useState(3);
//   const [notes, setNotes] = useState('');

//   async function fetchMoods(){
//     const res = await api.get('/api/mood');
//     setMoods(res.data || []);
//   }

//   useEffect(()=>{ fetchMoods(); }, []);

//   async function addMood(e){
//     e.preventDefault();
//     await api.post('/api/mood', { mood_rating: Number(rating), notes, entry_date: dayjs().format('YYYY-MM-DD') });
//     setNotes('');
//     fetchMoods();
//   }

//   const chartData = moods.slice().reverse().map(m => ({ date: dayjs(m.entry_date).format('DD MMM'), value: m.mood_rating }));

//   return (
//     <div>
//       <h1>Mood Tracker</h1>
//       <div className="card">
//         <form onSubmit={addMood} className="form">
//           <label>Rating: <input type="range" min="1" max="5" value={rating} onChange={e=>setRating(e.target.value)} /></label>
//           <div className="muted">Selected: {rating}</div>
//           <textarea placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)} />
//           <button className="btn">Save Mood</button>
//         </form>
//       </div>

//       <div className="card">
//         <h3>Recent moods</h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <LineChart data={chartData}>
//             <CartesianGrid stroke="#eee" />
//             <XAxis dataKey="date" />
//             <YAxis domain={[1,5]} ticks={[1,2,3,4,5]} />
//             <Tooltip />
//             <Line type="monotone" dataKey="value" stroke="#6CA6FF" strokeWidth={3} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="card">
//         <h3>Entries</h3>
//         <ul>
//           {moods.map(m=>(
//             <li key={m.id}><strong>{m.mood_rating}</strong> — {m.notes} <span className="muted">({m.entry_date})</span></li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import api from '../services/api';

/**
 * Simple Mood Tracker (no external libs)
 * - Adds a mood entry (rating 1-5 + optional notes)
 * - Fetches mood entries and shows a simple bar chart for the last 7 days
 * - Shows a list of recent entries
 */

function formatDateISO(date) {
  // returns YYYY-MM-DD
  return date.toISOString().slice(0, 10);
}

function lastNDates(n) {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(formatDateISO(d));
  }
  return arr;
}

export default function MoodTracker() {
  const [moods, setMoods] = useState([]);
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchMoods() {
    try {
      setLoading(true);
      const res = await api.get('/api/mood');
      setMoods(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load moods', err);
      setMoods([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMoods();
  }, []);

  async function addMood(e) {
    e.preventDefault();
    const entry_date = formatDateISO(new Date());
    try {
      await api.post('/api/mood', { mood_rating: Number(rating), notes: notes || '', entry_date });
      setNotes('');
      setRating(3);
      fetchMoods();
    } catch (err) {
      console.error('Failed to add mood', err);
      alert(err.response?.data?.message || 'Failed to save mood');
    }
  }

  // Prepare chart data for last 7 days
  const days = lastNDates(7);
  const mapByDate = {};
  // we'll show the latest rating per date (if multiple entries)
  for (const m of moods) {
    const dateKey = (m.entry_date || (m.created_at && m.created_at.slice(0, 10))) || formatDateISO(new Date());
    mapByDate[dateKey] = m; // latest in list will overwrite earlier ones (assuming server returns sorted desc)
  }
  const chartData = days.map((d) => {
    const entry = mapByDate[d];
    return { date: d, value: entry ? Number(entry.mood_rating) : 0, notes: entry ? entry.notes : '' };
  });

  return (
    <div>
      <h1>Mood Tracker</h1>

      <div className="card">
        <form onSubmit={addMood} className="form">
          <label>
            Rating: <strong>{rating}</strong>
          </label>
          <input
            className="range"
            type="range"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn" type="submit">Save Mood</button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => { setRating(3); setNotes(''); }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Last 7 days</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'end', padding: '12px 4px' }}>
          {chartData.map((d) => {
            const height = d.value ? (d.value / 5) * 120 + 20 : 8; // scale: min 8px
            return (
              <div key={d.date} style={{ textAlign: 'center', width: 48 }}>
                <div
                  title={d.notes || `${d.date} — ${d.value || 'no entry'}`}
                  style={{
                    height,
                    background: d.value ? 'linear-gradient(180deg,#6CA6FF,#4E8DF5)' : '#eef4ff',
                    borderRadius: 8,
                    transition: 'height .18s'
                  }}
                />
                <div style={{ marginTop: 6, fontSize: 12 }} className="muted">
                  {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                <div style={{ fontSize: 12, marginTop: 4 }}>{d.value || '-'}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3>Recent entries</h3>
        {loading ? <div className="center">Loading…</div> : (
          moods.length === 0 ? <p className="muted">No mood entries yet.</p> : (
            <ul>
              {moods.map((m) => (
                <li key={m.id}>
                  <strong>{m.mood_rating}</strong> — {m.notes || <span className="muted">no notes</span>} <span className="muted">({(m.entry_date || (m.created_at && m.created_at.slice(0,10)) || '').toString()})</span>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}

