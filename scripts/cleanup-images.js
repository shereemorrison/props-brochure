#!/usr/bin/env node

/**
 * Script to clean up and organize stage images
 * - Removes duplicates (keeps HD versions that are reasonable size)
 * - Filters out logo files
 * - Renames files sequentially: stageone1.webp, stageone2.webp, etc.
 */

const fs = require('fs');
const path = require('path');

const publicPath = path.join(__dirname, '..', 'public');
const stageFolders = [
  { name: 'stageone', prefix: 'stageone' },
  { name: 'stagetwo', prefix: 'stagetwo' },
  { name: 'stagethree', prefix: 'stagethree' }
];

// Maximum file size to keep (if HD is larger, keep low res)
const MAX_KEEP_SIZE = 800 * 1024; // 800KB

function isLogoFile(filename) {
  const logoPatterns = ['logo', 'PROPS', 'Props_Theatre', 'PROPS+THEATRE'];
  return logoPatterns.some(pattern => filename.toLowerCase().includes(pattern.toLowerCase()));
}

function getBaseName(filename) {
  // Remove _1, _2 suffixes and extensions for comparison
  return filename
    .replace(/_\d+\.(webp|jpg|png)$/i, '.$1')
    .replace(/\.(webp|jpg|png)$/i, '')
    .toLowerCase();
}

function findDuplicates(files, folderPath) {
  const groups = new Map();
  
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    const baseName = getBaseName(file);
    
    if (!groups.has(baseName)) {
      groups.set(baseName, []);
    }
    
    // Check if this is HD version (has _1 suffix or larger size)
    const isHD = file.includes('_1.') || file.match(/Clr_Low-\d+_1/);
    
    groups.get(baseName).push({
      filename: file,
      path: filePath,
      size: stats.size,
      isHD: isHD,
      baseName: baseName
    });
  });
  
  return groups;
}

function cleanFolder(folderConfig) {
  const folderPath = path.join(publicPath, folderConfig.name);
  
  if (!fs.existsSync(folderPath)) {
    console.log(`❌ Folder ${folderConfig.name} does not exist`);
    return { removed: 0, renamed: 0 };
  }
  
  console.log(`\n📁 Processing ${folderConfig.name}...`);
  
  const allFiles = fs.readdirSync(folderPath);
  const imageFiles = allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return (ext === '.webp' || ext === '.jpg' || ext === '.png') && !isLogoFile(file);
  });
  
  console.log(`   Found ${imageFiles.length} image files (excluding logos)`);
  
  // Find duplicates
  const duplicateGroups = findDuplicates(imageFiles, folderPath);
  let duplicatesRemoved = 0;
  const filesToKeep = [];
  
  duplicateGroups.forEach((variants, baseName) => {
    if (variants.length > 1) {
      // Sort: HD versions first, then by size (largest first)
      variants.sort((a, b) => {
        if (a.isHD !== b.isHD) return b.isHD - a.isHD; // HD first
        return b.size - a.size; // Then by size
      });
      
      // Keep the best version (HD if reasonable size, otherwise largest reasonable)
      let keep = variants.find(v => v.isHD && v.size <= MAX_KEEP_SIZE);
      if (!keep) {
        keep = variants.find(v => v.size <= MAX_KEEP_SIZE);
      }
      if (!keep) {
        // If all are too large, keep the smallest
        keep = variants[variants.length - 1];
      }
      
      // Remove others
      variants.forEach(file => {
        if (file.filename !== keep.filename) {
          try {
            fs.unlinkSync(file.path);
            duplicatesRemoved++;
            console.log(`   🗑️  Removed: ${file.filename} (${(file.size / 1024).toFixed(1)}KB, kept ${keep.filename})`);
          } catch (err) {
            console.error(`   ❌ Error removing ${file.filename}:`, err.message);
          }
        }
      });
      
      filesToKeep.push(keep);
    } else {
      // Single file, check if it's too large
      const file = variants[0];
      if (file.size <= MAX_KEEP_SIZE || file.filename.includes('_1.')) {
        filesToKeep.push(file);
      } else {
        console.log(`   ⚠️  Skipping large file: ${file.filename} (${(file.size / 1024).toFixed(1)}KB)`);
      }
    }
  });
  
  // Sort files by original filename for consistent ordering
  filesToKeep.sort((a, b) => {
    // Extract numbers from filename for sorting
    const numA = parseInt(a.filename.match(/\d+/)?.[0] || '0');
    const numB = parseInt(b.filename.match(/\d+/)?.[0] || '0');
    return numA - numB;
  });
  
  // Rename files sequentially
  console.log(`   📝 Renaming ${filesToKeep.length} files...`);
  let renamed = 0;
  
  filesToKeep.forEach((file, index) => {
    const ext = path.extname(file.filename);
    const newName = `${folderConfig.prefix}${index + 1}${ext}`;
    const newPath = path.join(folderPath, newName);
    
    try {
      // If already renamed correctly, skip
      if (file.filename === newName) {
        return;
      }
      
      // If target exists and is different file, skip
      if (fs.existsSync(newPath) && newPath !== file.path) {
        console.log(`   ⚠️  Skipping ${file.filename} (target ${newName} exists)`);
        return;
      }
      
      fs.renameSync(file.path, newPath);
      renamed++;
      if (renamed <= 5 || renamed === filesToKeep.length) {
        console.log(`   ✓ ${file.filename} → ${newName}`);
      }
    } catch (err) {
      console.error(`   ❌ Error renaming ${file.filename}:`, err.message);
    }
  });
  
  if (renamed > 5) {
    console.log(`   ... and ${renamed - 5} more files`);
  }
  
  console.log(`   ✅ Completed: ${duplicatesRemoved} duplicates removed, ${renamed} files renamed`);
  
  return { removed: duplicatesRemoved, renamed: renamed };
}

// Main execution
console.log('🧹 Starting image cleanup...\n');
console.log('ℹ️  Keeping HD versions up to 800KB, otherwise keeping low res\n');

const results = stageFolders.map(folder => {
  const result = cleanFolder(folder);
  return { folder: folder.name, ...result };
});

console.log('\n' + '='.repeat(60));
console.log('📊 Summary:');
results.forEach(r => {
  console.log(`   ${r.folder}: ${r.removed} removed, ${r.renamed} renamed`);
});
console.log('\n✨ Cleanup complete!\n');
