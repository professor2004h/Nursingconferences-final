import { NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🧪 Testing venue settings without location data...');
    
    // Check if venue settings exist
    const existingSettings = await writeClient.fetch(`
      *[_type == "venueSettings"][0]{
        _id,
        venueName
      }
    `);

    if (!existingSettings) {
      return NextResponse.json({
        success: false,
        message: 'No venue settings found. Please populate venue settings first.',
        error: 'No venue settings document found'
      }, { status: 404 });
    }

    // Update venue settings to remove location data
    const testData = {
      title: 'Venue & Hospitality',
      subtitle: 'Conference venue and accommodation information',
      venueName: 'Test Conference Venue (No Location Data)',
      // Remove venueAddress, mapConfiguration, locationDescription, transportation
      contactInformation: {
        phone: '+81 (0) 476 33 1354',
        email: 'contact@inovineconferences.com',
        organizerNote: 'While you are calling to hotel reception please mention name of the organizer INOVINE CONFERENCES'
      },
      checkInOut: {
        checkInTime: '2:00 PM',
        checkOutTime: '11:00 AM',
        groupRateNote: 'Group rate will be honored 3 days pre and post event days.'
      },
      amenities: [
        'Complimentary Breakfast',
        'Complimentary Wi-Fi',
        'Free On Site Parking',
        'In House Restaurant',
        'Gym'
      ],
      venueImages: [
        {
          _type: 'image',
          alt: 'Mount Fuji with Chureito Pagoda and cherry blossoms',
          caption: 'Iconic view of Mount Fuji with traditional Japanese pagoda during cherry blossom season'
        },
        {
          _type: 'image',
          alt: 'Tokyo Tower illuminated at night',
          caption: 'Tokyo Tower glowing against the city skyline at sunset'
        }
      ],
      additionalInformation: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'This is a test configuration with no location data to verify conditional rendering works correctly.'
            }
          ]
        }
      ],
      isActive: true,
      lastUpdated: new Date().toISOString()
    };

    console.log('📝 Updating venue settings to remove location data...');
    const result = await writeClient
      .patch(existingSettings._id)
      .set(testData)
      .commit();
    
    console.log('✅ Successfully updated venue settings without location data');

    return NextResponse.json({
      success: true,
      message: 'Venue settings updated to test no-location scenario',
      data: result
    });

  } catch (error) {
    console.error('❌ Error updating venue settings for test:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update venue settings for test',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
