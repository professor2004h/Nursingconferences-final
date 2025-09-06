const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function testConferences() {
  try {
    console.log('🔍 Testing conference data...');
    
    // Check existing conferences
    const allConferences = await client.fetch(`*[_type == "conferenceEvent"] | order(date asc) {
      _id,
      title,
      date,
      location
    }`);
    
    console.log(`📊 Found ${allConferences.length} total conferences:`);
    allConferences.forEach(conf => {
      const date = new Date(conf.date);
      const isUpcoming = date > new Date();
      console.log(`  - ${conf.title} | ${date.toLocaleDateString()} | ${conf.location} | ${isUpcoming ? '✅ Upcoming' : '❌ Past'}`);
    });
    
    // Check upcoming conferences specifically
    const upcomingConferences = await client.fetch(`*[_type == "conferenceEvent" && date > now()] | order(date asc) {
      _id,
      title,
      date,
      location
    }`);
    
    console.log(`\n🚀 Found ${upcomingConferences.length} upcoming conferences:`);
    upcomingConferences.forEach(conf => {
      console.log(`  - ${conf.title} | ${new Date(conf.date).toLocaleDateString()} | ${conf.location}`);
    });
    
    // If no upcoming conferences, create some sample ones
    if (upcomingConferences.length === 0) {
      console.log('\n📝 No upcoming conferences found. Creating sample conferences...');
      
      const sampleConferences = [
        {
          _type: 'conferenceEvent',
          title: 'International Conference on Artificial Intelligence 2024',
          slug: { _type: 'slug', current: 'ai-conference-2024' },
          location: 'San Francisco, CA, USA',
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: 'image-placeholder' // This would need a real image asset
            }
          },
          email: 'ai-conference@intelliglobalconferences.com'
        },
        {
          _type: 'conferenceEvent',
          title: 'Global Healthcare Innovation Summit 2024',
          slug: { _type: 'slug', current: 'healthcare-summit-2024' },
          location: 'London, UK',
          date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: 'image-placeholder'
            }
          },
          email: 'healthcare@intelliglobalconferences.com'
        },
        {
          _type: 'conferenceEvent',
          title: 'International Biotechnology Conference 2024',
          slug: { _type: 'slug', current: 'biotech-conference-2024' },
          location: 'Boston, MA, USA',
          date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: 'image-placeholder'
            }
          },
          email: 'biotech@intelliglobalconferences.com'
        }
      ];
      
      for (const conference of sampleConferences) {
        try {
          // Remove image field for now since we don't have actual image assets
          const { image, ...conferenceWithoutImage } = conference;
          const result = await client.create(conferenceWithoutImage);
          console.log(`✅ Created: ${conference.title} (ID: ${result._id})`);
        } catch (error) {
          console.error(`❌ Error creating ${conference.title}:`, error.message);
        }
      }
      
      console.log('\n🔄 Rechecking upcoming conferences...');
      const newUpcomingConferences = await client.fetch(`*[_type == "conferenceEvent" && date > now()] | order(date asc) {
        _id,
        title,
        date,
        location
      }`);
      
      console.log(`🎉 Now found ${newUpcomingConferences.length} upcoming conferences:`);
      newUpcomingConferences.forEach(conf => {
        console.log(`  - ${conf.title} | ${new Date(conf.date).toLocaleDateString()} | ${conf.location}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing conferences:', error);
  }
}

// Run the test
testConferences();
