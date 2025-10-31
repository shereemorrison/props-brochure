#!/usr/bin/env node

/**
 * Script to help organize and rename stage images
 * 
 * This script will:
 * 1. List all images in stageone, stagetwo, stagethree folders
 * 2. Show naming patterns
 * 3. Help identify duplicates or problematic names
 * 
 * Usage: node scripts/organize-images.js
 */

const fs = require('fs');
const path = require('path');

const stageFolders = ['stageone', 'stagetwo', 'stagethree'];
const publicPath = path.join(__dirname, '..', 'public');

function analyzeFolder(folderName) {
  const folderPath = path.join(publicPath, folderName);
  
  if (!fs.existsSync(folderPath)) {
    console.log(`❌ Folder ${folderName} does not exist`);
    return null;
  }
  
  const files = fs.readdirSync(folderPath).filter(file => 
    file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.png')
  );
  
  const analysis = {
    folderName,
    totalFiles: files.length,
    files: files,
    patterns: {
      numbered: files.filter(f => /^\d+_/.test(f)).length,
      propsTheatre: files.filter(f => f.includes('PROPS') || f.includes('Props_Theatre')).length,
      duplicates: []
    }
  };
  
  // Check for duplicates (files with _1, _2 suffixes)
  const baseNames = new Map();
  files.forEach(file => {
    const baseName = file.replace(/_\d+\.webp$/, '.webp').replace(/\.webp$/, '');
    if (!baseNames.has(baseName)) {
      baseNames.set(baseName, []);
    }
    baseNames.get(baseName).push(file);
  });
  
  baseNames.forEach((variants, base) => {
    if (variants.length > 1) {
      analysis.patterns.duplicates.push({ base, variants });
    }
  });
  
  return analysis;
}

function generateReport() {
  console.log('\n📸 Stage Images Organization Report\n');
  console.log('=' .repeat(60));
  
  const reports = stageFolders.map(folder => analyzeFolder(folder));
  
  reports.forEach(report => {
    if (!report) return;
    
    console.log(`\n📁 ${report.folderName.toUpperCase()}`);
    console.log(`   Total images: ${report.totalFiles}`);
    console.log(`   Numbered files (001_, 002_): ${report.patterns.numbered}`);
    console.log(`   Props Theatre logo files: ${report.patterns.propsTheatre}`);
    console.log(`   Potential duplicates: ${report.patterns.duplicates.length}`);
    
    if (report.patterns.duplicates.length > 0) {
      console.log('\n   ⚠️  Duplicate variants found:');
      report.patterns.duplicates.slice(0, 5).forEach(dup => {
        console.log(`      - ${dup.base}: ${dup.variants.length} variants`);
      });
      if (report.patterns.duplicates.length > 5) {
        console.log(`      ... and ${report.patterns.duplicates.length - 5} more`);
      }
    }
    
    // Show sample file names
    console.log('\n   📋 Sample files (first 5):');
    report.files.slice(0, 5).forEach(file => {
      console.log(`      - ${file}`);
    });
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 Recommendations:');
  console.log('   1. Remove duplicate variants (keep highest quality)');
  console.log('   2. Remove Props Theatre logo files from stage folders');
  console.log('   3. Ensure consistent naming: stageone_001.webp, stageone_002.webp, etc.');
  console.log('   4. Or use: stage-one-001.webp, stage-one-002.webp, etc.');
  console.log('\n');
}

// Run the analysis
generateReport();

