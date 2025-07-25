import { NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🚀 Starting to populate media partners...');

    // Check if media partners already exist
    const existingPartners = await writeClient.fetch('*[_type == "mediaPartners"]');
    
    if (existingPartners.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Found ${existingPartners.length} existing media partners. Skipping creation to avoid duplicates.`,
        note: 'If you want to recreate them, please delete existing partners first.',
        count: existingPartners.length
      });
    }

    // Sample media partners data
    const samplePartners = [
      {
        _type: 'mediaPartners',
        companyName: 'All Conference Alert',
        website: 'https://allconferencealert.com',
        description: 'Global platform for conference alerts and academic event notifications.',
        isActive: true
      },
      {
        _type: 'mediaPartners',
        companyName: 'Conference XT',
        website: 'https://conferencext.com',
        description: 'Leading conference management and promotion platform.',
        isActive: true
      },
      {
        _type: 'mediaPartners',
        companyName: 'International Conference Alerts',
        website: 'https://intlconferencealerts.com',
        description: 'Comprehensive database of international academic conferences.',
        isActive: true
      },
      {
        _type: 'mediaPartners',
        companyName: 'Conferences in Europe',
        website: 'https://conferencesineurope.com',
        description: 'Premier platform for European academic conferences and events.',
        isActive: true
      },
      {
        _type: 'mediaPartners',
        companyName: 'Events Notification',
        website: 'https://eventsnotification.com',
        description: 'Global events and conference notification service.',
        isActive: true
      },
      {
        _type: 'mediaPartners',
        companyName: 'Conference Alerts',
        website: 'https://conferencealerts.com',
        description: 'Worldwide conference alerts and academic event listings.',
        isActive: true
      },
      {
        _type: 'mediaPartners',
        companyName: 'Vydya Health',
        website: 'https://vydyahealth.com',
        description: 'Healthcare information and medical conference platform.',
        isActive: true
      },
      {
        _type: 'mediaPartners',
        companyName: 'Conference Alert',
        website: 'https://conferencealert.com',
        description: 'Academic conference discovery and notification platform.',
        isActive: true
      }
    ];

    console.log('📝 Creating media partners...');
    
    // Create all media partners
    const results = await Promise.all(
      samplePartners.map(partner => writeClient.create(partner))
    );

    console.log(`✅ Successfully created ${results.length} media partners!`);

    return NextResponse.json({
      success: true,
      message: `Successfully created ${results.length} media partners!`,
      data: results.map(r => ({ id: r._id, companyName: r.companyName })),
      count: results.length,
      nextSteps: [
        'Visit http://localhost:3000/media-partners to view the partners',
        'Visit http://localhost:3333 to manage them in Sanity Studio',
        'Upload company logos through Sanity Studio to complete the setup'
      ]
    });

  } catch (error) {
    console.error('❌ Error populating media partners:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to populate media partners',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
