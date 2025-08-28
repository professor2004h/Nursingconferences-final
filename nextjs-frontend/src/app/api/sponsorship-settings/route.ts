import { NextResponse } from 'next/server';
import { getSponsorshipSettings, getDefaultSponsorshipSettings } from '../../getSponsorshipSettings';

export async function GET() {
  try {
    const settings = await getSponsorshipSettings();
    
    if (!settings) {
      // Return default settings if none found
      return NextResponse.json(getDefaultSponsorshipSettings());
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching sponsorship settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sponsorship settings' },
      { status: 500 }
    );
  }
}
