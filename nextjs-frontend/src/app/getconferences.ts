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
      "imageUrl": image.asset->url
    }`;

    const data = await optimizedFetch<ConferenceEventType[]>(query, {}, {
      ttl: 0, // Disable cache temporarily for debugging
      tags: ['conference-events'],
      useCache: false
    });

    // Debug logging
    console.log('🔍 getConferenceEvents: Raw data from Sanity:', data?.length || 0);
    data?.forEach((event, index) => {
      console.log(`📋 getConferenceEvents Event ${index + 1}: ${event.title}`);
      console.log('  Register URL:', event.registerNowUrl || 'NOT SET');
      console.log('  Submit URL:', event.submitAbstractUrl || 'NOT SET');
    });

    // Validate and filter the data
    const validEvents = (data || []).filter((event: ConferenceEventType) =>
      event && event._id && event.title && event.slug?.current
    );

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
