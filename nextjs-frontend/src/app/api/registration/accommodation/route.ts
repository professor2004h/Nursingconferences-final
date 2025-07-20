import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET(request: NextRequest) {
  try {
    console.log('📝 Fetching accommodation options...');

    // Fetch accommodation options from Sanity
    const query = `*[_type == "accommodationOptions"] | order(displayOrder asc) {
      _id,
      hotelName,
      description,
      pricing,
      amenities,
      location,
      isActive,
      displayOrder,
      maxRooms,
      currentBookings,
      availableFrom,
      availableUntil,
      images
    }`;

    const accommodations = await client.fetch(query);

    console.log('✅ Accommodation options fetched successfully:', accommodations.length);

    return NextResponse.json(accommodations);
  } catch (error) {
    console.error('❌ Error fetching accommodation options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accommodation options' },
      { status: 500 }
    );
  }
}
