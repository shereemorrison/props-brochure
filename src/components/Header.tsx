import React from 'react';
import logoImage from '../assets/propstheatrelogo.webp';

interface HeaderProps {
  fixed?: boolean;
}

export default function Header({ fixed = false }: HeaderProps) {
  return (
    <header className={`landing-header ${fixed ? 'header-fixed' : ''}`}>
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
    </header>
  );
}
