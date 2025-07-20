import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET(request: NextRequest) {
  try {
    console.log('📝 Fetching registration settings...');

    // Fetch registration settings from Sanity
    const query = `*[_type == "registrationSettings"][0] {
      _id,
      pricingDates,
      conferenceDetails,
      registrationStatus,
      paymentSettings,
      formSettings
    }`;

    const settings = await client.fetch(query);

    if (!settings) {
      return NextResponse.json(
        { error: 'Registration settings not found' },
        { status: 404 }
      );
    }

    console.log('✅ Registration settings fetched successfully');

    return NextResponse.json(settings);
  } catch (error) {
    console.error('❌ Error fetching registration settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration settings' },
      { status: 500 }
    );
  }
}
