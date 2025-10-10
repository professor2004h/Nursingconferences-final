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

async function checkGalleryItems() {
  try {
    console.log('🔍 Fetching all gallery items from Sanity...\n');
    
    const galleries = await client.fetch(
      `*[_type == "pastConferenceGallery"] | order(conferenceDate desc) {
        _id,
        title,
        conferenceDate,
        location,
        isActive,
        "imageCount": count(galleryImages)
      }`
    );

    if (!galleries || galleries.length === 0) {
      console.log('❌ No gallery items found!');
      return;
    }

    console.log(`📊 Found ${galleries.length} gallery item(s):\n`);
    console.log('=====================================');
    
    galleries.forEach((gallery, index) => {
      console.log(`\n${index + 1}. ${gallery.title}`);
      console.log(`   ID: ${gallery._id}`);
      console.log(`   Date: ${gallery.conferenceDate}`);
      console.log(`   Location: ${gallery.location}`);
      console.log(`   Images: ${gallery.imageCount}`);
      console.log(`   Active: ${gallery.isActive ? '✅ YES' : '❌ NO'}`);
    });
    
    console.log('\n=====================================');
    
    const activeCount = galleries.filter(g => g.isActive).length;
    const inactiveCount = galleries.filter(g => !g.isActive).length;
    
    console.log(`\n📈 Summary:`);
    console.log(`   Total galleries: ${galleries.length}`);
    console.log(`   Active galleries: ${activeCount}`);
    console.log(`   Inactive galleries: ${inactiveCount}`);
    
    console.log('\n💡 Logic:');
    if (activeCount > 0) {
      console.log('   ✅ At least one gallery is active → Gallery link SHOULD be visible');
    } else {
      console.log('   ❌ No active galleries → Gallery link SHOULD be hidden');
    }
    
  } catch (error) {
    console.error('❌ Error fetching gallery items:', error.message);
  }
}

checkGalleryItems();

