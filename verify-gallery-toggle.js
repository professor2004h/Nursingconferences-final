import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, 'SanityBackend', '.env') });

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
});

async function verifyGalleryToggle() {
  try {
    console.log('🔍 Checking Gallery Toggle Status...\n');
    
    // Get all galleries
    const galleries = await client.fetch(
      `*[_type == "pastConferenceGallery"] {
        _id,
        title,
        isActive
      }`
    );

    // Count active galleries
    const activeCount = galleries.filter(g => g.isActive).length;
    const totalCount = galleries.length;

    console.log('📊 Gallery Items:');
    console.log('=====================================');
    galleries.forEach((gallery, index) => {
      const status = gallery.isActive ? '✅ ACTIVE' : '❌ INACTIVE';
      console.log(`${index + 1}. ${gallery.title}: ${status}`);
    });
    
    console.log('\n📈 Summary:');
    console.log(`   Total galleries: ${totalCount}`);
    console.log(`   Active galleries: ${activeCount}`);
    console.log(`   Inactive galleries: ${totalCount - activeCount}`);
    
    console.log('\n💡 Navigation Link Status:');
    if (activeCount > 0) {
      console.log('   ✅ Gallery link SHOULD BE VISIBLE in navigation');
      console.log(`   📍 Reason: ${activeCount} active ${activeCount === 1 ? 'gallery' : 'galleries'} found`);
    } else {
      console.log('   ❌ Gallery link SHOULD BE HIDDEN from navigation');
      console.log('   📍 Reason: No active galleries found');
    }
    
    console.log('\n🌐 API Response:');
    console.log('   Endpoint: http://localhost:3000/api/gallery-settings');
    console.log(`   Expected: {"showGallery":${activeCount > 0},"activeGalleryCount":${activeCount}}`);
    
    console.log('\n⏱️  Note:');
    console.log('   - Changes may take up to 30 seconds to appear (due to caching)');
    console.log('   - Hard refresh your browser (Ctrl+Shift+R) to see changes immediately');
    
    console.log('\n🎯 To Change:');
    if (activeCount === 0) {
      console.log('   To SHOW gallery link:');
      console.log('   1. Go to http://localhost:3333/structure/pastConferenceGallery');
      console.log('   2. Click on any gallery item');
      console.log('   3. Turn ON "Active Gallery" toggle');
      console.log('   4. Click "Publish"');
    } else {
      console.log('   To HIDE gallery link:');
      console.log('   1. Go to http://localhost:3333/structure/pastConferenceGallery');
      console.log('   2. Turn OFF "Active Gallery" on ALL gallery items');
      console.log('   3. Click "Publish" on each');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyGalleryToggle();

