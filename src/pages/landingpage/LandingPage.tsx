import React, { useEffect, useState, useCallback } from 'react';
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
    console.log("[DEBUG] LandingPage mounted", { skipAnimation });
    // Mark this tab session as having animated once; back navigation will skip
    (window as any).__landingAnimatedOnce = true;
    
    return () => {
      console.log("[DEBUG] LandingPage unmounting");
    };
  }, []);

  const handlePageClick = useCallback((pageIndex: number) => {
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
  }, [navigate]);

  const handleBack = () => {};

  return (
    <div className="wrapper">
      <Header />

      {/* <footer className="landing-footer">
        //TODO: Add footer
      </footer> */}

      <WebGLProgram 
        onPageClick={handlePageClick} 
        skipAnimation={skipAnimation}
      />
    </div>
  );
}

export default LandingPage;

