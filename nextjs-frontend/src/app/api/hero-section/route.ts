import { NextResponse } from 'next/server';
import { getHeroSection } from '../../getHeroSection';

export async function GET() {
  try {
    console.log('🎯 API: Fetching hero section data from Sanity CMS...');

    const heroData = await getHeroSection();

    console.log('🎯 API: Hero section data fetched:', {
      hasData: !!heroData,
      conferenceTitle: heroData?.conferenceTitle,
      conferenceSubject: heroData?.conferenceSubject,
      conferenceDate: heroData?.conferenceDate,
      showRegisterButton: heroData?.showRegisterButton
    });

    // Create response with hero data
    const response = NextResponse.json(heroData || {
      conferenceTitle: 'INTERNATIONAL CONFERENCE ON',
      conferenceSubject: 'MATERIAL CHEMISTRY & NANO MATERIALS',
      conferenceTheme: 'Theme: Innovative Frontiers in Material Chemistry and Nanotechnology for Sustainable Future',
      conferenceDate: 'June 23-24, 2025',
      conferenceVenue: 'Hotel Indigo Kuala Lumpur On The Park, Kuala Lumpur, Malaysia',
      abstractSubmissionInfo: 'Abstract Submission Opens: March 20, 2024',
      registrationInfo: 'Early Bird Registration Start: April 15, 2024',
      showRegisterButton: true,
      registerButtonText: 'Register Now',
      registerButtonUrl: '/registration'
    });

    // Set headers for caching
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    response.headers.set('X-Data-Source', heroData ? 'sanity-cms' : 'fallback');
    response.headers.set('X-Last-Updated', new Date().toISOString());

    return response;
  } catch (error) {
    console.error('❌ API: Error fetching hero section data:', error);

    const errorResponse = NextResponse.json({
      error: 'Failed to fetch hero section data',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      fallback: {
        conferenceTitle: 'INTERNATIONAL CONFERENCE ON',
        conferenceSubject: 'MATERIAL CHEMISTRY & NANO MATERIALS',
        conferenceTheme: 'Theme: Innovative Frontiers in Material Chemistry and Nanotechnology for Sustainable Future',
        conferenceDate: 'June 23-24, 2025',
        conferenceVenue: 'Hotel Indigo Kuala Lumpur On The Park, Kuala Lumpur, Malaysia',
        abstractSubmissionInfo: 'Abstract Submission Opens: March 20, 2024',
        registrationInfo: 'Early Bird Registration Start: April 15, 2024',
        showRegisterButton: true,
        registerButtonText: 'Register Now',
        registerButtonUrl: '/registration'
      }
    }, { status: 500 });

    errorResponse.headers.set('X-Data-Source', 'error-fallback');
    errorResponse.headers.set('X-Error', error instanceof Error ? error.message : 'Unknown error');

    return errorResponse;
  }
}
