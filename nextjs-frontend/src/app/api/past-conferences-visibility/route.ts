import { NextResponse } from 'next/server';
import { getPastConferencesRedirect } from '../../getPastConferencesRedirect';

export async function GET() {
  try {
    console.log('🔍 API: Checking past conferences visibility...');
    
    const redirectConfig = await getPastConferencesRedirect();
    
    console.log('📊 API: Past conferences config:', redirectConfig);
    
    if (!redirectConfig) {
      console.log('❌ API: No past conferences configuration found');
      return NextResponse.json({
        showPastConferences: false,
        error: 'No configuration found'
      });
    }

    // Return the showInMenu value from Sanity
    const showPastConferences = redirectConfig.showInMenu === true;
    
    console.log('✅ API: Returning showPastConferences =', showPastConferences);
    
    return NextResponse.json({
      showPastConferences,
      isActive: redirectConfig.isActive,
      redirectUrl: redirectConfig.redirectUrl,
      lastUpdated: redirectConfig.lastUpdated
    });
  } catch (error) {
    console.error('❌ API: Error fetching past conferences visibility:', error);
    return NextResponse.json(
      { 
        showPastConferences: false,
        error: 'Failed to fetch visibility setting' 
      },
      { status: 500 }
    );
  }
}
