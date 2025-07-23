import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🏨 Fetching venue settings from Sanity...');
    
    // Query for active venue settings
    const query = `
      *[_type == "venueSettings" && isActive == true][0]{
        _id,
        title,
        subtitle,
        venueName,
        venueAddress,
        contactInformation,
        checkInOut,
        amenities,
        venueImages[]{
          asset->{
            url,
            _id
          },
          alt,
          caption
        },
        locationDescription,
        mapConfiguration,
        transportation,
        localAttractions,
        additionalInformation,
        isActive,
        lastUpdated
      }
    `;

    const venueSettings = await client.fetch(query);
    
    if (!venueSettings) {
      console.log('⚠️ No active venue settings found');
      return NextResponse.json({
        success: false,
        data: null,
        error: 'No venue settings found'
      });
    }

    console.log(`✅ Found venue settings: ${venueSettings.venueName}`);
    
    return NextResponse.json({
      success: true,
      data: venueSettings
    });

  } catch (error) {
    console.error('❌ Error fetching venue settings:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch venue settings'
    }, { status: 500 });
  }
}
