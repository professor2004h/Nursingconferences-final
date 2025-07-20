import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET(request: NextRequest) {
  try {
    console.log('📝 Fetching sponsorship tiers...');

    // Fetch sponsorship tiers from Sanity
    const query = `*[_type == "sponsorshipTiersRegistration"] | order(displayOrder asc) {
      _id,
      tierName,
      tierLevel,
      price,
      description,
      benefits,
      inclusions,
      isActive,
      displayOrder,
      maxSponsors,
      currentSponsors,
      availableFrom,
      availableUntil,
      highlightColor
    }`;

    const tiers = await client.fetch(query);

    console.log('✅ Sponsorship tiers fetched successfully:', tiers.length);

    return NextResponse.json(tiers);
  } catch (error) {
    console.error('❌ Error fetching sponsorship tiers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sponsorship tiers' },
      { status: 500 }
    );
  }
}
