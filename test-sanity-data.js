const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function testSanityData() {
  try {
    console.log('🔍 Testing Sanity data retrieval...');
    
    const query = `*[_type == "conferenceEvent"]{
      _id,
      title,
      registerNowUrl,
      submitAbstractUrl
    }`;
    
    const events = await client.fetch(query);
    
    console.log(`📊 Found ${events.length} events:`);
    
    events.forEach((event, index) => {
      console.log(`\n📋 Event ${index + 1}: ${event.title}`);
      console.log(`  ID: ${event._id}`);
      console.log(`  Register URL: ${event.registerNowUrl || 'NOT SET'}`);
      console.log(`  Submit URL: ${event.submitAbstractUrl || 'NOT SET'}`);
      
      if (event.registerNowUrl) {
        console.log(`  Register URL Length: ${event.registerNowUrl.length} characters`);
      }
      if (event.submitAbstractUrl) {
        console.log(`  Submit URL Length: ${event.submitAbstractUrl.length} characters`);
      }
    });
    
    // Focus on Research Publication event
    const researchEvent = events.find(event => 
      event.title && event.title.toLowerCase().includes('research')
    );
    
    if (researchEvent) {
      console.log('\n🎯 Research Publication Event Details:');
      console.log('Full Register URL:', JSON.stringify(researchEvent.registerNowUrl));
      console.log('Full Submit URL:', JSON.stringify(researchEvent.submitAbstractUrl));
    }
    
  } catch (error) {
    console.error('❌ Error testing Sanity data:', error);
  }
}

testSanityData();
