import { NextResponse } from 'next/server';
import { getPastConferencesRedirect } from '../../getPastConferencesRedirect';

export async function GET() {
  try {
    const redirectConfig = await getPastConferencesRedirect();
    
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
      showInMenu: redirectConfig.showInMenu,
    });
  } catch (error) {
    console.error('Error fetching past conferences redirect:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redirect configuration' },
      { status: 500 }
    );
  }
}
