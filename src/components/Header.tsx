import React from 'react';
import logoImage from '../assets/propstheatrelogo.webp';

interface HeaderProps {
  fixed?: boolean;
}

export default function Header({ fixed = false }: HeaderProps) {
  // Only override positioning if fixed is true, otherwise use CSS defaults
  const headerStyle = fixed ? {
    position: 'fixed' as const,
    zIndex: 101,
    pointerEvents: 'auto' as const
  } : undefined;

  return (
    <header className="landing-header" style={headerStyle}>
      <div className="header-title" style={{
        display: 'flex', 
        alignItems: 'center',
        fontSize: '0', // Hide any text content
        lineHeight: '0'
      }}>
        <img 
          src={logoImage}
          alt="Props Theatre" 
          style={{
            height: 'clamp(84px, 15vw, 144px)', 
            width: 'auto', 
            display: 'block',
            maxWidth: '100%',
            objectFit: 'contain'
          }}
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
  );
}
