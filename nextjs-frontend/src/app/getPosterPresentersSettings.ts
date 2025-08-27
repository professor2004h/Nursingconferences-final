import { client } from './sanity/client';

export interface PosterPresentersSettingsType {
  _id: string;
  title: string;
  showPosterPresenters: boolean;
  sectionTitle: string;
  sectionDescription?: string;
  navigationLabel: string;
  showOnHomepage: boolean;
  homepageDisplayLimit: number;
  lastUpdated: string;
}

// Get the poster presenters settings
export async function getPosterPresentersSettings(): Promise<PosterPresentersSettingsType | null> {
  try {
    const query = `*[
      _type == "posterPresentersSettings"
    ][0]{
      _id,
      title,
      showPosterPresenters,
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
        tags: ['poster-presenters-settings']
      }
    });

    return data || null;
  } catch (error) {
    console.error('Error fetching poster presenters settings:', error);
    return null;
  }
}

// Check if poster presenters should be shown
export async function shouldShowPosterPresenters(): Promise<boolean> {
  try {
    const settings = await getPosterPresentersSettings();
    return settings?.showPosterPresenters ?? true; // Default to true if no settings
  } catch (error) {
    console.error('Error checking poster presenters visibility:', error);
    return true; // Default to true on error
  }
}

// Check if poster presenters should be shown on homepage
export async function shouldShowPosterPresentersOnHomepage(): Promise<boolean> {
  try {
    const settings = await getPosterPresentersSettings();
    return (settings?.showPosterPresenters && settings?.showOnHomepage) ?? false;
  } catch (error) {
    console.error('Error checking poster presenters homepage visibility:', error);
    return false; // Default to false on error
  }
}

// Get homepage display limit for poster presenters
export async function getPosterPresentersHomepageLimit(): Promise<number> {
  try {
    const settings = await getPosterPresentersSettings();
    return settings?.homepageDisplayLimit ?? 6; // Default to 6
  } catch (error) {
    console.error('Error getting poster presenters homepage limit:', error);
    return 6; // Default to 6 on error
  }
}
