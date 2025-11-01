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
  
  // Debug logging
  React.useEffect(() => {
    console.log('[Credits] allImages:', allImages.length, 'images');
    if (allImages.length > 0) {
      console.log('[Credits] First few image paths:', allImages.slice(0, 3));
    } else {
      console.warn('[Credits] No images found! Check gallery.ts');
    }
  }, [allImages]);
  
  // Show message if no images
  if (allImages.length === 0) {
    return (
      <div className="detail-page credits-page" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
          <h2>No images found</h2>
          <p>Please check that images exist in src/assets/images/stageone, stagetwo, and stagethree folders.</p>
          <button 
            className="back-button" 
            onClick={() => navigate('/')}
            style={{ marginTop: '2rem' }}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }
  
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

