import { NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🚀 Starting to populate past conference galleries...');

    // Check if galleries already exist
    const existingGalleries = await writeClient.fetch('*[_type == "pastConferenceGallery"]');
    
    if (existingGalleries.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Found ${existingGalleries.length} existing galleries. Skipping creation to avoid duplicates.`,
        note: 'If you want to recreate them, please delete existing galleries first.',
        count: existingGalleries.length
      });
    }

    // Sample conference galleries data
    const sampleGalleries = [
      {
        _type: 'pastConferenceGallery',
        title: 'ICMCNM 2023: International Conference on Material Chemistry',
        conferenceDate: '2023-06-24',
        location: 'Tokyo, Japan',
        galleryImages: [
          {
            _type: 'image',
            alt: 'Conference opening ceremony',
            caption: 'Opening ceremony with international attendees'
          },
          {
            _type: 'image',
            alt: 'Keynote presentation',
            caption: 'Dr. Sarah Johnson delivering keynote on nanotechnology'
          },
          {
            _type: 'image',
            alt: 'Poster session',
            caption: 'Researchers presenting their latest findings'
          },
          {
            _type: 'image',
            alt: 'Networking event',
            caption: 'Networking dinner bringing together researchers'
          },
          {
            _type: 'image',
            alt: 'Awards ceremony',
            caption: 'Best Paper Award ceremony'
          }
        ],
        isActive: true
      },
      {
        _type: 'pastConferenceGallery',
        title: 'ICNH 2022: International Conference on Nursing & Healthcare',
        conferenceDate: '2022-09-15',
        location: 'Singapore',
        galleryImages: [
          {
            _type: 'image',
            alt: 'Keynote speaker addressing nursing professionals',
            caption: 'Prof. Maria Rodriguez on Digital Transformation in Healthcare'
          },
          {
            _type: 'image',
            alt: 'Workshop session on patient care',
            caption: 'Hands-on workshop demonstrating patient care techniques'
          },
          {
            _type: 'image',
            alt: 'Nursing research posters',
            caption: 'Graduate students showcasing their research findings'
          },
          {
            _type: 'image',
            alt: 'Group photo of attendees',
            caption: 'International nursing professionals group photo'
          }
        ],
        isActive: true
      },
      {
        _type: 'pastConferenceGallery',
        title: 'ICBM 2021: International Conference on Biomedical Sciences',
        conferenceDate: '2021-11-20',
        location: 'London, United Kingdom',
        galleryImages: [
          {
            _type: 'image',
            alt: 'Hybrid conference presentation',
            caption: 'Innovative hybrid format connecting global community'
          },
          {
            _type: 'image',
            alt: 'Biomedical research exhibition',
            caption: 'Cutting-edge biomedical research on display'
          },
          {
            _type: 'image',
            alt: 'COVID-19 research panel',
            caption: 'Expert panel discussing pandemic research'
          }
        ],
        isActive: true
      }
    ];

    console.log('📝 Creating past conference galleries...');
    
    // Create all galleries
    const results = await Promise.all(
      sampleGalleries.map(gallery => writeClient.create(gallery))
    );

    console.log(`✅ Successfully created ${results.length} past conference galleries!`);

    return NextResponse.json({
      success: true,
      message: `Successfully created ${results.length} simple conference galleries!`,
      data: results.map(r => ({ id: r._id, title: r.title, location: r.location })),
      count: results.length,
      nextSteps: [
        'Visit http://localhost:3000/past-conference-gallery to view the galleries',
        'Visit http://localhost:3333 to manage them in Sanity Studio',
        'Upload actual conference images through Sanity Studio'
      ]
    });

  } catch (error) {
    console.error('❌ Error populating past conference galleries:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to populate past conference galleries',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
