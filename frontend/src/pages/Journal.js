// import React, { useEffect, useState } from 'react';
// import api from '../services/api';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// export default function Journal(){
//   const [entries, setEntries] = useState([]);
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');

//   async function fetchEntries(){
//     const res = await api.get('/api/journal');
//     setEntries(res.data || []);
//   }

//   useEffect(()=>{ fetchEntries(); }, []);

//   async function addEntry(e){
//     e.preventDefault();
//     await api.post('/api/journal', { title, content });
//     setTitle(''); setContent('');
//     fetchEntries();
//   }

//   async function removeEntry(id){
//     if (!window.confirm('Delete this entry?')) return;
//     await api.delete(`/api/journal/${id}`);
//     fetchEntries();
//   }

//   return (
//     <div>
//       <h1>Journal</h1>
//       <div className="card">
//         <form onSubmit={addEntry}>
//           <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
//           <ReactQuill value={content} onChange={setContent} />
//           <button className="btn">Save</button>
//         </form>
//       </div>

//       <div className="card">
//         <h3>Your entries</h3>
//         {entries.map(en => (
//           <div key={en.id} className="entry">
//             <h4>{en.title}</h4>
//             <div dangerouslySetInnerHTML={{ __html: en.content }} />
//             <div className="entry-actions">
//               <button className="btn-ghost" onClick={()=>removeEntry(en.id)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import api from '../services/api';

/**
 * Journal page (plain textarea, no react-quill)
 * - Create entries (title + plain content)
 * - List entries and allow delete
 */

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchEntries() {
    try {
      setLoading(true);
      const res = await api.get('/api/journal');
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch journal entries', err);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  async function addEntry(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please provide title and content.');
      return;
    }
    try {
      await api.post('/api/journal', { title: title.trim(), content: content.trim() });
      setTitle('');
      setContent('');
      fetchEntries();
    } catch (err) {
      console.error('Failed to save entry', err);
      alert(err.response?.data?.message || 'Failed to save');
    }
  }

  async function deleteEntry(id) {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.delete(`/api/journal/${id}`);
      fetchEntries();
    } catch (err) {
      console.error('Failed to delete', err);
      alert('Delete failed');
    }
  }

  return (
    <div>
      <h1>Journal</h1>

      <div className="card">
        <form onSubmit={addEntry} className="form">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn" type="submit">Save</button>
            <button type="button" className="btn-ghost" onClick={() => { setTitle(''); setContent(''); }}>Clear</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Your entries</h3>
        {loading ? <div className="center">Loading…</div> : (
          entries.length === 0 ? <p className="muted">No journal entries yet.</p> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {entries.map((en) => (
                <div className="entry" key={en.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>{en.title}</h4>
                    <div className="muted">{(en.created_at || '').slice(0,10)}</div>
                  </div>
                  <p style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{en.content}</p>
                  <div className="entry-actions" style={{ marginTop: 8 }}>
                    <button className="btn-ghost" onClick={() => deleteEntry(en.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
