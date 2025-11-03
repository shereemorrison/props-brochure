import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Credits() {
  const navigate = useNavigate();
  
  return (
    <div className="detail-page">
      <button 
        className="back-button" 
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
      <div className="detail-content" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: 'clamp(2rem, 5vh, 4rem) clamp(1rem, 3vw, 2rem)'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          marginBottom: 'clamp(1rem, 3vh, 2rem)',
          fontFamily: 'var(--font-heading)'
        }}>
          Onwards to 2026
        </h1>
        <h2 style={{ 
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          color: '#ffd700',
          marginBottom: 'clamp(1.5rem, 4vh, 2.5rem)',
          fontFamily: 'var(--font-heading)',
          fontWeight: 600
        }}>
          Coming Soon
        </h2>
        <p style={{ 
          fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
          color: 'rgba(255, 255, 255, 0.8)',
          fontFamily: 'var(--font-body)',
          maxWidth: '600px',
          lineHeight: 1.6
        }}>
          What's next news will go here
        </p>
      </div>
    </div>
  );
}

