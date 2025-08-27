import { NextResponse } from 'next/server';
import { getPosterPresentersSettings } from '../../getPosterPresentersSettings';

export async function GET() {
  try {
    const settings = await getPosterPresentersSettings();
    
    if (!settings) {
      // Return default settings if none found
      return NextResponse.json({
        showPosterPresenters: true,
        sectionTitle: 'Poster Presenters',
        navigationLabel: 'Poster Presenters',
        showOnHomepage: true,
        homepageDisplayLimit: 6,
      });
    }

    return NextResponse.json({
      showPosterPresenters: settings.showPosterPresenters,
      sectionTitle: settings.sectionTitle,
      sectionDescription: settings.sectionDescription,
      navigationLabel: settings.navigationLabel,
      showOnHomepage: settings.showOnHomepage,
      homepageDisplayLimit: settings.homepageDisplayLimit,
    });
  } catch (error) {
    console.error('Error fetching poster presenters settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poster presenters settings' },
      { status: 500 }
    );
  }
}
