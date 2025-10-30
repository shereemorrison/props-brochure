import React from 'react';
import { useNavigate } from 'react-router-dom';
import { performances } from '../data/performances';

export default function ActOne() {
  const navigate = useNavigate();
  const perf = performances.find(p => p.id === 'act1');
  if (!perf) return null;
  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <div className="detail-content">
        <h1>{perf.title}</h1>
        <div className="detail-subtitle">{perf.day} • {perf.time}</div>
        <p>{perf.blurb}</p>
        <div style={{ marginBottom: 'clamp(2rem, 5vh, 3rem)' }}>
          <h2>Cast & Crew</h2>
          <div className="cast-grid">
            {perf.cast.map((member, i) => (
              <div key={i} style={{
                background: 'rgba(255, 215, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                borderRadius: 'clamp(8px, 1.5vw, 10px)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                <div style={{ fontWeight: 'bold', color: '#ffd700', fontFamily: "Bungee, 'Playfair Display', serif" }}>{member.name}</div>
                <div style={{ color: '#ffffff', opacity: 0.8, fontFamily: "Bungee, 'Playfair Display', serif" }}>{member.role}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>Awards & Recognition</h2>
          <div className="awards-grid">
            {perf.awards.map((award, i) => (
              <div key={i} style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                color: '#000000',
                padding: 'clamp(1rem, 2.5vw, 1.5rem)',
                borderRadius: 'clamp(10px, 2vw, 15px)',
                textAlign: 'center',
                boxShadow: '0 6px 20px rgba(255, 215, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)' }}>{award.icon}</div>
                <div style={{ fontWeight: 'bold', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)', fontFamily: "Bungee, 'Playfair Display', serif" }}>{award.name}</div>
                <div style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', opacity: 0.8, fontFamily: "Bungee, 'Playfair Display', serif" }}>{award.recipient}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

