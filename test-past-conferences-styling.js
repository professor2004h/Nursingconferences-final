const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function testPastConferencesStyling() {
  try {
    console.log('🎨 Testing Past Conferences Section Styling...\n');
    
    // Test if the schema exists by querying for documents
    const query = `*[_type == 'pastConferencesSectionStyling'] {
      _id,
      title,
      isActive,
      'backgroundImageUrl': backgroundImage.asset->url,
      backgroundPosition,
      backgroundSize,
      overlayColor,
      overlayOpacity,
      fallbackGradient
    }`;
    
    const stylingConfigs = await client.fetch(query);
    console.log(`📊 Found ${stylingConfigs.length} styling configuration(s)`);
    
    if (stylingConfigs.length === 0) {
      console.log('ℹ️  No styling configurations found. This is expected for a new schema.');
      console.log('📝 You can create a new configuration in Sanity Studio at:');
      console.log('   http://localhost:3333/structure/pastConferencesSectionStyling');
    } else {
      stylingConfigs.forEach((config, index) => {
        console.log(`\n🎨 Configuration ${index + 1}:`);
        console.log('  Title:', config.title);
        console.log('  ID:', config._id);
        console.log('  Active:', config.isActive ? '✅ Yes' : '❌ No');
        console.log('  Background Image:', config.backgroundImageUrl || 'Not set');
        console.log('  Background Position:', config.backgroundPosition || 'Not set');
        console.log('  Background Size:', config.backgroundSize || 'Not set');
        console.log('  Overlay Color:', config.overlayColor?.hex || 'Not set');
        console.log('  Overlay Opacity:', config.overlayOpacity || 'Not set');
        console.log('  Fallback Gradient:', config.fallbackGradient?.enabled ? '✅ Enabled' : '❌ Disabled');
      });
    }
    
    // Test the frontend data fetching function
    console.log('\n🔍 Testing frontend data fetching function...');
    
    // Import the frontend function
    const { getPastConferencesSectionStyling } = require('./nextjs-frontend/src/app/getPastConferencesSectionStyling');
    
    const frontendData = await getPastConferencesSectionStyling();
    console.log('📦 Frontend function result:');
    console.log('  Type:', typeof frontendData);
    console.log('  Is Active:', frontendData?.isActive || false);
    console.log('  Has Background Image:', !!frontendData?.backgroundImageUrl);
    console.log('  Overlay Color:', frontendData?.overlayColor?.hex || 'Not set');
    
    console.log('\n✅ Past Conferences Styling system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing Past Conferences Styling:', error);
    
    if (error.message.includes('Unknown type')) {
      console.log('\n💡 This error suggests the schema is not yet deployed to Sanity.');
      console.log('   Try restarting the Sanity Studio or check the schema registration.');
    }
  }
}

testPastConferencesStyling();
