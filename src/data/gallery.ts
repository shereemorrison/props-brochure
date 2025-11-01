// Gallery images for each stage
// Images are imported from assets and bundled with the app

import stageone1 from '../assets/images/stageone/stageone1.webp';
import stageone2 from '../assets/images/stageone/stageone2.webp';
import stageone3 from '../assets/images/stageone/stageone3.webp';
import stageone4 from '../assets/images/stageone/stageone4.webp';
import stageone5 from '../assets/images/stageone/stageone5.webp';
import stageone6 from '../assets/images/stageone/stageone6.webp';
import stageone7 from '../assets/images/stageone/stageone7.webp';
import stageone8 from '../assets/images/stageone/stageone8.webp';
import stageone9 from '../assets/images/stageone/stageone9.webp';
import stageone10 from '../assets/images/stageone/stageone10.webp';

import stagetwo2 from '../assets/images/stagetwo/stagetwo2.webp';
import stagetwo4 from '../assets/images/stagetwo/stagetwo4.webp';
import stagetwo5 from '../assets/images/stagetwo/stagetwo5.webp';
import stagetwo6 from '../assets/images/stagetwo/stagetwo6.webp';
import stagetwo7 from '../assets/images/stagetwo/stagetwo7.webp';
import stagetwo8 from '../assets/images/stagetwo/stagetwo8.webp';
import stagetwo9 from '../assets/images/stagetwo/stagetwo9.webp';
import stagetwo10 from '../assets/images/stagetwo/stagetwo10.webp';

import stagethree2 from '../assets/images/stagethree/stagethree2.webp';
import stagethree4 from '../assets/images/stagethree/stagethree4.webp';
import stagethree5 from '../assets/images/stagethree/stagethree5.webp';
import stagethree6 from '../assets/images/stagethree/stagethree6.webp';
import stagethree7 from '../assets/images/stagethree/stagethree7.webp';
import stagethree8 from '../assets/images/stagethree/stagethree8.webp';
import stagethree9 from '../assets/images/stagethree/stagethree9.webp';
import stagethree10 from '../assets/images/stagethree/stagethree10.webp';

// Gallery item interface
export interface GalleryImage {
  id: string;
  path: string;
}

