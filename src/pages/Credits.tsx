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
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        maxWidth: '900px',
        margin: '0 auto',
        padding: 'clamp(2rem, 5vh, 4rem) clamp(1rem, 3vw, 2rem)',
        textAlign: 'left'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          marginBottom: 'clamp(0.5rem, 1vh, 1rem)',
          fontFamily: 'var(--font-heading)',
          width: '100%',
          textAlign: 'center'
        }}>
          Looking forward to 2026
        </h1>
        
        <div style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          color: '#ffffff',
          marginBottom: 'clamp(2rem, 4vh, 3rem)',
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          width: '100%',
          textAlign: 'center'
        }}>
          Good Luck & Best Wishes!
        </div>

        <p style={{ 
          fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
          color: '#ffffff',
          fontFamily: 'var(--font-body)',
          lineHeight: 1.7,
          marginBottom: 'clamp(2rem, 4vh, 3rem)'
        }}>
          As we head into a brand new year, we have some exciting updates to share:
        </p>

        <section style={{ marginBottom: 'clamp(2rem, 4vh, 3rem)' }}>
          <h3 style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            color: '#ffd700',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
          }}>
            Staff Changes:
          </h3>
          <ul style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.8,
            paddingLeft: 'clamp(1.5rem, 3vw, 2rem)',
            listStyleType: 'disc'
          }}>
            <li style={{ marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)' }}>
              Paris is off on a new adventure to Kangaroo Island, where he'll be building his own home – we wish him all the best!
            </li>
            <li style={{ marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)' }}>
              Olivia will be taking some time for family, as she prepares to welcome her second baby – congratulations, Olivia!
            </li>
            <li style={{ marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)' }}>
              We're thrilled to welcome Becka to the team as our new Admin, and to celebrate the return of our wonderful Teacher Assistants – Sara, Darcy, and Matilda!
            </li>
            <li style={{ marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)' }}>
              Sharna and Alise will also be back, full of energy (and bells on)!
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: 'clamp(2rem, 4vh, 3rem)' }}>
          <h3 style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            color: '#ffd700',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
          }}>
            Student Enrolments for 2026
          </h3>
          <div style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.7
          }}>
            <p style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
              Your child's current enrolment will automatically roll over into 2026, unless you let us know otherwise.
            </p>
            <p style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
              If your child won't be returning, please contact us so we can share our love and well wishes – and open their spot for the next eager creative!
            </p>
            <ul style={{
              paddingLeft: 'clamp(1.5rem, 3vw, 2rem)',
              listStyleType: 'disc',
              marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
            }}>
              <li style={{ marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)' }}>
                Students aged 9 years (previously Stage One) will move up to Stage Two (ages 9–12 years) – please let us know which class day suits your family best.
              </li>
              <li style={{ marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)' }}>
                Students attending high school in 2026 will graduate to Stage Three (ages 13–16 years) – again, please let us know your preferred class day.
              </li>
            </ul>
            <p style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
              The program structure remains the same, so please select your 2026 class from the timetable available on our{' '}
              <a 
                href="https://www.propstheatre.com.au/program" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#ffd700', textDecoration: 'underline' }}
              >
                www.propstheatre.com.au/program
              </a>
            </p>
          </div>
        </section>

        <section>
          <h3 style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            color: '#ffd700',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
          }}>
            Looking to join us?
          </h3>
          <div style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.7
          }}>
            <p style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
              Please fill out an enrolment form via the website{' '}
              <a 
                href="https://www.propstheatre.com.au" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#ffd700', textDecoration: 'underline' }}
              >
                www.propstheatre.com.au
              </a>
            </p>
            <p>
              We will be in touch once reenrolments have been processed to ensure your chosen place is available!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

