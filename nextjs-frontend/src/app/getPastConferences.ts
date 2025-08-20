import { client } from './sanity/client';
import { PortableTextBlock } from '@portabletext/types';

export interface PastConferenceType {
  _id: string;
  title: string;
  slug: { current: string };
  featured: boolean;
  date: string;
  endDate?: string;
  location: string;
  description: PortableTextBlock[]; // Portable Text content
  shortDescription: string;
  mainImageUrl?: string;
  gallery?: Array<{
    imageUrl: string;
    caption?: string;
  }>;
  attendeeCount?: number;
  keySpeakers?: Array<{
    name: string;
    title: string;
    organization?: string;
    bio?: string;
    photoUrl?: string;
  }>;
  highlights?: string[];
  topics?: string[];
  outcomes?: PortableTextBlock[]; // Portable Text content
  testimonials?: Array<{
    quote: string;
    author: string;
    authorTitle?: string;
  }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

// Get all past conferences with optional limit and featured filter (OPTIMIZED FOR SPEED)
export async function getPastConferences(
  limit?: number,
  featuredOnly: boolean = false
): Promise<PastConferenceType[]> {
  try {
    const featuredFilter = featuredOnly ? ' && featured == true' : '';
    const limitClause = limit ? `[0...${limit}]` : '';

    // OPTIMIZED QUERY: Only fetch essential fields for listing
    const query = `*[
      _type == "pastConference" && defined(slug.current)${featuredFilter}
    ]|order(date desc)${limitClause}{
      _id,
      title,
      slug,
      featured,
      date,
      endDate,
      location,
      shortDescription,
      "mainImageUrl": mainImage.asset->url,
      attendeeCount,
      topics[0...3],
      highlights[0...2]
    }`;

    const data = await client.fetch(query, {}, {
      next: {
        revalidate: 300,  // OPTIMIZED: 5 minutes instead of 5 seconds
        tags: ['past-conferences']
      }
    });

    // Validate and filter the data
    const validConferences = (data || []).filter((conference: PastConferenceType) =>
      conference && conference._id && conference.title && conference.slug?.current
    );

    return validConferences;
  } catch (error) {
    console.error('Error fetching past conferences:', error);

    // Log additional error details for debugging
    if (error instanceof Error) {
      console.error('Past conferences error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        context: { limit, featuredOnly }
      });
    }

    // Return empty array to prevent UI crashes
    return [];
  }
}

// Get featured past conferences for home page display
export async function getFeaturedPastConferences(limit: number = 4): Promise<PastConferenceType[]> {
  return getPastConferences(limit, true);
}

// FAST NAVIGATION: Get lightweight conference data for prefetching
export async function getPastConferencePreview(slug: string): Promise<{
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  location: string;
  shortDescription: string;
  mainImageUrl?: string;
} | null> {
  try {
    const query = `*[
      _type == "pastConference" && slug.current == $slug
    ][0]{
      _id,
      title,
      slug,
      date,
      location,
      shortDescription,
      "mainImageUrl": mainImage.asset->url
    }`;

    const data = await client.fetch(query, { slug }, {
      next: {
        revalidate: 3600,  // 1 hour cache for preview data
        tags: [`past-conference-preview-${slug}`]
      }
    });

    return data || null;
  } catch (error) {
    console.error('Error fetching past conference preview:', error);
    return null;
  }
}

// Get a single past conference by slug (OPTIMIZED FOR SPEED)
export async function getPastConferenceBySlug(slug: string): Promise<PastConferenceType | null> {
  try {
    // Decode the URL-encoded slug to handle spaces and special characters
    const decodedSlug = decodeURIComponent(slug);

    console.log('🔍 Looking for past conference with slug:', { original: slug, decoded: decodedSlug });

    const query = `*[
      _type == "pastConference" && slug.current == $slug
    ][0]{
      _id,
      title,
      slug,
      featured,
      date,
      endDate,
      location,
      description,
      shortDescription,
      "mainImageUrl": mainImage.asset->url,
      "gallery": gallery[0...6]{
        "imageUrl": asset->url,
        caption
      },
      attendeeCount,
      keySpeakers[0...8]{
        name,
        title,
        organization,
        bio,
        "photoUrl": photo.asset->url
      },
      highlights,
      topics,
      outcomes,
      testimonials[0...5],
      seo
    }`;

    // Try with decoded slug first
    let data = await client.fetch(query, { slug: decodedSlug }, {
      next: {
        revalidate: 600,  // OPTIMIZED: 10 minutes instead of 5 seconds
        tags: ['past-conferences', `past-conference-${slug}`]
      }
    });

    // If not found with decoded slug, try with original slug
    if (!data) {
      console.log('🔄 Trying with original slug:', slug);
      data = await client.fetch(query, { slug }, {
        next: {
          revalidate: 600,
          tags: ['past-conferences', `past-conference-${slug}`]
        }
      });
    }

    if (data) {
      console.log('✅ Found past conference:', data.title);
    } else {
      console.log('❌ Past conference not found for slug:', { original: slug, decoded: decodedSlug });
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching past conference by slug:', error);

    // Log additional error details for debugging
    if (error instanceof Error) {
      console.error('Past conference by slug error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        slug,
        timestamp: new Date().toISOString()
      });
    }

    // Return null to trigger not-found page
    return null;
  }
}

// Get past conferences statistics for dashboard/analytics
export async function getPastConferencesStats(): Promise<{
  totalConferences: number;
  totalAttendees: number;
  totalSpeakers: number;
  featuredCount: number;
} | null> {
  try {
    const query = `{
      "totalConferences": count(*[_type == "pastConference"]),
      "totalAttendees": math::sum(*[_type == "pastConference"].attendeeCount),
      "totalSpeakers": count(*[_type == "pastConference"].keySpeakers[]),
      "featuredCount": count(*[_type == "pastConference" && featured == true])
    }`;

    const data = await client.fetch(query, {}, {
      next: {
        revalidate: 30,  // Revalidate every 30 seconds for stats
        tags: ['past-conferences-stats']
      }
    });

    return data || null;
  } catch (error) {
    console.error('Error fetching past conferences stats:', error);
    return null;
  }
}

// Search past conferences by title or topic
export async function searchPastConferences(searchTerm: string, limit: number = 20): Promise<PastConferenceType[]> {
  try {
    const query = `*[
      _type == "pastConference" && 
      (title match $searchTerm || topics[] match $searchTerm) &&
      defined(slug.current)
    ]|order(date desc)[0...${limit}]{
      _id,
      title,
      slug,
      featured,
      date,
      endDate,
      location,
      shortDescription,
      "mainImageUrl": mainImage.asset->url,
      topics,
      highlights
    }`;

    const data = await client.fetch(query, { 
      searchTerm: `*${searchTerm}*` 
    }, {
      next: {
        revalidate: 10,  // Revalidate every 10 seconds for search results
        tags: ['past-conferences-search']
      }
    });

    return data || [];
  } catch (error) {
    console.error('Error searching past conferences:', error);
    return [];
  }
}
