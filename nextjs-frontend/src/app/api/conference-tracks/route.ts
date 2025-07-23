import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🎯 Fetching conference tracks from abstract settings...');
    
    // Query for track names from abstract settings
    const query = `
      *[_type == "abstractSettings"][0]{
        trackNames
      }
    `;

    const settings = await client.fetch(query);
    
    if (!settings || !settings.trackNames || settings.trackNames.length === 0) {
      console.log('⚠️ No track names found in abstract settings');
      return NextResponse.json({
        success: false,
        data: [],
        count: 0,
        error: 'No track names found'
      });
    }

    const trackNames = settings.trackNames;
    console.log(`✅ Found ${trackNames.length} conference tracks`);
    
    return NextResponse.json({
      success: true,
      data: trackNames,
      count: trackNames.length
    });

  } catch (error) {
    console.error('❌ Error fetching conference tracks:', error);
    
    return NextResponse.json({
      success: false,
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch conference tracks'
    }, { status: 500 });
  }
}
