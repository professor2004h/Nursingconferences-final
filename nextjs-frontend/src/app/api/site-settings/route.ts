import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings } from '../../getSiteSettings';

export async function GET(_request: NextRequest) {
  try {
    console.log('🔍 API: Fetching site settings for admin contact info...');
    
    const siteSettings = await getSiteSettings();
    
    if (!siteSettings) {
      console.log('⚠️ API: No site settings found');
      return NextResponse.json({ error: 'Site settings not found' }, { status: 404 });
    }

    console.log('✅ API: Site settings fetched successfully');
    console.log('📧 Contact info:', siteSettings.contactInfo);
    
    return NextResponse.json(siteSettings);
  } catch (error) {
    console.error('❌ API: Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}
