import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

// GROQ query to fetch event schedule data
const EVENT_SCHEDULE_QUERY = `
  *[_type == "eventSchedule" && isActive == true] | order(displayOrder asc) [0] {
    title,
    isActive,
    days[] {
      dayNumber,
      date,
      displayDate,
      sessions[] {
        startTime,
        endTime,
        title,
        description,
        type,
        isHighlighted
      } | order(startTime asc)
    } | order(dayNumber asc),
    displayOrder
  }
`;

export async function GET(request: NextRequest) {
  try {
    console.log('🗓️ Fetching event schedule from Sanity...');

    // Fetch event schedule data from Sanity
    const scheduleData = await client.fetch(
      EVENT_SCHEDULE_QUERY,
      {},
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!scheduleData) {
      console.log('📅 No active event schedule found');
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No active event schedule found'
      });
    }

    console.log(`✅ Successfully fetched event schedule: ${scheduleData.title}`);
    console.log(`📊 Schedule has ${scheduleData.days?.length || 0} days`);

    return NextResponse.json({
      success: true,
      data: scheduleData,
      message: 'Event schedule fetched successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching event schedule:', error);
    
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: 'Failed to fetch event schedule',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