// Gallery data organized by stage ID
export const galleryImages: Record<string, GalleryImage[]> = {
  // Stage One images
  'stage-one-monday': [
    { id: 'stageone1', path: stageone1 },
    { id: 'stageone2', path: stageone2 },
    { id: 'stageone3', path: stageone3 },
    { id: 'stageone4', path: stageone4 },
    { id: 'stageone5', path: stageone5 },
    { id: 'stageone6', path: stageone6 },
    { id: 'stageone7', path: stageone7 },
    { id: 'stageone8', path: stageone8 },
  ],
  'stage-one-tuesday': [
    { id: 'stageone1', path: stageone1 },
    { id: 'stageone2', path: stageone2 },
    { id: 'stageone3', path: stageone3 },
    { id: 'stageone4', path: stageone4 },
    { id: 'stageone5', path: stageone5 },
    { id: 'stageone6', path: stageone6 },
    { id: 'stageone7', path: stageone7 },
    { id: 'stageone8', path: stageone8 },
  ],
  'stage-one-wednesday': [
    { id: 'stageone1', path: stageone1 },
    { id: 'stageone2', path: stageone2 },
    { id: 'stageone3', path: stageone3 },
    { id: 'stageone4', path: stageone4 },
    { id: 'stageone5', path: stageone5 },
    { id: 'stageone6', path: stageone6 },
    { id: 'stageone7', path: stageone7 },
    { id: 'stageone8', path: stageone8 },
  ],
  'stage-one-thursday': [
    { id: 'stageone1', path: stageone1 },
    { id: 'stageone2', path: stageone2 },
    { id: 'stageone3', path: stageone3 },
    { id: 'stageone4', path: stageone4 },
    { id: 'stageone5', path: stageone5 },
    { id: 'stageone6', path: stageone6 },
    { id: 'stageone7', path: stageone7 },
    { id: 'stageone8', path: stageone8 },
  ],
  
  // Stage Two images
  'stage-two-monday': [
    { id: 'stagetwo2', path: stagetwo2 },
    { id: 'stagetwo4', path: stagetwo4 },
    { id: 'stagetwo5', path: stagetwo5 },
    { id: 'stagetwo6', path: stagetwo6 },
    { id: 'stagetwo7', path: stagetwo7 },
    { id: 'stagetwo8', path: stagetwo8 },
    { id: 'stagetwo9', path: stagetwo9 },
    { id: 'stagetwo10', path: stagetwo10 },
  ],
  'stage-two-tuesday': [
    { id: 'stagetwo2', path: stagetwo2 },
    { id: 'stagetwo4', path: stagetwo4 },
    { id: 'stagetwo5', path: stagetwo5 },
    { id: 'stagetwo6', path: stagetwo6 },
    { id: 'stagetwo7', path: stagetwo7 },
    { id: 'stagetwo8', path: stagetwo8 },
    { id: 'stagetwo9', path: stagetwo9 },
    { id: 'stagetwo10', path: stagetwo10 },
  ],
  'stage-two-wednesday': [
    { id: 'stagetwo2', path: stagetwo2 },
    { id: 'stagetwo4', path: stagetwo4 },
    { id: 'stagetwo5', path: stagetwo5 },
    { id: 'stagetwo6', path: stagetwo6 },
    { id: 'stagetwo7', path: stagetwo7 },
    { id: 'stagetwo8', path: stagetwo8 },
    { id: 'stagetwo9', path: stagetwo9 },
    { id: 'stagetwo10', path: stagetwo10 },
  ],
  'stage-two-thursday-our-space': [
    { id: 'stagetwo2', path: stagetwo2 },
    { id: 'stagetwo4', path: stagetwo4 },
    { id: 'stagetwo5', path: stagetwo5 },
    { id: 'stagetwo6', path: stagetwo6 },
    { id: 'stagetwo7', path: stagetwo7 },
    { id: 'stagetwo8', path: stagetwo8 },
    { id: 'stagetwo9', path: stagetwo9 },
    { id: 'stagetwo10', path: stagetwo10 },
  ],
  'stage-two-thursday-bad-side': [
    { id: 'stagetwo2', path: stagetwo2 },
    { id: 'stagetwo4', path: stagetwo4 },
    { id: 'stagetwo5', path: stagetwo5 },
    { id: 'stagetwo6', path: stagetwo6 },
    { id: 'stagetwo7', path: stagetwo7 },
    { id: 'stagetwo8', path: stagetwo8 },
    { id: 'stagetwo9', path: stagetwo9 },
    { id: 'stagetwo10', path: stagetwo10 },
  ],
  'stage-two-thursday-pirated': [
    { id: 'stagetwo2', path: stagetwo2 },
    { id: 'stagetwo4', path: stagetwo4 },
    { id: 'stagetwo5', path: stagetwo5 },
    { id: 'stagetwo6', path: stagetwo6 },
    { id: 'stagetwo7', path: stagetwo7 },
    { id: 'stagetwo8', path: stagetwo8 },
    { id: 'stagetwo9', path: stagetwo9 },
    { id: 'stagetwo10', path: stagetwo10 },
  ],
  
  // Stage Three images
  'stage-three-monday': [
    { id: 'stagethree2', path: stagethree2 },
    { id: 'stagethree4', path: stagethree4 },
    { id: 'stagethree5', path: stagethree5 },
    { id: 'stagethree6', path: stagethree6 },
    { id: 'stagethree7', path: stagethree7 },
    { id: 'stagethree8', path: stagethree8 },
    { id: 'stagethree9', path: stagethree9 },
    { id: 'stagethree10', path: stagethree10 },
  ],
  'stage-three-tuesday': [
    { id: 'stagethree2', path: stagethree2 },
    { id: 'stagethree4', path: stagethree4 },
    { id: 'stagethree5', path: stagethree5 },
    { id: 'stagethree6', path: stagethree6 },
    { id: 'stagethree7', path: stagethree7 },
    { id: 'stagethree8', path: stagethree8 },
    { id: 'stagethree9', path: stagethree9 },
    { id: 'stagethree10', path: stagethree10 },
  ],
  'stage-three-wednesday': [
    { id: 'stagethree2', path: stagethree2 },
    { id: 'stagethree4', path: stagethree4 },
    { id: 'stagethree5', path: stagethree5 },
    { id: 'stagethree6', path: stagethree6 },
    { id: 'stagethree7', path: stagethree7 },
    { id: 'stagethree8', path: stagethree8 },
    { id: 'stagethree9', path: stagethree9 },
    { id: 'stagethree10', path: stagethree10 },
  ],
};

// Helper function to get gallery images for a stage
export function getGalleryImages(stageId: string): string[] {
  const images = galleryImages[stageId];
  if (!images) {
    console.warn(`No gallery images found for stage: ${stageId}`);
    return [];
  }
  return images.map(img => img.path);
}

// Helper function to get all unique images from all stages (for gallery/credits page)
export function getAllGalleryImages(): string[] {
  const allImages = new Set<string>();
  
  // Collect all image paths from all stages
  Object.values(galleryImages).forEach(stageImages => {
    stageImages.forEach(img => {
      if (img.path) {
        allImages.add(img.path);
      }
    });
  });
  
  return Array.from(allImages);
}

