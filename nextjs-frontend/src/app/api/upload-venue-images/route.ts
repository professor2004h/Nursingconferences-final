import { NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

// Image data for the venue gallery
const venueImageData = [
  {
    url: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&h=600&fit=crop',
    alt: 'Mount Fuji with Chureito Pagoda and cherry blossoms',
    caption: 'Iconic view of Mount Fuji with traditional Japanese pagoda during cherry blossom season',
    filename: 'mount-fuji-pagoda-cherry-blossoms.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    alt: 'Tokyo Tower illuminated at night',
    caption: 'Tokyo Tower glowing against the city skyline at sunset',
    filename: 'tokyo-tower-night.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1522637710340-4314d0b8e6b8?w=800&h=600&fit=crop',
    alt: 'Shinjuku Gyoen National Garden with cherry blossoms',
    caption: 'Beautiful cherry blossoms in Shinjuku Gyoen with Tokyo skyline in background',
    filename: 'shinjuku-gyoen-cherry-blossoms.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop',
    alt: 'Sensoji Temple in Asakusa at night',
    caption: 'Historic Sensoji Temple beautifully illuminated in the evening',
    filename: 'sensoji-temple-night.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&h=600&fit=crop',
    alt: 'Tokyo cityscape with Mount Fuji and Tokyo Tower',
    caption: 'Stunning panoramic view of Tokyo with Mount Fuji and Tokyo Tower',
    filename: 'tokyo-cityscape-fuji-tower.jpg'
  }
];

async function uploadImageToSanity(imageData: typeof venueImageData[0]) {
  try {
    console.log(`📸 Uploading image: ${imageData.filename}`);
    
    // Fetch the image from URL
    const response = await fetch(imageData.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Upload to Sanity
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: imageData.filename,
      contentType: 'image/jpeg'
    });
    
    console.log(`✅ Successfully uploaded: ${imageData.filename}`);
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      },
      alt: imageData.alt,
      caption: imageData.caption
    };
  } catch (error) {
    console.error(`❌ Error uploading ${imageData.filename}:`, error);
    throw error;
  }
}

export async function GET() {
  try {
    console.log('🏨 Starting venue image upload process...');
    
    // Check if venue settings exist
    const existingSettings = await writeClient.fetch(`
      *[_type == "venueSettings"][0]{
        _id,
        venueName,
        venueImages
      }
    `);
    
    if (!existingSettings) {
      return NextResponse.json({
        success: false,
        message: 'Venue settings not found. Please populate venue settings first.',
        error: 'No venue settings document found'
      }, { status: 404 });
    }
    
    console.log('📋 Found existing venue settings, uploading images...');
    
    // Upload all images
    const uploadedImages = [];
    for (const imageData of venueImageData) {
      try {
        const uploadedImage = await uploadImageToSanity(imageData);
        uploadedImages.push(uploadedImage);
      } catch (error) {
        console.error(`Failed to upload ${imageData.filename}:`, error);
        // Continue with other images even if one fails
      }
    }
    
    if (uploadedImages.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Failed to upload any images',
        error: 'All image uploads failed'
      }, { status: 500 });
    }
    
    // Update venue settings with uploaded images
    console.log('📝 Updating venue settings with uploaded images...');
    const result = await writeClient
      .patch(existingSettings._id)
      .set({ 
        venueImages: uploadedImages,
        lastUpdated: new Date().toISOString()
      })
      .commit();
    
    console.log(`✅ Successfully uploaded ${uploadedImages.length} images and updated venue settings`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedImages.length} venue images`,
      data: {
        uploadedCount: uploadedImages.length,
        totalAttempted: venueImageData.length,
        venueSettings: result
      }
    });
    
  } catch (error) {
    console.error('❌ Error in venue image upload process:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to upload venue images',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  // Allow POST method as well for flexibility
  return GET();
}
