import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();
  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate('/')}>← Back</button>
      <div className="detail-content">
        <h1>Contact</h1>
        <p>Please reach out via Instagram or our website.</p>
        <div className="header-links">
          <a href="https://www.propstheatre.com.au/" target="_blank" rel="noreferrer">Website</a>
          <a href="https://www.instagram.com/propstheatre/" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </div>
    </div>
  );
}

