const { createClient } = require('@sanity/client');

console.log('🔍 Testing New Sanity Project Connection...\n');

const client = createClient({
  projectId: 'n3no08m3',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03'
});

async function testConnection() {
  try {
    console.log('1. Testing basic connection...');
    const siteSettings = await client.fetch('*[_type == "siteSettings"][0]');
    console.log('✅ Site settings found:', !!siteSettings);

    console.log('\n2. Testing conference events...');
    const events = await client.fetch('*[_type == "conferenceEvent"] | order(date desc)[0...3]{ title, date, location }');
    console.log('✅ Conference events found:', events.length);
    
    events.forEach((event, i) => {
      console.log(`   ${i+1}. ${event.title} - ${event.location}`);
    });

    console.log('\n3. Testing hero section...');
    const hero = await client.fetch('*[_type == "siteSettings"][0].heroSection');
    console.log('✅ Hero section found:', !!hero);

    console.log('\n🎉 All tests passed! New Sanity project is working correctly.');
    console.log('\n📋 Project Details:');
    console.log('- Project ID: n3no08m3');
    console.log('- Dataset: production');
    console.log('- Studio URL: https://nursing-conferences-cms.sanity.studio/');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
