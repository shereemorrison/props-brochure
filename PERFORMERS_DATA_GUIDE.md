# Performers Data Guide

## Overview
The performers data file (`src/data/performers.ts`) contains all student/performer information mapped to their performance days and stages.

## Data Structure

### Performer Interface
```typescript
interface Performer {
  id: string;              // Normalized name (e.g., "arie-pope")
  name: string;            // Full name (e.g., "Arie Pope")
  age: number;             // Student age
  commitment: string;      // Commitment level (e.g., "FYP NOV", "Beginner")
  photoUrl?: string;       // Optional photo path (add when you have photos)
  performances: PerformerPerformance[];
}
```

### PerformerPerformance Interface
```typescript
interface PerformerPerformance {
  date: string;            // "Monday, 3 November 2025"
  dayId: string;           // Maps to day.id in performances.ts
  time: string;            // "4:00 PM to 5:00 PM"
  stage: string;           // "Stage One", "Stage Two", or "Stage Three"
  stageId: string;         // Maps to stage.id in performances.ts
}
```

## Adding Photos

When you have photos ready, you have two options:

### Option 1: Store in assets folder (Recommended)
1. Create folder: `src/assets/images/performers/`
2. Name files using normalized names: `arie-pope.webp`, `ava-hawkey.webp`, etc.
3. Import and add to each performer:
```typescript
import ariePopePhoto from '../assets/images/performers/arie-pope.webp';

{
  id: 'arie-pope',
  name: 'Arie Pope',
  photoUrl: ariePopePhoto,
  // ... rest of data
}
```

### Option 2: Store in public folder
1. Create folder: `public/performers/`
2. Name files: `arie-pope.webp`, `ava-hawkey.webp`, etc.
3. Add path to performer:
```typescript
{
  id: 'arie-pope',
  name: 'Arie Pope',
  photoUrl: '/performers/arie-pope.webp',
  // ... rest of data
}
```

## Helper Functions

The file includes helper functions to query performers:

- `getPerformersByDay(dayId)` - Get all performers for a specific day
- `getPerformersByStage(stageId)` - Get all performers for a specific stage
- `getPerformersByStageAndDay(stageId, dayId)` - Get performers for specific stage and day
- `getPerformerById(id)` - Find performer by ID
- `getPerformerByName(name)` - Find performer by name

## Current Status

The current file includes examples for Monday performers. You'll need to add the remaining performers for:
- Tuesday, 4 November 2025
- Wednesday, 5 November 2025
- Thursday, 6 November 2025
- Friday, 7 November 2025

## Date Mapping

The spreadsheet dates (Monday, 3 November 2025) need to be mapped to your day IDs in `performances.ts`. Currently the mapping function uses:
- `monday-3rd` for Monday, 3 November 2025
- `tuesday-4th` for Tuesday, 4 November 2025
- etc.

**Important**: You may need to update the `mapDateToDayId` function if your actual day IDs differ (e.g., if they're `monday-24th` instead of `monday-3rd`).

## Next Steps

1. Complete the performers array with all students from the spreadsheet
2. Update date mappings to match your actual day IDs
3. Add photos when available using one of the methods above
4. Update the cast arrays in `performances.ts` to use the real performer data

