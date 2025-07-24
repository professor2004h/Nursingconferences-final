import { client } from './sanity/client';

// TypeScript interfaces
export interface SponsorshipTier {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  order: number;
  featured: boolean;
  description?: string;
  benefits: Array<{
    benefit: string;
    highlighted: boolean;
  }>;
  color?: {
    hex: string;
  };
  active: boolean;
}

export interface ConferenceEvent {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  location: string;
  image?: {
    asset: {
      url: string;
    };
  };
}

export interface SponsorRegistration {
  _id: string;
  registrationId: string;
  conference: ConferenceEvent;
  sponsorshipTier: SponsorshipTier;
  customAmount?: number;
  companyDetails: {
    companyName: string;
    industry?: string;
    website?: string;
    logo?: {
      asset: {
        url: string;
      };
    };
    description?: string;
  };
  contactPerson: {
    firstName: string;
    lastName: string;
    title?: string;
    email: string;
    phone: string;
    alternateEmail?: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  specialRequests?: string;
  status: 'pending' | 'processing' | 'confirmed' | 'cancelled' | 'refunded';
  paymentDetails?: {
    paymentId?: string;
    paymentMethod?: string;
    amount?: number;
    currency?: string;
    paymentDate?: string;
    invoiceNumber?: string;
  };
  submissionDate: string;
  notes?: string;
}

// Fetch all active sponsorship tiers
export async function getSponsorshipTiers(): Promise<SponsorshipTier[]> {
  try {
    const query = `*[_type == "sponsorshipTiers" && active == true] | order(order asc) {
      _id,
      name,
      slug,
      price,
      order,
      featured,
      description,
      benefits,
      color,
      active
    }`;
    
    const tiers = await client.fetch(query);
    return tiers || [];
  } catch (error) {
    console.error('Error fetching sponsorship tiers:', error);
    return [];
  }
}

// Enhanced interface for detailed conference information
export interface DetailedConferenceEvent extends ConferenceEvent {
  email?: string;
  registerNowUrl?: string;
  submitAbstractUrl?: string;
  description?: string;
  shortDescription?: string;
  attendeeCount?: number;
  topics?: string[];
  highlights?: string[];
  keySpeakers?: Array<{
    name: string;
    title: string;
    organization?: string;
  }>;
}

// Fetch all conferences for sponsor selection
export async function getAllConferences(): Promise<ConferenceEvent[]> {
  try {
    console.log('🔍 Starting to fetch conferences for sponsor selection...');

    // Fetch all conferences with full details, ordered by date (newest first)
    const query = `*[_type == "conferenceEvent"] | order(date desc) {
      _id,
      title,
      slug,
      date,
      location,
      image {
        asset -> {
          url
        }
      }
    }`;

    console.log('📝 Executing Sanity query:', query);

    const conferences = await client.fetch(query);

    console.log('📊 Raw conferences data:', conferences);
    console.log(`📅 Fetched ${conferences?.length || 0} conferences for sponsor selection`);

    // Validate the data structure
    if (conferences && Array.isArray(conferences)) {
      const validConferences = conferences.filter(conf =>
        conf && conf._id && conf.title && typeof conf.title === 'string'
      );

      console.log('✅ Valid conferences:', validConferences.map(c => ({ id: c._id, title: c.title })));

      return validConferences;
    }

    console.warn('⚠️ No valid conferences found or invalid data structure');
    return [];
  } catch (error) {
    console.error('❌ Error fetching conferences for sponsorship:', error);

    // Additional error details
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    return [];
  }
}

// Fetch detailed conference information with enhanced data
export async function getDetailedConferences(): Promise<DetailedConferenceEvent[]> {
  try {
    console.log('🔍 Starting to fetch detailed conferences...');

    // Enhanced query to fetch comprehensive conference details
    const query = `*[_type == "conferenceEvent"] | order(date desc) {
      _id,
      title,
      slug,
      date,
      location,
      email,
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
        organization
      },
      image {
        asset -> {
          url
        }
      }
    }`;

    console.log('📝 Executing detailed Sanity query:', query);

    const conferences = await client.fetch(query);

    console.log('📊 Raw detailed conferences data:', conferences);
    console.log(`📅 Fetched ${conferences?.length || 0} detailed conferences`);

    // Validate and process the data
    if (conferences && Array.isArray(conferences)) {
      const validConferences = conferences.filter(conf =>
        conf && conf._id && conf.title && typeof conf.title === 'string'
      );

      // Prioritize technology-related conferences
      const prioritizedConferences = validConferences.sort((a, b) => {
        const techKeywords = ['robotics', 'robot', 'ai', 'artificial intelligence', 'machine learning', 'ml', 'technology', 'tech', 'hi', 'hello', 'automation', 'digital', 'cyber', 'data', 'blockchain', 'iot', 'cloud', 'software', 'hardware', 'innovation'];

        const aHasTechKeywords = techKeywords.some(keyword =>
          a.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          a.description?.toLowerCase().includes(keyword.toLowerCase()) ||
          a.topics?.some((topic: string) => topic.toLowerCase().includes(keyword.toLowerCase()))
        );

        const bHasTechKeywords = techKeywords.some(keyword =>
          b.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          b.description?.toLowerCase().includes(keyword.toLowerCase()) ||
          b.topics?.some((topic: string) => topic.toLowerCase().includes(keyword.toLowerCase()))
        );

        if (aHasTechKeywords && !bHasTechKeywords) return -1;
        if (!aHasTechKeywords && bHasTechKeywords) return 1;
        return 0;
      });

      console.log('✅ Valid detailed conferences:', prioritizedConferences.map(c => ({
        id: c._id,
        title: c.title,
        hasTechKeywords: ['robotics', 'robot', 'ai', 'artificial intelligence', 'machine learning', 'ml', 'technology', 'tech', 'hi', 'hello', 'automation', 'digital', 'cyber', 'data', 'blockchain', 'iot', 'cloud', 'software', 'hardware', 'innovation'].some(keyword =>
          c.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          c.description?.toLowerCase().includes(keyword.toLowerCase()) ||
          c.topics?.some((topic: string) => topic.toLowerCase().includes(keyword.toLowerCase()))
        )
      })));

      return prioritizedConferences;
    }

    console.warn('⚠️ No valid detailed conferences found or invalid data structure');
    return [];
  } catch (error) {
    console.error('❌ Error fetching detailed conferences:', error);

    // Additional error details
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    return [];
  }
}

// Fetch a specific sponsorship tier by ID
export async function getSponsorshipTierById(id: string): Promise<SponsorshipTier | null> {
  try {
    const query = `*[_type == "sponsorshipTiers" && _id == $id][0] {
      _id,
      name,
      slug,
      price,
      order,
      featured,
      description,
      benefits,
      color,
      active
    }`;
    
    const tier = await client.fetch(query, { id });
    return tier || null;
  } catch (error) {
    console.error('Error fetching sponsorship tier:', error);
    return null;
  }
}

// Fetch a specific conference by ID
export async function getConferenceById(id: string): Promise<ConferenceEvent | null> {
  try {
    const query = `*[_type == "conferenceEvent" && _id == $id][0] {
      _id,
      title,
      slug,
      date,
      location,
      image {
        asset -> {
          url
        }
      }
    }`;
    
    const conference = await client.fetch(query, { id });
    return conference || null;
  } catch (error) {
    console.error('Error fetching conference:', error);
    return null;
  }
}

// Create a new sponsor registration
export async function createSponsorRegistration(data: Omit<SponsorRegistration, '_id' | 'submissionDate'>): Promise<string | null> {
  try {
    const registrationData = {
      _type: 'sponsorRegistration',
      ...data,
      submissionDate: new Date().toISOString(),
    };
    
    const result = await client.create(registrationData);
    return result._id;
  } catch (error) {
    console.error('Error creating sponsor registration:', error);
    return null;
  }
}

// Update sponsor registration status
export async function updateSponsorRegistrationStatus(
  registrationId: string, 
  status: SponsorRegistration['status'],
  paymentDetails?: SponsorRegistration['paymentDetails']
): Promise<boolean> {
  try {
    const updateData: any = { status };
    if (paymentDetails) {
      updateData.paymentDetails = paymentDetails;
    }
    
    await client.patch(registrationId).set(updateData).commit();
    return true;
  } catch (error) {
    console.error('Error updating sponsor registration:', error);
    return false;
  }
}

// Generate unique sponsor registration ID with high entropy
export function generateRegistrationId(): string {
  const now = new Date();
  const timestamp = now.getTime().toString(36);
  const microseconds = (performance.now() % 1000).toFixed(3).replace('.', '');
  const randomStr1 = Math.random().toString(36).substring(2, 8);
  const randomStr2 = Math.random().toString(36).substring(2, 6);
  const processEntropy = process.hrtime.bigint().toString(36).slice(-4);
  return `SPR-${timestamp}${microseconds}-${randomStr1}${randomStr2}${processEntropy}`.toUpperCase();
}

// Generate unique invoice number
export function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `INV-${timestamp}-${randomStr}`.toUpperCase();
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
