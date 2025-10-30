import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebGLProgram from './WebGLProgram';
import { Performance } from '../../data/performances';

function LandingPage() {
  const navigate = useNavigate();
  const [skipAnimation] = useState<boolean>(() => {
    return (window as any).__landingAnimatedOnce === true;
  });

  useEffect(() => {
    // Mark this tab session as having animated once; back navigation will skip
    (window as any).__landingAnimatedOnce = true;
  }, []);

  const handlePageClick = (pageIndex: number) => {
    const routes = [
      '/act-one', '/act-two', '/act-three', '/act-four', '/acknowledgements', '/contact'
    ];
    if (pageIndex >= 0 && pageIndex < routes.length) {
      navigate(routes[pageIndex]);
    }
  };

  const handleBack = () => {};

  return (
    <div className="wrapper">
      <header className="landing-header">
        <div className="header-title" style={{display: 'flex', alignItems: 'center'}}>
          <img 
            src={new URL('../../assets/propstheatrelogo.webp', import.meta.url).toString()} 
            alt="Props Theatre" 
            style={{height: 'clamp(84px, 15vw, 144px)', width: 'auto', display: 'block'}}
          />
        </div>
        
        <div className="header-links">
          <a 
            href="https://www.propstheatre.com.au/" 
            target="_blank" 
            rel="noreferrer"
          >
            Website
          </a>
          <a 
            href="https://www.instagram.com/propstheatre/" 
            target="_blank" 
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      </header>

      <footer className="landing-footer">
        November 2025
      </footer>

      <WebGLProgram 
        onPageClick={handlePageClick} 
        skipAnimation={skipAnimation}
      />
    </div>
  );
}

export default LandingPage;

