import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from SanityBackend directory
dotenv.config({ path: join(__dirname, 'SanityBackend', '.env') });

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
});

async function checkGallerySettings() {
  try {
    console.log('🔍 Fetching current gallery settings from Sanity...\n');
    
    const settings = await client.fetch(
      `*[_type == "gallerySettings"][0]`
    );

    if (!settings) {
      console.log('❌ Gallery settings not found!');
      return;
    }

    console.log('📊 Current Gallery Settings in Sanity:');
    console.log('=====================================');
    console.log('Document ID:', settings._id);
    console.log('Show Gallery:', settings.showGallery);
    console.log('Navigation Label:', settings.navigationLabel);
    console.log('Show on Homepage:', settings.showOnHomepage);
    console.log('Last Updated:', settings._updatedAt);
    console.log('');
    
    if (settings.showGallery) {
      console.log('✅ Gallery is ENABLED - Should be visible in navigation');
    } else {
      console.log('❌ Gallery is DISABLED - Should be hidden from navigation');
    }
    
  } catch (error) {
    console.error('❌ Error fetching gallery settings:', error.message);
  }
}

checkGallerySettings();

