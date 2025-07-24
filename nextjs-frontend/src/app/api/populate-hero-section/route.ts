import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// Create a write client with token for creating documents
const writeClient = createClient({
  projectId: 'n3no08m3',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03'
});

// Sample hero section data for nursing conference
const sampleHeroData = {
  _type: 'heroSection',
  conferenceTitle: 'INTERNATIONAL CONFERENCE ON',
  conferenceSubject: 'NURSING',
  conferenceTheme: 'Theme: Advancing Excellence in Nursing Practice, Education, and Research for Global Healthcare',
  conferenceDate: 'June 23-24, 2025',
  conferenceVenue: 'Hotel Indigo Kuala Lumpur On The Park, Kuala Lumpur, Malaysia',
  abstractSubmissionInfo: 'Abstract Submission Opens: March 20, 2024',
  registrationInfo: 'Early Bird Registration Start: April 15, 2024',
  showRegisterButton: true,
  registerButtonText: 'Register Now',
  registerButtonUrl: '/registration',
  textColor: {
    hex: '#ffffff',
    alpha: 1
  },
  slideshowSettings: {
    enableSlideshow: true,
    overlayColor: '#000000',
    overlayOpacity: 50,
    transitionDuration: 5,
    enableZoomEffect: true,
    enableFadeTransition: true,
    showNavigationDots: true
  },
  images: [] // Will be populated with uploaded images
};

export async function POST() {
  try {
    console.log('🎯 Starting hero section data population...');

    // Check if writeClient has a token
    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json({
        success: false,
        message: 'SANITY_API_TOKEN environment variable is required for write operations. Please add it to your .env.local file.',
        instructions: [
          '1. Go to https://sanity.io/manage',
          '2. Select your project (n3no08m3)',
          '3. Go to API > Tokens',
          '4. Create a new token with "Editor" permissions',
          '5. Add SANITY_API_TOKEN=your_token to .env.local file',
          '6. Restart the Next.js server'
        ]
      }, { status: 400 });
    }

    // Check if hero section already exists
    const existingHero = await writeClient.fetch(`*[_type == "heroSection"][0]`);
    
    if (existingHero) {
      // Update existing hero section
      console.log('📝 Updating existing hero section...');
      const result = await writeClient
        .patch(existingHero._id)
        .set({
          conferenceTitle: sampleHeroData.conferenceTitle,
          conferenceSubject: sampleHeroData.conferenceSubject,
          conferenceTheme: sampleHeroData.conferenceTheme,
          conferenceDate: sampleHeroData.conferenceDate,
          conferenceVenue: sampleHeroData.conferenceVenue,
          abstractSubmissionInfo: sampleHeroData.abstractSubmissionInfo,
          registrationInfo: sampleHeroData.registrationInfo,
          showRegisterButton: sampleHeroData.showRegisterButton,
          registerButtonText: sampleHeroData.registerButtonText,
          registerButtonUrl: sampleHeroData.registerButtonUrl,
          textColor: sampleHeroData.textColor,
          slideshowSettings: sampleHeroData.slideshowSettings
        })
        .commit();

      console.log('✅ Updated existing hero section:', result._id);
      
      return NextResponse.json({
        success: true,
        message: 'Successfully updated hero section with conference data!',
        action: 'updated',
        heroId: result._id,
        data: {
          conferenceTitle: sampleHeroData.conferenceTitle,
          conferenceSubject: sampleHeroData.conferenceSubject,
          conferenceDate: sampleHeroData.conferenceDate,
          conferenceVenue: sampleHeroData.conferenceVenue
        },
        nextSteps: [
          'Upload background images in Sanity Studio',
          'Visit http://localhost:3333/structure/heroSection to manage content',
          'Check http://localhost:3000 to see the updated hero section'
        ]
      });
    } else {
      // Create new hero section
      console.log('📝 Creating new hero section...');
      const result = await writeClient.create(sampleHeroData);
      
      console.log('✅ Created new hero section:', result._id);
      
      return NextResponse.json({
        success: true,
        message: 'Successfully created hero section with conference data!',
        action: 'created',
        heroId: result._id,
        data: {
          conferenceTitle: sampleHeroData.conferenceTitle,
          conferenceSubject: sampleHeroData.conferenceSubject,
          conferenceDate: sampleHeroData.conferenceDate,
          conferenceVenue: sampleHeroData.conferenceVenue
        },
        nextSteps: [
          'Upload background images in Sanity Studio',
          'Visit http://localhost:3333/structure/heroSection to manage content',
          'Check http://localhost:3000 to see the new hero section'
        ]
      });
    }
    
  } catch (error) {
    console.error('❌ Error in hero section population:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to populate hero section data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
