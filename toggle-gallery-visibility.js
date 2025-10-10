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

async function toggleGalleryVisibility() {
  try {
    console.log('🔍 Fetching current gallery settings...\n');
    
    // Fetch current settings
    const settings = await client.fetch(
      `*[_type == "gallerySettings"][0]`
    );

    if (!settings) {
      console.log('❌ Gallery settings not found!');
      console.log('💡 Run: node SanityBackend/create-gallery-settings.js');
      process.exit(1);
    }

    console.log('📊 Current Configuration:');
    console.log('   Document ID:', settings._id);
    console.log('   Show Gallery:', settings.showGallery);
    console.log('   Navigation Label:', settings.navigationLabel);
    console.log('   Show on Homepage:', settings.showOnHomepage);
    console.log('');
    
    // Toggle the current state
    const newShowGallery = !settings.showGallery;
    
    console.log(`🔄 Toggling showGallery from ${settings.showGallery} to ${newShowGallery}...`);
    
    const updatedDoc = await client
      .patch(settings._id)
      .set({ 
        showGallery: newShowGallery,
        lastUpdated: new Date().toISOString()
      })
      .commit();

    console.log('');
    console.log('✅ Gallery settings updated successfully!');
    console.log('');
    console.log('📊 New Configuration:');
    console.log('   Show Gallery:', updatedDoc.showGallery);
    console.log('   Navigation Label:', updatedDoc.navigationLabel);
    console.log('');
    
    if (updatedDoc.showGallery) {
      console.log('🎉 Gallery is now VISIBLE in the navigation menu!');
      console.log('📍 Look for "' + updatedDoc.navigationLabel + '" in the More dropdown');
    } else {
      console.log('🔒 Gallery is now HIDDEN from the navigation menu!');
      console.log('📍 The "' + updatedDoc.navigationLabel + '" link will not appear in the More dropdown');
    }
    
    console.log('');
    console.log('⏱️  Changes will appear in ~30 seconds (due to caching)');
    console.log('💡 Hard refresh your browser (Ctrl+Shift+R) to see changes immediately');
    console.log('');
    console.log('🌐 Website: http://localhost:3000');
    console.log('⚙️  Sanity Studio: http://localhost:3333/structure/gallerySettings');
    
  } catch (error) {
    console.error('❌ Error toggling gallery visibility:', error);
    process.exit(1);
  }
}

toggleGalleryVisibility();

