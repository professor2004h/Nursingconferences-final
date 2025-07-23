// Verification script to check if speaker data was populated correctly
// Run this after populating speaker data to verify everything is working

const testSpeakerData = async () => {
  console.log('🎤 Verifying Speaker Data Population...\n');

  try {
    // Test API endpoint
    console.log('1. Testing API Endpoint...');
    const response = await fetch('http://localhost:3000/api/speakers');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API endpoint working');
      console.log(`   Found ${data.count} speakers`);
      
      if (data.count === 8) {
        console.log('✅ Correct number of speakers (8)');
      } else {
        console.log(`❌ Expected 8 speakers, found ${data.count}`);
      }
      
      // Check speaker categories
      const categories = {};
      data.data.forEach(speaker => {
        categories[speaker.speakerCategory] = (categories[speaker.speakerCategory] || 0) + 1;
      });
      
      console.log('\n2. Speaker Category Distribution:');
      console.log(`   Keynote: ${categories.keynote || 0} (expected: 2)`);
      console.log(`   Invited: ${categories.invited || 0} (expected: 2)`);
      console.log(`   Plenary: ${categories.plenary || 0} (expected: 1)`);
      console.log(`   Session: ${categories.session || 0} (expected: 1)`);
      console.log(`   Workshop: ${categories.workshop || 0} (expected: 1)`);
      console.log(`   Moderator: ${categories.moderator || 0} (expected: 1)`);
      
      // Verify expected distribution
      const expectedCategories = {
        keynote: 2,
        invited: 2,
        plenary: 1,
        session: 1,
        workshop: 1,
        moderator: 1
      };
      
      let categoryCheck = true;
      Object.entries(expectedCategories).forEach(([category, expected]) => {
        if ((categories[category] || 0) !== expected) {
          console.log(`❌ ${category}: expected ${expected}, found ${categories[category] || 0}`);
          categoryCheck = false;
        }
      });
      
      if (categoryCheck) {
        console.log('✅ All speaker categories have correct counts');
      }
      
      // Check required fields
      console.log('\n3. Checking Required Fields...');
      let fieldCheck = true;
      const requiredFields = ['name', 'title', 'institution', 'country', 'speakerCategory', 'displayOrder'];
      
      data.data.forEach((speaker, index) => {
        requiredFields.forEach(field => {
          if (!speaker[field]) {
            console.log(`❌ Speaker ${index + 1} missing required field: ${field}`);
            fieldCheck = false;
          }
        });
      });
      
      if (fieldCheck) {
        console.log('✅ All speakers have required fields');
      }
      
      // Check keynote speakers
      console.log('\n4. Checking Keynote Speakers...');
      const keynoteCount = data.data.filter(speaker => speaker.isKeynote).length;
      if (keynoteCount === 2) {
        console.log('✅ Correct number of keynote speakers (2)');
      } else {
        console.log(`❌ Expected 2 keynote speakers, found ${keynoteCount}`);
      }
      
      // Check featured speakers
      const featuredCount = data.data.filter(speaker => speaker.isFeatured).length;
      console.log(`   Featured speakers: ${featuredCount}`);
      
      // Sample speaker details
      console.log('\n5. Sample Speaker Details:');
      if (data.data.length > 0) {
        const sampleSpeaker = data.data[0];
        console.log(`   Name: ${sampleSpeaker.name}`);
        console.log(`   Title: ${sampleSpeaker.title}`);
        console.log(`   Institution: ${sampleSpeaker.institution}`);
        console.log(`   Category: ${sampleSpeaker.speakerCategory}`);
        console.log(`   Has Bio: ${sampleSpeaker.bio ? 'Yes' : 'No'}`);
        console.log(`   Has Session Title: ${sampleSpeaker.sessionTitle ? 'Yes' : 'No'}`);
        console.log(`   Has Email: ${sampleSpeaker.email ? 'Yes' : 'No'}`);
      }
      
    } else {
      console.log('❌ API endpoint failed:', data.error);
    }
    
  } catch (error) {
    console.log('❌ Error testing API:', error.message);
    console.log('   Make sure the Next.js development server is running on port 3000');
  }
  
  // Test page accessibility
  console.log('\n6. Testing Page Accessibility...');
  try {
    const pageResponse = await fetch('http://localhost:3000/speakers');
    if (pageResponse.ok) {
      console.log('✅ Speakers page accessible');
    } else {
      console.log('❌ Speakers page not accessible:', pageResponse.status);
    }
  } catch (error) {
    console.log('❌ Page accessibility error:', error.message);
  }
  
  console.log('\n🎯 Verification Summary:');
  console.log('If all checks passed, your speaker data is correctly populated!');
  console.log('\nNext steps:');
  console.log('1. Visit http://localhost:3000/speakers to see the speakers page');
  console.log('2. Test the filtering functionality');
  console.log('3. Click on speaker cards to test the modals');
  console.log('4. Check http://localhost:3333/structure/speakers in Sanity Studio');
  
  console.log('\n📋 Expected Speakers:');
  console.log('1. Dr. Maria Elena Rodriguez (Keynote)');
  console.log('2. Prof. James Wei Chen (Keynote)');
  console.log('3. Dr. Sarah Michelle Kim (Invited)');
  console.log('4. Prof. Ahmed Hassan Al-Rashid (Invited)');
  console.log('5. Dr. Lisa Wang-Chen (Plenary)');
  console.log('6. Dr. Michael James Thompson (Session)');
  console.log('7. Dr. Elena Mikhailovna Petrov (Workshop)');
  console.log('8. Prof. David Alexander Johnson (Moderator)');
};

// Check if we're in Node.js or browser environment
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testSpeakerData().catch(console.error);
} else {
  // Browser environment
  testSpeakerData().catch(console.error);
}
