import { NextResponse } from 'next/server';
import { getConferencesRedirect } from '../../getConferencesRedirect';

export async function GET() {
  try {
    const redirectConfig = await getConferencesRedirect();
    
    if (!redirectConfig) {
      return NextResponse.json(
        { error: 'No redirect configuration found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      redirectUrl: redirectConfig.redirectUrl,
      isActive: redirectConfig.isActive,
      description: redirectConfig.description,
    });
  } catch (error) {
    console.error('Error fetching conferences redirect:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redirect configuration' },
      { status: 500 }
    );
  }
}
