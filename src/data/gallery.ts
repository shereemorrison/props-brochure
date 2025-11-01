// Gallery images for each stage
// Images are imported from assets and bundled with the app

// Import all images dynamically using Vite's glob import
const stageoneImages = import.meta.glob('../assets/images/stageone/*.webp', { eager: true });
const stagetwoImages = import.meta.glob('../assets/images/stagetwo/*.webp', { eager: true });
const stagethreeImages = import.meta.glob('../assets/images/stagethree/*.webp', { eager: true });

// Helper to convert glob results to sorted array of paths
function getSortedImagePaths(images: Record<string, any>): string[] {
  return Object.values(images)
    .map((img: any) => img.default || img)
    .filter((path: string) => path && typeof path === 'string')
    .sort((a: string, b: string) => {
      // Extract numbers from filenames for proper sorting
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });
}

// Get all images sorted by filename number
const allStageoneImages = getSortedImagePaths(stageoneImages).filter((path: string) => 
  !path.includes(' copy') // Exclude "copy" files
);
const allStagetwoImages = getSortedImagePaths(stagetwoImages).filter((path: string) => 
  !path.includes(' copy') // Exclude "copy" files
);
const allStagethreeImages = getSortedImagePaths(stagethreeImages).filter((path: string) => 
  !path.includes(' copy') // Exclude "copy" files
);

// For backwards compatibility with stage pages, keep first 8 images
const stageone1 = allStageoneImages[0];
const stageone2 = allStageoneImages[1];
const stageone3 = allStageoneImages[2];
const stageone4 = allStageoneImages[3];
const stageone5 = allStageoneImages[4];
const stageone6 = allStageoneImages[5];
const stageone7 = allStageoneImages[6];
const stageone8 = allStageoneImages[7];

const stagetwo2 = allStagetwoImages.find((p: string) => p.includes('stagetwo2')) || allStagetwoImages[0];
const stagetwo4 = allStagetwoImages.find((p: string) => p.includes('stagetwo4')) || allStagetwoImages[1];
const stagetwo5 = allStagetwoImages.find((p: string) => p.includes('stagetwo5')) || allStagetwoImages[2];
const stagetwo6 = allStagetwoImages.find((p: string) => p.includes('stagetwo6')) || allStagetwoImages[3];
const stagetwo7 = allStagetwoImages.find((p: string) => p.includes('stagetwo7')) || allStagetwoImages[4];
const stagetwo8 = allStagetwoImages.find((p: string) => p.includes('stagetwo8')) || allStagetwoImages[5];
const stagetwo9 = allStagetwoImages.find((p: string) => p.includes('stagetwo9')) || allStagetwoImages[6];
const stagetwo10 = allStagetwoImages.find((p: string) => p.includes('stagetwo10')) || allStagetwoImages[7];

const stagethree2 = allStagethreeImages.find((p: string) => p.includes('stagethree2')) || allStagethreeImages[0];
const stagethree4 = allStagethreeImages.find((p: string) => p.includes('stagethree4')) || allStagethreeImages[1];
const stagethree5 = allStagethreeImages.find((p: string) => p.includes('stagethree5')) || allStagethreeImages[2];
const stagethree6 = allStagethreeImages.find((p: string) => p.includes('stagethree6')) || allStagethreeImages[3];
const stagethree7 = allStagethreeImages.find((p: string) => p.includes('stagethree7')) || allStagethreeImages[4];
const stagethree8 = allStagethreeImages.find((p: string) => p.includes('stagethree8')) || allStagethreeImages[5];
const stagethree9 = allStagethreeImages.find((p: string) => p.includes('stagethree9')) || allStagethreeImages[6];
const stagethree10 = allStagethreeImages.find((p: string) => p.includes('stagethree10')) || allStagethreeImages[7];

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
  
  // Include all images from all three stages (excluding "copy" files)
  allStageoneImages.forEach((path: string) => allImages.add(path));
  allStagetwoImages.forEach((path: string) => allImages.add(path));
  allStagethreeImages.forEach((path: string) => allImages.add(path));
  
  return Array.from(allImages);
}

