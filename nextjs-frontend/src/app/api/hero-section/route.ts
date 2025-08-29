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

    if (!heroData) {
      return NextResponse.json(
        { error: 'No hero section data found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      hero: heroData
    });
  } catch (error) {
    console.error('🎯 API: Error fetching hero section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero section data' },
      { status: 500 }
    );
  }
}
