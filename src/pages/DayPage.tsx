import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { days } from '../data/performances';

export default function DayPage() {
  const navigate = useNavigate();
  const { dayId } = useParams<{ dayId: string }>();
  
  const dayData = days.find(d => d.id === dayId);
  
  if (!dayData) {
    return (
      <div className="detail-page">
        <button className="back-button" onClick={() => navigate('/')}>← Back</button>
        <div className="detail-content">
          <h1>Day not found</h1>
        </div>
      </div>
    );
  }

  const handleStageClick = (stageId: string) => {
    navigate(`/stage/${stageId}`);
  };

  return (
    <div className="detail-page day-page">
      <button className="back-button" onClick={() => navigate('/')}>← Back</button>
      <div className="detail-content">
        <h1>{dayData.day}</h1>
        <div className="detail-subtitle">{dayData.year}</div>
        
        <div className="stages-grid">
          {dayData.stages.map((stage) => (
            <div 
              key={stage.id} 
              className="stage-card"
              onClick={() => handleStageClick(stage.id)}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '2 / 1',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 'clamp(10px, 2vw, 16px)',
                border: '2px solid rgba(255, 215, 0, 0.5)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                maxWidth: 'clamp(140px, 25vw, 220px)',
                minWidth: 'clamp(100px, 20vw, 140px)',
                margin: '0 auto',
                backgroundColor: 'rgba(255, 215, 0, 0.05)',
                justifySelf: 'center'
              }}
            >
              <div className="stage-card-content">
                <h2>{stage.stageNumber}</h2>
                <h3>{stage.title}</h3>
              </div>
            </div>
          ))}
          
          {dayData.hasThankYou && (
            <div 
              className="thank-you-card"
              onClick={() => navigate('/thank-you')}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '2 / 1',
                overflow: 'hidden',
                borderRadius: 'clamp(10px, 2vw, 16px)',
                border: '2px solid rgba(255, 215, 0, 0.5)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                maxWidth: 'clamp(140px, 25vw, 220px)',
                minWidth: 'clamp(100px, 20vw, 140px)',
                margin: '0 auto',
                backgroundColor: 'rgba(255, 215, 0, 0.05)',
                justifySelf: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div className="stage-card-content">
                <h2 style={{ color: '#ffffff', fontFamily: 'var(--font-heading)', margin: 0 }}>Thank You</h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

