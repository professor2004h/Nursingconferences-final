import { client } from './sanity/client';
import { VenueSettings } from './types/venueSettings';

export async function getVenueSettings(): Promise<VenueSettings | null> {
  try {
    console.log('🏨 Fetching venue settings for home page...');
    
    const query = `
      *[_type == "venueSettings" && isActive == true][0]{
        _id,
        title,
        subtitle,
        venueName,
        venueAddress,
        venueImages[]{
          asset->{
            url,
            _id
          },
          alt,
          caption
        },
        locationDescription,
        isActive
      }
    `;

    const venueSettings = await client.fetch(query, {}, {
      next: {
        revalidate: process.env.NODE_ENV === 'development' ? 1 : 60, // 1 second in dev, 1 minute in production
        tags: ['venue-settings'] // Cache tag for targeted revalidation
      },
    });
    
    if (!venueSettings) {
      console.log('⚠️ No active venue settings found for home page');
      return null;
    }

    console.log(`✅ Found venue settings for home page: ${venueSettings.venueName}`);
    return venueSettings;

  } catch (error) {
    console.error('❌ Error fetching venue settings for home page:', error);
    return null;
  }
}
