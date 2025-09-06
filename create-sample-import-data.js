// Create sample data for import demonstration
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN || 'skJo4iwMzLtavnRYqibHHTzDqOJc5UJTQE9JCv066MM6vWDFE6XEZBnV2XZTzbxE8BKTawmfQhPE2ZPwrLNP7CokAwUlJN5VeQWLuUiLFeZQfyiXeDdkAShynpyk1v4jWmcNAZDvph2QCuCFcJko5q0XAf123nDHp9VF4oRr7NnJh1NkEa6V'
});

async function createSampleData() {
  console.log('🔧 Creating sample data for import demonstration...');
  
  try {
    // Create a sample conference event
    const conferenceEvent = await client.create({
      _type: 'conferenceEvent',
      title: 'Sample Nursing Conference 2025',
      description: 'A sample conference for import demonstration',
      startDate: '2025-03-15',
      endDate: '2025-03-17',
      location: 'Sample Convention Center',
      isActive: true,
      slug: {
        _type: 'slug',
        current: 'sample-nursing-conference-2025'
      }
    });
    
    console.log('✅ Created sample conference:', conferenceEvent._id);
    
    // Create sample registration settings
    const registrationSettings = await client.create({
      _type: 'registrationSettings',
      title: 'Sample Registration Settings',
      isRegistrationOpen: true,
      maxRegistrations: 500,
      welcomeMessage: 'Welcome to our sample conference!'
    });
    
    console.log('✅ Created sample registration settings:', registrationSettings._id);
    
    // Create a sample speaker
    const speaker = await client.create({
      _type: 'speakers',
      name: 'Dr. Sample Speaker',
      title: 'Chief Medical Officer',
      organization: 'Sample Hospital',
      bio: 'Dr. Sample Speaker is a renowned expert in nursing education.',
      email: 'speaker@sample.com'
    });
    
    console.log('✅ Created sample speaker:', speaker._id);
    
    console.log('');
    console.log('🎉 Sample data created successfully!');
    console.log('📊 Ready to demonstrate export/import process');
    
  } catch (error) {
    console.log('❌ Error creating sample data:', error.message);
  }
}

createSampleData();
