import { freshClient } from './sanity/client';

export interface PastConferenceRedirectType {
  _id: string;
  title: string;
  redirectUrl: string;
  description?: string;
  isActive: boolean;
  showInMenu: boolean;
  lastUpdated: string;
}

// Get the past conferences redirect URL
export async function getPastConferencesRedirect(): Promise<PastConferenceRedirectType | null> {
  try {
    const query = `*[
      _type == "pastConference"
    ][0]{
      _id,
      title,
      redirectUrl,
      description,
      isActive,
      showInMenu,
      lastUpdated
    }`;

    const data = await freshClient.fetch(query, {}, {
      cache: 'no-store', // Force no caching
      next: {
        revalidate: 0, // No caching - always fetch fresh data
        tags: ['past-conferences-redirect']
      }
    });

    console.log('🔍 getPastConferencesRedirect: Raw data from Sanity =', data);
    console.log('🔍 getPastConferencesRedirect: showInMenu value =', data?.showInMenu);
    console.log('🔍 getPastConferencesRedirect: typeof showInMenu =', typeof data?.showInMenu);

    return data || null;
  } catch (error) {
    console.error('Error fetching past conferences redirect:', error);
    return null;
  }
}

// Check if redirect is active and get URL
export async function getPastConferencesRedirectUrl(): Promise<string | null> {
  try {
    const redirectConfig = await getPastConferencesRedirect();

    if (redirectConfig && redirectConfig.isActive && redirectConfig.redirectUrl) {
      return redirectConfig.redirectUrl;
    }

    return null;
  } catch (error) {
    console.error('Error getting past conferences redirect URL:', error);
    return null;
  }
}

// Check if Past Conferences should be shown in navigation menu
export async function shouldShowPastConferencesInMenu(): Promise<boolean> {
  try {
    const redirectConfig = await getPastConferencesRedirect();

    // Show in menu if showInMenu is true, hide if false or undefined
    const shouldShow = redirectConfig?.showInMenu === true;

    console.log('🔍 shouldShowPastConferencesInMenu: redirectConfig =', redirectConfig);
    console.log('🔍 shouldShowPastConferencesInMenu: showInMenu =', redirectConfig?.showInMenu);
    console.log('🔍 shouldShowPastConferencesInMenu: returning =', shouldShow);

    return shouldShow;
  } catch (error) {
    console.error('Error checking past conferences menu visibility:', error);
    // Default to hiding if there's an error (safer approach)
    return false;
  }
}
