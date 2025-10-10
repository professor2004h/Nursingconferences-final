import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    // Check if there are any active galleries
    const query = `count(*[_type == "pastConferenceGallery" && isActive == true])`;

    const activeGalleryCount = await client.fetch(query, {}, {
      next: { revalidate: 0 }, // No cache
      cache: 'no-store'
    });

    // Show gallery link only if there are active galleries
    const showGallery = activeGalleryCount > 0;

    return NextResponse.json({
      showGallery: showGallery,
      navigationLabel: 'Gallery',
      showOnHomepage: false,
      activeGalleryCount: activeGalleryCount
    });
  } catch (error) {
    console.error('Error fetching gallery settings:', error);
    // Return default values on error - hide gallery if error
    return NextResponse.json({
      showGallery: false,
      navigationLabel: 'Gallery',
      showOnHomepage: false,
      activeGalleryCount: 0
    });
  }
}

