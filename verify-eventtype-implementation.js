// Verification script for eventType field implementation
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying eventType field implementation...\n');

// Check 1: Sanity Schema
const schemaPath = path.join(__dirname, 'SanityBackend', 'schemaTypes', 'heroSection.ts');
try {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  if (schemaContent.includes('eventType')) {
    console.log('✅ Sanity schema includes eventType field');
  } else {
    console.log('❌ Sanity schema missing eventType field');
  }
} catch (error) {
  console.log('❌ Could not read Sanity schema file');
}

// Check 2: TypeScript Types
const typesPath = path.join(__dirname, 'nextjs-frontend', 'src', 'app', 'types', 'heroSection.ts');
try {
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  if (typesContent.includes('eventType: string')) {
    console.log('✅ TypeScript types include eventType field');
  } else {
    console.log('❌ TypeScript types missing eventType field');
  }
} catch (error) {
  console.log('❌ Could not read TypeScript types file');
}

// Check 3: Data Fetching
const fetchPath = path.join(__dirname, 'nextjs-frontend', 'src', 'app', 'getHeroSection.ts');
try {
  const fetchContent = fs.readFileSync(fetchPath, 'utf8');
  if (fetchContent.includes('eventType,') && fetchContent.includes('data.eventType')) {
    console.log('✅ Data fetching includes eventType field');
  } else {
    console.log('❌ Data fetching missing eventType field');
  }
} catch (error) {
  console.log('❌ Could not read data fetching file');
}

// Check 4: Hero Component
const heroPath = path.join(__dirname, 'nextjs-frontend', 'src', 'app', 'components', 'HeroSlideshow.tsx');
try {
  const heroContent = fs.readFileSync(heroPath, 'utf8');
  if (heroContent.includes('hero?.eventType') && heroContent.includes('hero-event-type')) {
    console.log('✅ Hero component includes eventType display');
  } else {
    console.log('❌ Hero component missing eventType display');
  }
} catch (error) {
  console.log('❌ Could not read Hero component file');
}

// Check 5: CSS Styling
const cssPath = path.join(__dirname, 'nextjs-frontend', 'src', 'app', 'globals.css');
try {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  if (cssContent.includes('.hero-event-type') && cssContent.includes('white-space: nowrap')) {
    console.log('✅ CSS includes eventType styling with single-line layout');
  } else {
    console.log('❌ CSS missing eventType styling or single-line layout');
  }
} catch (error) {
  console.log('❌ Could not read CSS file');
}

console.log('\n📋 Implementation Summary:');
console.log('1. Sanity Schema: eventType field added with default value');
console.log('2. TypeScript Types: Updated interfaces');
console.log('3. Data Fetching: Query and defaults updated');
console.log('4. Hero Component: Display logic added');
console.log('5. CSS Styling: Single-line responsive design');
console.log('\n🔧 Next Steps:');
console.log('1. Restart Sanity Studio: run restart-sanity.bat');
console.log('2. Check Sanity Studio admin interface for eventType field');
console.log('3. Test frontend display on mobile and desktop');
console.log('4. Verify single-line text layout');
