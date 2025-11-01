import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <div className="detail-content">
        <h1>Thank You</h1>
        <p>Acknowledgments will go here</p>
      </div>
    </div>
  );
}

