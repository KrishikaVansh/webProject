import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Resources(){
  const [resources, setResources] = useState([]);

  useEffect(()=>{
    api.get('/api/resources').then(res=>setResources(res.data || []));
  }, []);

  return (
    <div>
      <h1>Resources</h1>
      <div className="grid">
        {resources.map(r => (
          <div key={r.id} className="resource-card card">
            <h3>{r.title}</h3>
            <p className="muted">{r.category}</p>
            <p>{r.description}</p>
            <a href={r.video_url} target="_blank" rel="noreferrer" className="btn-ghost">Watch</a>
          </div>
        ))}
      </div>
    </div>
  );
}
