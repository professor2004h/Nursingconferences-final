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
        // Project hero image url for header background
        "heroImageUrl": heroImage.asset->url,
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

    // Fetch from Sanity
    const venueSettings = await client.fetch(query);

    // Normalize heroImageUrl for frontend safety
    const normalized = {
      ...venueSettings,
      heroImageUrl: venueSettings?.heroImageUrl || venueSettings?.heroImage?.asset?.url || null
    };
    
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
      data: normalized
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
