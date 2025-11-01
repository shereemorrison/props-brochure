import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();
  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate('/')}>← Back</button>
      <div className="detail-content">
        <h1>Contact</h1>
        
        <div className="contact-section">
          <h2>Alise</h2>
          <div className="contact-info">
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:admin@propstheatre.com.au" className="contact-link">
                admin@propstheatre.com.au
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{' '}
              <a href="tel:+61354433462" className="contact-link">
                03 5443 3462
              </a>
            </p>
            <p>
              <strong>Address:</strong> 82A Mitchell St, Bendigo VIC 3550
            </p>
          </div>
        </div>

        <div className="contact-section">
          <h2>Connect With Us</h2>
          <p>Please reach out via Instagram or our website.</p>
          <div className="social-links">
            <a 
              href="https://www.propstheatre.com.au/" 
              target="_blank" 
              rel="noreferrer"
              className="social-link"
            >
              Website
            </a>
            <a 
              href="https://www.instagram.com/propstheatre/" 
              target="_blank" 
              rel="noreferrer"
              className="social-link"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

