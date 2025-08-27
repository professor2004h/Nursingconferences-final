import { NextResponse } from 'next/server';
import { getExhibitorsSettings } from '../../getExhibitorsSettings';

export async function GET() {
  try {
    const settings = await getExhibitorsSettings();
    
    if (!settings) {
      // Return default settings if none found
      return NextResponse.json({
        showExhibitors: true,
        sectionTitle: 'Exhibitors',
        navigationLabel: 'Exhibitors',
        showOnHomepage: true,
        homepageDisplayLimit: 6,
      });
    }

    return NextResponse.json({
      showExhibitors: settings.showExhibitors,
      sectionTitle: settings.sectionTitle,
      sectionDescription: settings.sectionDescription,
      navigationLabel: settings.navigationLabel,
      showOnHomepage: settings.showOnHomepage,
      homepageDisplayLimit: settings.homepageDisplayLimit,
    });
  } catch (error) {
    console.error('Error fetching exhibitors settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exhibitors settings' },
      { status: 500 }
    );
  }
}
