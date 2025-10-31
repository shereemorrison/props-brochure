const fs = require('fs');
const path = require('path');

/**
 * Script to optimize WebP images for menu thumbnails
 * 
 * Requirements:
 * - Install sharp: npm install sharp
 * - Or use cwebp command line tool
 * 
 * Usage: node scripts/optimize-menu-images.js
 */

const sharp = require('sharp');
const theatreDir = path.join(__dirname, '../public/theatre');

async function optimizeImages() {
  console.log('🖼️  Optimizing menu images...\n');
  
  // Target dimensions for menu thumbnails (2:3 aspect ratio, 2x for retina)
  const targetWidth = 300; // 150px * 2 = 300px for retina
  const targetHeight = 450; // 225px * 2 = 450px for retina
  
  // Quality settings
  const quality = 80; // Good balance between quality and file size
  
  const files = fs.readdirSync(theatreDir).filter(file => file.endsWith('.webp'));
  
  if (files.length === 0) {
    console.log('❌ No WebP files found in public/theatre/');
    return;
  }
  
  // Create backup directory
  const backupDir = path.join(theatreDir, 'backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('📁 Created backup directory\n');
  }
  
  for (const file of files) {
    const inputPath = path.join(theatreDir, file);
    const backupPath = path.join(backupDir, file);
    const outputPath = path.join(theatreDir, file);
    
    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSize = originalStats.size;
      
      // Backup original
      fs.copyFileSync(inputPath, backupPath);
      console.log(`📦 Backed up ${file}`);
      
      // Optimize image
      await sharp(inputPath)
        .resize(targetWidth, targetHeight, {
          fit: 'cover', // Cover the area, may crop slightly
          position: 'center'
        })
        .webp({ 
          quality: quality,
          effort: 6 // Higher effort = better compression but slower
        })
        .toFile(outputPath);
      
      // Get new file size
      const newStats = fs.statSync(outputPath);
      const newSize = newStats.size;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${file}:`);
      console.log(`   Before: ${(originalSize / 1024).toFixed(1)}KB`);
      console.log(`   After:  ${(newSize / 1024).toFixed(1)}KB`);
      console.log(`   Saved:  ${savings}%`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      // Restore from backup if optimization failed
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, inputPath);
        console.log(`   Restored from backup\n`);
      }
    }
  }
  
  console.log('✨ Optimization complete!');
  console.log(`📁 Original files backed up to: ${backupDir}`);
  console.log('\n💡 If you\'re happy with the results, you can delete the backup folder.');
}

// Check if sharp is available
try {
  require.resolve('sharp');
  optimizeImages().catch(console.error);
} catch (e) {
  console.log('❌ Sharp not installed. Installing...\n');
  console.log('Please run: npm install sharp');
  console.log('Then run this script again.\n');
  console.log('Alternatively, you can use online tools like:');
  console.log('  - https://squoosh.app/');
  console.log('  - https://tinypng.com/');
  console.log('\nTarget settings:');
  console.log('  - Dimensions: 300x450px (2:3 aspect ratio)');
  console.log('  - Format: WebP');
  console.log('  - Quality: 75-80');
}

