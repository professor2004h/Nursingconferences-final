const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function testSponsorConferences() {
  console.log('🔍 Testing conference data fetch for sponsor registration...');
  
  try {
    // Test the exact query used in the sponsor registration
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

    console.log('📝 Executing query:', query);
    
    const conferences = await client.fetch(query);
    
    console.log('📊 Raw result:', JSON.stringify(conferences, null, 2));
    console.log(`📅 Found ${conferences?.length || 0} conferences`);
    
    if (conferences && conferences.length > 0) {
      console.log('✅ Conference titles found:');
      conferences.forEach((conf, index) => {
        console.log(`  ${index + 1}. "${conf.title}" (ID: ${conf._id})`);
        console.log(`     Date: ${conf.date}`);
        console.log(`     Location: ${conf.location}`);
        console.log(`     Slug: ${conf.slug?.current || 'No slug'}`);
        console.log('');
      });
    } else {
      console.log('❌ No conferences found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testSponsorConferences();
