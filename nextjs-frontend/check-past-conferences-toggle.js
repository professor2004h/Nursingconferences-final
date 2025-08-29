const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03'
});

async function checkPastConferencesToggle() {
  try {
    console.log('Checking Past Conferences toggle state...');
    
    const query = `*[_type == "pastConference"][0]{ 
      _id, 
      title, 
      showInMenu, 
      isActive, 
      redirectUrl,
      lastUpdated
    }`;
    
    const data = await client.fetch(query);
    console.log('Past Conferences Toggle Data:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data) {
      console.log('\n--- Summary ---');
      console.log(`Show in Menu: ${data.showInMenu}`);
      console.log(`Is Active: ${data.isActive}`);
      console.log(`Redirect URL: ${data.redirectUrl || 'Not set'}`);
      console.log(`Last Updated: ${data.lastUpdated || 'Not set'}`);
    } else {
      console.log('No Past Conferences configuration found in Sanity');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

checkPastConferencesToggle();
