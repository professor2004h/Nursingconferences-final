// import { client } from './sanity/client';
import { optimizedFetch } from './lib/optimizedFetching';
import { PortableTextBlock } from '@portabletext/types';

export interface ConferenceType {
  title: string;
  description: PortableTextBlock[]; // Portable Text content
}

export interface ConferenceEventType {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  location: string;
  imageUrl?: string;
  email?: string;
  registerNowUrl?: string;
  submitAbstractUrl?: string;
  isActive?: boolean;
}

export interface ConferencesSectionSettings {
  _id: string;
  masterControl: {
    showOnHomepage: boolean;
    title: string;
    description?: any[];
  };
  displaySettings: {
    maxEventsToShow: number;
    showOnlyActiveEvents: boolean;
    sortOrder: string;
  };
}

// Get conferences section content (title and description)
export async function getConferences(): Promise<ConferenceType | null> {
  try {
    const query = `*[_type == "conferences"][0]{
      title,
      description
    }`;

    const data = await optimizedFetch<ConferenceType>(query, {}, {
      ttl: 5 * 60 * 1000, // 5 minutes cache
      tags: ['conferences-section'],
      useCache: true
    });

    return data || null;
  } catch (error) {
    console.error('Error fetching conferences section:', error);

    // Log additional error details for debugging
    if (error instanceof Error) {
      console.error('Conferences section error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    return null;
  }
}

// Get conferences section settings (unified management)
export async function getConferencesSectionSettings(): Promise<ConferencesSectionSettings | null> {
  try {
    const query = `*[_type == "conferencesSectionSettings" && _id == "conferencesSectionSettings"][0]{
      _id,
      masterControl {
        showOnHomepage,
        title,
        description
      },
      displaySettings {
        maxEventsToShow,
        showOnlyActiveEvents,
        sortOrder
      }
    }`;

    const data = await optimizedFetch<ConferencesSectionSettings>(query, {}, {
      ttl: 60000, // 60 seconds cache (corrected from 60ms)
      tags: ['conferences-section-settings'],
      useCache: true
    });

    return data;
  } catch (error) {
    console.error('Error fetching conferences section settings:', error);
    return null;
  }
}

// Get conference events for display
export async function getConferenceEvents(limit: number = 12): Promise<ConferenceEventType[]> {
  try {
    const query = `*[
      _type == "conferenceEvent" && defined(slug.current)
    ]|order(date desc)[0...${limit}]{
      _id,
      title,
      slug,
      date,
      location,
      email,
      registerNowUrl,
      submitAbstractUrl,
      isActive,
      "imageUrl": image.asset->url
    }`;

    const data = await optimizedFetch<ConferenceEventType[]>(query, {}, {
      ttl: 60000, // 60 seconds cache (corrected from 60ms)
      tags: ['conference-events'],
      useCache: true
    });

    // Debug logging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 getConferenceEvents: Raw data from Sanity:', data?.length || 0);
    }

    // Validate and filter the data
    const validEvents = (data || [])
      .filter((event: ConferenceEventType) =>
        event && event._id && event.title && event.slug?.current
      )
      .filter((event: ConferenceEventType) => {
        // Only show events that are explicitly active (true) or don't have the field set (backward compatibility)
        return event.isActive !== false;
      });

    return validEvents;
  } catch (error) {
    console.error('Error fetching conference events:', error);

    // Log additional error details for debugging
    if (error instanceof Error) {
      console.error('Conference events error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    return [];
  }
}
