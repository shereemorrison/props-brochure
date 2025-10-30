import React, { useState } from 'react';
import WebGLProgram from './WebGLProgram';
import DetailPage from './DetailPage';
import { performances, Performance } from '../data/performances';

function LandingPage() {
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);
  const [hasReturnedFromPage, setHasReturnedFromPage] = useState(false);

  const handlePageClick = (pageIndex: number) => {
    const performanceMap = [
      'act1', 'act2', 'act3', 'act4', 'acknowledgements', 'contact'
    ];
    
    if (pageIndex < performanceMap.length) {
      const performanceId = performanceMap[pageIndex];
      const performance = performances.find(p => p.id === performanceId);
      if (performance) {
        setSelectedPerformance(performance);
      }
    }
  };

  const handleBack = () => {
    setSelectedPerformance(null);
    setHasReturnedFromPage(true);
  };

  if (selectedPerformance) {
    return (
      <DetailPage 
        performance={selectedPerformance} 
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="wrapper">
      <header className="landing-header">
        <div className="header-title" style={{display: 'flex', alignItems: 'center'}}>
          <img 
            src={new URL('../assets/propstheatrelogo.webp', import.meta.url).toString()} 
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
        skipAnimation={hasReturnedFromPage}
      />
    </div>
  );
}

export default LandingPage;

