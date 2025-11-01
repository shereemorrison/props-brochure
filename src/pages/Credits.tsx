import React from 'react';
import { useNavigate } from 'react-router-dom';
import { performances } from '../data/performances';
import { getAllGalleryImages } from '../data/gallery';
import DomeGallery from '../components/DomeGallery';

export default function Credits() {
  const navigate = useNavigate();
  const perf = performances.find(p => p.id === 'acknowledgements');
  
  // Get all unique images from all stages
  const allImages = getAllGalleryImages();
  
  return (
    <div className="detail-page credits-page" style={{ padding: 0 }}>
      <button 
        className="back-button" 
        onClick={() => navigate('/')}
        style={{ zIndex: 1000 }}
      >
        ← Back
      </button>
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <DomeGallery 
          images={allImages}
          fit={0.5}
          fitBasis="auto"
          minRadius={400}
          maxRadius={Infinity}
          padFactor={0.2}
          overlayBlurColor="#060010"
          maxVerticalRotationDeg={5}
          dragSensitivity={20}
          enlargeTransitionMs={300}
          segments={35}
          dragDampening={2}
          openedImageWidth="min(80vw, 600px)"
          openedImageHeight="min(80vh, 600px)"
          imageBorderRadius="20px"
          openedImageBorderRadius="30px"
          grayscale={false}
        />
      </div>
    </div>
  );
}

