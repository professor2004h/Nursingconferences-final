import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
});

async function createGallerySettings() {
  try {
    console.log('🔍 Checking for existing gallery settings...');
    
    // Check if gallery settings already exist
    const existingSettings = await client.fetch(
      `*[_type == "gallerySettings"][0]`
    );

    if (existingSettings) {
      console.log('✅ Gallery settings already exist:');
      console.log('   Document ID:', existingSettings._id);
      console.log('   Show Gallery:', existingSettings.showGallery);
      console.log('   Navigation Label:', existingSettings.navigationLabel);
      console.log('   Show on Homepage:', existingSettings.showOnHomepage);
      console.log('\n💡 You can update these settings in Sanity Studio.');
      return;
    }

    console.log('📝 Creating new gallery settings document...');

    const gallerySettings = {
      _type: 'gallerySettings',
      title: 'Gallery Settings',
      showGallery: true,
      navigationLabel: 'Gallery',
      showOnHomepage: false,
    };

    const result = await client.create(gallerySettings);

    console.log('✅ Gallery settings created successfully!');
    console.log('   Document ID:', result._id);
    console.log('   Show Gallery:', result.showGallery);
    console.log('   Navigation Label:', result.navigationLabel);
    console.log('   Show on Homepage:', result.showOnHomepage);
    console.log('\n🎉 You can now toggle the Gallery visibility in Sanity Studio!');
    console.log('📍 Navigate to: Content > Gallery Settings');
    
  } catch (error) {
    console.error('❌ Error creating gallery settings:', error);
    process.exit(1);
  }
}

createGallerySettings();

