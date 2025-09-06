const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function testMapAPI() {
  try {
    console.log('🧪 Testing Conference Locations API...');

    // Test 1: Check if schema exists
    console.log('\n1. Checking Sanity schema...');
    const schemaTypes = await client.fetch('*[_type == "conferenceLocation"][0...1]');
    console.log(`Found ${schemaTypes.length} conference location documents`);

    // Test 2: Add a sample location if none exist
    if (schemaTypes.length === 0) {
      console.log('\n2. Adding sample location...');
      const sampleLocation = {
        _type: 'conferenceLocation',
        title: 'London, United Kingdom',
        address: 'ExCeL London, Royal Victoria Dock, London E16 1XL, UK',
        latitude: 51.5074,
        longitude: -0.1278,
        description: 'Major European hub for international conferences.',
        isActive: true,
        order: 1,
      };

      const result = await client.create(sampleLocation);
      console.log(`✅ Created sample location: ${result.title} (ID: ${result._id})`);
    }

    // Test 3: Fetch active locations
    console.log('\n3. Fetching active locations...');
    const locations = await client.fetch(`
      *[_type == "conferenceLocation" && isActive == true] | order(order asc, title asc) {
        _id,
        title,
        address,
        latitude,
        longitude,
        description,
        isActive,
        order
      }
    `);

    console.log(`✅ Found ${locations.length} active locations:`);
    locations.forEach((loc, index) => {
      console.log(`${index + 1}. ${loc.title} (${loc.latitude}, ${loc.longitude})`);
    });

    // Test 4: Test API endpoint locally
    console.log('\n4. Testing API endpoint...');
    console.log('API should be available at: http://localhost:3000/api/conference-locations');
    console.log('Live API should be available at: http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io/api/conference-locations');

    console.log('\n🎉 Test completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start your Next.js app: npm run dev (in nextjs-frontend folder)');
    console.log('2. Visit http://localhost:3000 to test the map locally');
    console.log('3. Check browser console for any JavaScript errors');

  } catch (error) {
    console.error('❌ Test failed:', error);

    if (error.message.includes('Insufficient permissions')) {
      console.log('\n🔑 Please set SANITY_API_TOKEN environment variable');
      console.log('Get token from: https://sanity.io/manage');
    }
  }
}

// Run the test
testMapAPI();