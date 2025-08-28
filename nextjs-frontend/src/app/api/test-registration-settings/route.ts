import { NextResponse } from 'next/server';
import { getRegistrationSettings } from '@/app/getRegistrationSettings';

export async function GET() {
  try {
    const settings = await getRegistrationSettings();
    
    return NextResponse.json({
      success: true,
      settings,
      heroSection: settings?.heroSection,
      backgroundImage: settings?.heroSection?.backgroundImage,
      imageUrl: settings?.heroSection?.backgroundImage?.asset?.url,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
