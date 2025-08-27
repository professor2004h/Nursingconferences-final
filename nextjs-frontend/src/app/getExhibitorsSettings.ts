import { client } from './sanity/client';

export interface ExhibitorsSettingsType {
  _id: string;
  title: string;
  showExhibitors: boolean;
  sectionTitle: string;
  sectionDescription?: string;
  navigationLabel: string;
  showOnHomepage: boolean;
  homepageDisplayLimit: number;
  lastUpdated: string;
}

// Get the exhibitors settings
export async function getExhibitorsSettings(): Promise<ExhibitorsSettingsType | null> {
  try {
    const query = `*[
      _type == "exhibitorsSettings"
    ][0]{
      _id,
      title,
      showExhibitors,
      sectionTitle,
      sectionDescription,
      navigationLabel,
      showOnHomepage,
      homepageDisplayLimit,
      lastUpdated
    }`;

    const data = await client.fetch(query, {}, {
      next: {
        revalidate: 300, // Cache for 5 minutes
        tags: ['exhibitors-settings']
      }
    });

    return data || null;
  } catch (error) {
    console.error('Error fetching exhibitors settings:', error);
    return null;
  }
}

// Check if exhibitors should be shown
export async function shouldShowExhibitors(): Promise<boolean> {
  try {
    const settings = await getExhibitorsSettings();
    return settings?.showExhibitors ?? true; // Default to true if no settings
  } catch (error) {
    console.error('Error checking exhibitors visibility:', error);
    return true; // Default to true on error
  }
}

// Check if exhibitors should be shown on homepage
export async function shouldShowExhibitorsOnHomepage(): Promise<boolean> {
  try {
    const settings = await getExhibitorsSettings();
    return (settings?.showExhibitors && settings?.showOnHomepage) ?? false;
  } catch (error) {
    console.error('Error checking exhibitors homepage visibility:', error);
    return false; // Default to false on error
  }
}

// Get homepage display limit for exhibitors
export async function getExhibitorsHomepageLimit(): Promise<number> {
  try {
    const settings = await getExhibitorsSettings();
    return settings?.homepageDisplayLimit ?? 6; // Default to 6
  } catch (error) {
    console.error('Error getting exhibitors homepage limit:', error);
    return 6; // Default to 6 on error
  }
}
