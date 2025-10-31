import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebGLProgram from './WebGLProgram';
import { Performance } from '../../data/performances';
import Header from '../../components/Header';

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
      '/day/monday-24th', 
      '/day/tuesday-25th', 
      '/day/wednesday-26th', 
      '/day/thursday-27th', 
      '/acknowledgements', 
      '/contact'
    ];
    if (pageIndex >= 0 && pageIndex < routes.length) {
      navigate(routes[pageIndex]);
    }
  };

  const handleBack = () => {};

  return (
    <div className="wrapper">
      <Header />

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

