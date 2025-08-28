import { NextResponse } from 'next/server';
import { getRegistrationSettingsWithFallback } from '@/app/getRegistrationSettings';
import { urlFor } from '@/app/sanity/client';

export async function GET() {
  try {
    const settings = await getRegistrationSettingsWithFallback();
    
    // Try to generate image URL if background image exists
    let imageUrl = null;
    if (settings?.heroSection?.backgroundImage) {
      try {
        imageUrl = urlFor(settings.heroSection.backgroundImage)
          .width(1920)
          .height(1080)
          .quality(90)
          .url();
      } catch (error) {
        console.error('Error generating image URL:', error);
        imageUrl = settings.heroSection.backgroundImage.asset?.url || null;
      }
    }
    
    return NextResponse.json({
      success: true,
      settings,
      heroSection: settings?.heroSection,
      backgroundImage: settings?.heroSection?.backgroundImage,
      generatedImageUrl: imageUrl,
      hasImage: !!settings?.heroSection?.backgroundImage,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
