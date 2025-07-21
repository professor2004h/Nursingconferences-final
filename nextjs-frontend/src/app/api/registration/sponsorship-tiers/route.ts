import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET(request: NextRequest) {
  try {
    console.log('📝 Fetching sponsorship tiers...');

    // Fetch sponsorship tiers from Sanity
    const query = `*[_type == "sponsorshipTiers"] | order(order asc) {
      _id,
      name,
      slug,
      price,
      description,
      benefits,
      color,
      active,
      order,
      featured
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
