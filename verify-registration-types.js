#!/usr/bin/env node

/**
 * Verification script to check registration types cleanup
 * This script verifies that only the 8 approved registration types are active
 */

const { createClient } = require('@sanity/client');

// Initialize Sanity client (you'll need to update these values)
const client = createClient({
  projectId: 'your-project-id', // Replace with your actual project ID
  dataset: 'production',
  useCdn: false,
  token: 'your-token', // Replace with your actual token
  apiVersion: '2023-05-03',
});

// The 8 approved registration type categories
const approvedCategories = [
  'speaker-inperson',
  'speaker-virtual', 
  'listener-inperson',
  'listener-virtual',
  'student-inperson',
  'student-virtual',
  'eposter-virtual',
  'exhibitor'
];

async function verifyRegistrationTypes() {
  try {
    console.log('🔍 Verifying registration types cleanup...\n');

    // Fetch all registration types
    const allTypes = await client.fetch('*[_type == "registrationTypes"] | order(displayOrder asc)');
    
    console.log(`📊 Total registration types in database: ${allTypes.length}`);
    
    // Check active types
    const activeTypes = allTypes.filter(type => type.isActive);
    console.log(`✅ Active registration types: ${activeTypes.length}`);
    
    // Check inactive types
    const inactiveTypes = allTypes.filter(type => !type.isActive);
    console.log(`❌ Inactive registration types: ${inactiveTypes.length}\n`);

    // Verify only approved categories are active
    console.log('📋 Active Registration Types:');
    console.log('=' .repeat(50));
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    activeTypes.forEach((type, index) => {
      const isApproved = approvedCategories.includes(type.category);
      const status = isApproved ? '✅' : '❌';
      
      console.log(`${index + 1}. ${status} ${type.name} (${type.category})`);
      
      if (isApproved) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    console.log('\n' + '=' .repeat(50));
    console.log(`✅ Correct active types: ${correctCount}`);
    console.log(`❌ Incorrect active types: ${incorrectCount}`);

    // Check if we have exactly 8 approved types
    if (correctCount === 8 && incorrectCount === 0) {
      console.log('\n🎉 SUCCESS: Registration types cleanup completed successfully!');
      console.log('   All 8 approved registration types are active and no incorrect types are active.');
    } else {
      console.log('\n⚠️  WARNING: Registration types cleanup needs attention:');
      if (correctCount !== 8) {
        console.log(`   - Expected 8 approved types, found ${correctCount}`);
      }
      if (incorrectCount > 0) {
        console.log(`   - Found ${incorrectCount} incorrect active types that should be deactivated`);
      }
    }

    // Show inactive types for reference
    if (inactiveTypes.length > 0) {
      console.log('\n📝 Inactive Registration Types (for reference):');
      console.log('-' .repeat(50));
      inactiveTypes.forEach((type, index) => {
        console.log(`${index + 1}. ${type.name} (${type.category})`);
      });
    }

    // Check for missing approved categories
    console.log('\n🔍 Checking for missing approved categories:');
    const activeCategoriesSet = new Set(activeTypes.map(type => type.category));
    const missingCategories = approvedCategories.filter(cat => !activeCategoriesSet.has(cat));
    
    if (missingCategories.length === 0) {
      console.log('✅ All approved categories are present and active');
    } else {
      console.log('❌ Missing approved categories:');
      missingCategories.forEach(cat => {
        console.log(`   - ${cat}`);
      });
    }

  } catch (error) {
    console.error('❌ Error verifying registration types:', error);
  }
}

// Run the verification
if (require.main === module) {
  verifyRegistrationTypes();
}

module.exports = { verifyRegistrationTypes };
