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
  mainConferenceUrl?: string;
  imageLinkUrl?: string;
  registerNowUrl?: string;
  submitAbstractUrl?: string;
  isActive?: boolean;
  description?: PortableTextBlock[];
  shortDescription?: string;
  attendeeCount?: number;
  topics?: string[];
  highlights?: string[];
  keySpeakers?: Array<{
    name: string;
    title: string;
    organization?: string;
    bio?: string;
    photoUrl?: string;
  }>;
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
      mainConferenceUrl,
      imageLinkUrl,
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

// Get a single conference by slug (for event detail pages)
export async function getConferenceBySlug(slug: string): Promise<ConferenceEventType | null> {
  try {
    // Decode the URL-encoded slug to handle spaces and special characters
    const decodedSlug = decodeURIComponent(slug);

    console.log('🔍 Looking for conference with slug:', { original: slug, decoded: decodedSlug });

    const query = `*[
      _type == "conferenceEvent" && slug.current == $slug
    ][0]{
      _id,
      title,
      slug,
      date,
      location,
      email,
      mainConferenceUrl,
      imageLinkUrl,
      registerNowUrl,
      submitAbstractUrl,
      description,
      shortDescription,
      attendeeCount,
      topics,
      highlights,
      keySpeakers[]{
        name,
        title,
        organization,
        bio,
        "photoUrl": photo.asset->url
      },
      isActive,
      "imageUrl": image.asset->url
    }`;

    // Try with decoded slug first
    let data = await optimizedFetch<ConferenceEventType>(query, { slug: decodedSlug }, {
      ttl: 600000,  // 10 minutes cache
      tags: ['conference-events', `conference-event-${slug}`],
      useCache: true
    });

    // If not found with decoded slug, try with original slug
    if (!data) {
      console.log('🔄 Trying with original slug:', slug);
      data = await optimizedFetch<ConferenceEventType>(query, { slug }, {
        ttl: 600000,
        tags: ['conference-events', `conference-event-${slug}`],
        useCache: true
      });
    }

    if (data) {
      console.log('✅ Found conference:', data.title);
    } else {
      console.log('❌ Conference not found for slug:', { original: slug, decoded: decodedSlug });
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching conference by slug:', error);
    return null;
  }
}
