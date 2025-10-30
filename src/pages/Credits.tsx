import React from 'react';
import { useNavigate } from 'react-router-dom';
import { performances } from '../data/performances';

export default function Credits() {
  const navigate = useNavigate();
  const perf = performances.find(p => p.id === 'acknowledgements');
  if (!perf) return null;
  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <div className="detail-content">
        <h1>{perf.title}</h1>
        <p>{perf.blurb}</p>
        {/* Acknowledgements-specific layout can be refined here */}
      </div>
    </div>
  );
}

