import { client } from './sanity/client';

export interface ConferencesRedirectType {
  _id: string;
  title: string;
  redirectUrl: string;
  description?: string;
  isActive: boolean;
  lastUpdated: string;
}

// Get the conferences redirect URL
export async function getConferencesRedirect(): Promise<ConferencesRedirectType | null> {
  try {
    const query = `*[
      _type == "conferenceEvent"
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
        tags: ['conferences-redirect']
      }
    });

    return data || null;
  } catch (error) {
    console.error('Error fetching conferences redirect:', error);
    return null;
  }
}

// Check if redirect is active and get URL
export async function getConferencesRedirectUrl(): Promise<string | null> {
  try {
    const redirectConfig = await getConferencesRedirect();
    
    if (redirectConfig && redirectConfig.isActive && redirectConfig.redirectUrl) {
      return redirectConfig.redirectUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting conferences redirect URL:', error);
    return null;
  }
}
