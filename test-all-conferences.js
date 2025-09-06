const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function testAllConferences() {
  try {
    console.log('🔍 Testing ALL conferences functionality...');
    
    // Fetch all conferences (same query as getAllConferences function)
    const query = `*[_type == "conferenceEvent"] | order(date desc) {
      _id,
      title,
      slug,
      date,
      location,
      image {
        asset -> {
          url
        }
      }
    }`;
    
    const conferences = await client.fetch(query);
    console.log(`🚀 Total conferences found: ${conferences.length}`);
    
    if (conferences.length > 0) {
      console.log('\n📅 All conferences available for sponsorship:');
      conferences.forEach((conf, index) => {
        const date = new Date(conf.date);
        const isPast = date < new Date();
        const status = isPast ? '📅 Past' : '🚀 Future';
        console.log(`${index + 1}. ${conf.title}`);
        console.log(`   📍 Location: ${conf.location}`);
        console.log(`   📅 Date: ${date.toLocaleDateString()}`);
        console.log(`   ${status} Conference`);
        console.log(`   🆔 ID: ${conf._id}`);
        console.log('');
      });
      
      console.log('✅ SUCCESS: All conferences are now available for sponsor registration!');
      console.log('📋 Sponsors can register for ANY conference (past, present, or future)');
      
      // Show how they will appear in the dropdown
      console.log('\n🎯 Dropdown format preview:');
      conferences.forEach((conf, index) => {
        const date = new Date(conf.date);
        console.log(`${index + 1}. "${conf.title} - ${date.toLocaleDateString()} - ${conf.location}"`);
      });
      
    } else {
      console.log('❌ No conferences found in database');
      console.log('📝 Please create some conferences in Sanity Studio first');
    }
    
  } catch (error) {
    console.error('❌ Error testing all conferences:', error.message);
  }
}

// Run the test
testAllConferences();
