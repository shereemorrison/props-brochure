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
            >
              <h2>{stage.stageNumber}</h2>
              <h3>{stage.title}</h3>
              <p>{stage.summary}</p>
            </div>
          ))}
        </div>

        {dayData.hasThankYou && (
          <div className="thank-you-section">
            <h2>Thank You</h2>
            <p>Thank you to staff and helpers</p>
          </div>
        )}
      </div>
    </div>
  );
}

