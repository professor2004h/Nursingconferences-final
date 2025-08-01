// Verification script for mobile Event Type layout fix
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying mobile Event Type layout fixes...\n');

// Check 1: Component uses inline-flex
const heroPath = path.join(__dirname, 'nextjs-frontend', 'src', 'app', 'components', 'HeroSlideshow.tsx');
try {
  const heroContent = fs.readFileSync(heroPath, 'utf8');
  if (heroContent.includes("display: 'inline-flex'") && 
      heroContent.includes("alignItems: 'center'") &&
      heroContent.includes("gap: 'clamp(0.15rem, 0.8vw, 0.3rem)'")) {
    console.log('✅ Component uses inline-flex with proper alignment and gap');
  } else {
    console.log('❌ Component missing proper flexbox styling');
  }
} catch (error) {
  console.log('❌ Could not read Hero component file');
}

// Check 2: CSS has mobile flexbox styling
const cssPath = path.join(__dirname, 'nextjs-frontend', 'src', 'app', 'globals.css');
try {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  if (cssContent.includes('display: inline-flex !important') && 
      cssContent.includes('align-items: center !important') &&
      cssContent.includes('flex-wrap: nowrap !important')) {
    console.log('✅ CSS includes mobile flexbox styling');
  } else {
    console.log('❌ CSS missing mobile flexbox styling');
  }
} catch (error) {
  console.log('❌ Could not read CSS file');
}

// Check 3: Icon-specific styling
try {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  if (cssContent.includes('.hero-event-type span:first-child') && 
      cssContent.includes('flex-shrink: 0 !important') &&
      cssContent.includes('vertical-align: middle !important')) {
    console.log('✅ CSS includes icon-specific styling');
  } else {
    console.log('❌ CSS missing icon-specific styling');
  }
} catch (error) {
  console.log('❌ Could not read CSS file for icon styling check');
}

console.log('\n📱 Mobile Layout Fixes Applied:');
console.log('1. Component: Changed to inline-flex with center alignment');
console.log('2. Component: Added gap property for consistent spacing');
console.log('3. Component: Removed marginRight from icon span');
console.log('4. CSS: Added flex-wrap: nowrap to prevent wrapping');
console.log('5. CSS: Added icon-specific styling for all breakpoints');
console.log('6. CSS: Added mobile-specific flexbox properties');

console.log('\n🎯 Expected Result:');
console.log('Icon and text should now display horizontally: 🌐 HYBRID EVENT (ONLINE AND OFFLINE)');
console.log('This should work consistently across all mobile screen sizes (320px-640px)');

console.log('\n🧪 Testing Recommendations:');
console.log('1. Test on mobile devices or browser dev tools');
console.log('2. Check screen sizes: 320px, 375px, 414px, 640px');
console.log('3. Verify icon stays inline with text');
console.log('4. Confirm no vertical stacking occurs');
