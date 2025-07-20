import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET(request: NextRequest) {
  try {
    console.log('📝 Fetching registration types...');

    // Fetch registration types from Sanity
    const query = `*[_type == "registrationTypes"] | order(displayOrder asc) {
      _id,
      name,
      category,
      description,
      pricing,
      benefits,
      isActive,
      displayOrder,
      maxParticipants,
      availableFrom,
      availableUntil
    }`;

    const types = await client.fetch(query);

    console.log('✅ Registration types fetched successfully:', types.length);

    return NextResponse.json(types);
  } catch (error) {
    console.error('❌ Error fetching registration types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration types' },
      { status: 500 }
    );
  }
}
