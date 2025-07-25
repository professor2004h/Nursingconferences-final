import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('📸 Fetching conference galleries...');

    const query = `*[_type == "pastConferenceGallery" && isActive == true] | order(conferenceDate desc) {
      _id,
      title,
      conferenceDate,
      location,
      galleryImages[]{
        asset->{
          url,
          _id
        },
        alt,
        caption
      }
    }`;

    const galleries = await client.fetch(query);

    console.log(`✅ Successfully fetched ${galleries.length} conference galleries`);

    return NextResponse.json({
      success: true,
      data: galleries,
      count: galleries.length
    });
  } catch (error) {
    console.error('❌ Error fetching conference galleries:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conference galleries',
        data: []
      },
      { status: 500 }
    );
  }
}


