const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN, // You'll need to set this
  useCdn: false,
});

// Sample conference locations data
const conferenceLocations = [
  {
    _type: 'conferenceLocation',
    title: 'London, United Kingdom',
    address: 'ExCeL London, Royal Victoria Dock, London E16 1XL, UK',
    latitude: 51.5074,
    longitude: -0.1278,
    description: 'Major European hub for international conferences and academic events.',
    isActive: true,
    order: 1,
  },
  {
    _type: 'conferenceLocation',
    title: 'New York, USA',
    address: 'Jacob K. Javits Convention Center, 429 11th Ave, New York, NY 10001, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    description: 'Premier destination for technology and business conferences in North America.',
    isActive: true,
    order: 2,
  },
  {
    _type: 'conferenceLocation',
    title: 'Singapore',
    address: 'Marina Bay Sands Expo and Convention Centre, 10 Bayfront Ave, Singapore 018956',
    latitude: 1.3521,
    longitude: 103.8198,
    description: 'Gateway to Asia-Pacific conferences and international symposiums.',
    isActive: true,
    order: 3,
  },
  {
    _type: 'conferenceLocation',
    title: 'Dubai, UAE',
    address: 'Dubai World Trade Centre, Sheikh Zayed Rd, Dubai, UAE',
    latitude: 25.2048,
    longitude: 55.2708,
    description: 'Middle East hub for global conferences and business events.',
    isActive: true,
    order: 4,
  },
  {
    _type: 'conferenceLocation',
    title: 'Tokyo, Japan',
    address: 'Tokyo International Forum, 3-5-1 Marunouchi, Chiyoda City, Tokyo 100-0005, Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    description: 'Leading venue for technology and innovation conferences in Asia.',
    isActive: true,
    order: 5,
  },
  {
    _type: 'conferenceLocation',
    title: 'Sydney, Australia',
    address: 'International Convention Centre Sydney, 14 Darling Dr, Sydney NSW 2000, Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    description: 'Premier conference destination in the Asia-Pacific region.',
    isActive: true,
    order: 6,
  },
  {
    _type: 'conferenceLocation',
    title: 'Berlin, Germany',
    address: 'Messe Berlin, Messedamm 22, 14055 Berlin, Germany',
    latitude: 52.5200,
    longitude: 13.4050,
    description: 'Central European location for academic and research conferences.',
    isActive: true,
    order: 7,
  },
  {
    _type: 'conferenceLocation',
    title: 'Toronto, Canada',
    address: 'Metro Toronto Convention Centre, 255 Front St W, Toronto, ON M5V 2W6, Canada',
    latitude: 43.6532,
    longitude: -79.3832,
    description: 'Major North American venue for international conferences.',
    isActive: true,
    order: 8,
  },
];

async function populateConferenceLocations() {
  try {
    console.log('🗺️ Starting to populate conference locations...');

    // Check if locations already exist
    const existingLocations = await client.fetch('*[_type == "conferenceLocation"]');
    
    if (existingLocations.length > 0) {
      console.log(`⚠️ Found ${existingLocations.length} existing conference locations.`);
      console.log('Skipping population to avoid duplicates.');
      console.log('If you want to repopulate, delete existing locations first.');
      return;
    }

    // Create conference locations
    const results = [];
    for (const location of conferenceLocations) {
      console.log(`📍 Creating location: ${location.title}...`);
      
      const result = await client.create(location);
      results.push(result);
      
      console.log(`✅ Created location: ${result.title} (ID: ${result._id})`);
    }

    console.log(`\n🎉 Successfully created ${results.length} conference locations!`);
    console.log('\n📋 Summary:');
    results.forEach((location, index) => {
      console.log(`${index + 1}. ${location.title} - ${location.address}`);
    });

    console.log('\n🚀 Next steps:');
    console.log('1. Start your Sanity Studio: npm run dev (in SanityBackend folder)');
    console.log('2. Visit http://localhost:3333 to manage locations');
    console.log('3. Start your Next.js app to see the map: npm run dev (in nextjs-frontend folder)');
    console.log('4. Visit http://localhost:3000 to see the interactive map');

  } catch (error) {
    console.error('❌ Error populating conference locations:', error);
    
    if (error.message.includes('Insufficient permissions')) {
      console.log('\n🔑 Authentication Error:');
      console.log('Please set your SANITY_API_TOKEN environment variable.');
      console.log('You can get a token from: https://sanity.io/manage');
    }
  }
}

// Run the population script
if (require.main === module) {
  populateConferenceLocations();
}

module.exports = { populateConferenceLocations, conferenceLocations };
