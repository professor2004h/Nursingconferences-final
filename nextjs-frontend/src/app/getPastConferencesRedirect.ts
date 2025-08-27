import { client } from './sanity/client';

export interface PastConferenceRedirectType {
  _id: string;
  title: string;
  redirectUrl: string;
  description?: string;
  isActive: boolean;
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
      lastUpdated
    }`;

    const data = await client.fetch(query, {}, {
      next: {
        revalidate: 0, // No caching - always fetch fresh data
        tags: ['past-conferences-redirect']
      }
    });

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
