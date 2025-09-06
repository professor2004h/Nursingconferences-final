const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function testResearchPublication() {
  try {
    console.log('🔍 Testing Research Publication event specifically...');
    
    // Query for the Research Publication event
    const query = `*[_type == "conferenceEvent" && title match "Research Publication*"] {
      _id,
      title,
      slug,
      date,
      location,
      email,
      registerNowUrl,
      submitAbstractUrl,
      "imageUrl": image.asset->url
    }`;
    
    const events = await client.fetch(query);
    console.log('📊 Research Publication events found:', events.length);
    
    events.forEach((event, index) => {
      console.log(`\n📋 Event ${index + 1}:`);
      console.log('  Title:', event.title);
      console.log('  ID:', event._id);
      console.log('  Register Now URL:', event.registerNowUrl || 'NOT SET');
      console.log('  Submit Abstract URL:', event.submitAbstractUrl || 'NOT SET');
      console.log('  Date:', event.date);
      console.log('  Location:', event.location);
    });
    
    // Also test the general conference events query (same as frontend uses)
    console.log('\n🔍 Testing general conference events query (frontend query)...');
    const frontendQuery = `*[
      _type == "conferenceEvent" && defined(slug.current)
    ]|order(date desc)[0...12]{
      _id,
      title,
      slug,
      date,
      location,
      email,
      registerNowUrl,
      submitAbstractUrl,
      "imageUrl": image.asset->url
    }`;
    
    const allEvents = await client.fetch(frontendQuery);
    console.log(`\n📊 Total events found: ${allEvents.length}`);
    
    allEvents.forEach((event, index) => {
      console.log(`\n📋 Event ${index + 1}: ${event.title}`);
      console.log('  Register Now URL:', event.registerNowUrl || 'NOT SET');
      console.log('  Submit Abstract URL:', event.submitAbstractUrl || 'NOT SET');
    });
    
    // Test if Research Publication is in the results
    const researchEvent = allEvents.find(event => 
      event.title && event.title.toLowerCase().includes('research publication')
    );
    
    if (researchEvent) {
      console.log('\n✅ Research Publication found in frontend query results!');
      console.log('  Register Now URL:', researchEvent.registerNowUrl || 'NOT SET');
      console.log('  Submit Abstract URL:', researchEvent.submitAbstractUrl || 'NOT SET');
    } else {
      console.log('\n❌ Research Publication NOT found in frontend query results!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testResearchPublication();
