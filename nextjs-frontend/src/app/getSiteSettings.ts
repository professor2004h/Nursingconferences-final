import { client, headerClient } from "./sanity/client";

export interface SiteSettings {
  _id: string;
  logo?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  favicon?: {
    asset: {
      _id: string;
      url: string;
    };
  };
  brandName?: string;
  brandSecondary?: string;
  brandTagline?: string;
  websiteUrl?: string;
  siteDescription?: string;
  headerVisibility?: {
    showHeaderSection?: boolean;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
  };
  socialMedia?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  journal?: {
    showJournal?: boolean;
    journalUrl?: string;
    openInNewTab?: boolean;
  };
  refundPolicy?: {
    title?: string;
    isActive?: boolean;
    lastUpdated?: string;
    matterDescription?: any[]; // Portable Text
  };
  adminSettings?: {
    adminEmail?: string;
    invoiceEmailSubject?: string;
    invoiceEmailTemplate?: string;
    paymentConfirmationTemplate?: string;
  };
  footerContent?: {
    termsAndConditions?: any[];
    privacyPolicy?: any[];
    faqs?: Array<{
      question: string;
      answer: any[];
    }>;
    footerSocialMedia?: {
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      facebook?: string;
    };
    footerBackgroundImage?: {
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
    footerLogo?: {
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
    registerButton?: {
      text: string;
      url: string;
      openInNewTab: boolean;
    };
  };
  registerButton?: {
    text: string;
    url: string;
    openInNewTab: boolean;
  };
}

// Cache for site settings with timestamp and version
let siteSettingsCache: { 
  data: SiteSettings | null; 
  timestamp: number;
  version: string;
} | null = null;

const CACHE_DURATION = process.env.NODE_ENV === 'development' ? 5 * 1000 : 30 * 1000;
const CACHE_VERSION = '1.0'; // Increment this when making breaking changes

export async function getSiteSettings(forceRefresh = false): Promise<SiteSettings | null> {
  try {
    // Check if we have valid cached data
    if (!forceRefresh && 
        siteSettingsCache?.data && 
        siteSettingsCache.version === CACHE_VERSION &&
        Date.now() - siteSettingsCache.timestamp < CACHE_DURATION) {
      return siteSettingsCache.data;
    }

    const query = `*[_type == "siteSettings"][0]{
      _id,
      logo{
        asset->{
          _id,
          url
        },
        alt
      },
      favicon{
        asset->{
          _id,
          url
        }
      },
      brandName,
      brandSecondary,
      brandTagline,
      websiteUrl,
      siteDescription,
      headerVisibility,
      contactInfo,
      socialMedia,
      seo,
      journal,
      refundPolicy,
      adminSettings,
      footerContent{
        termsAndConditions,
        privacyPolicy,
        faqs[]{
          question,
          answer
        },
        footerSocialMedia{
          twitter,
          instagram,
          linkedin,
          facebook
        },
        footerBackgroundImage{
          asset->{
            _id,
            url
          },
          alt
        },
        footerLogo{
          asset->{
            _id,
            url
          },
          alt
        },
        registerButton{
          text,
          url,
          openInNewTab
        }
      }
    }`;

    const siteSettings = await client.fetch(query, {}, {
      next: {
        revalidate: process.env.NODE_ENV === 'development' ? 1 : 30, // 1 second in dev for faster testing, 30 seconds in production
        tags: ['site-settings'] // Cache tag for targeted revalidation
      },
    });

    // Update cache with version
    siteSettingsCache = {
      data: siteSettings,
      timestamp: Date.now(),
      version: CACHE_VERSION
    };

    // Validate the data structure
    if (siteSettings && typeof siteSettings === 'object') {
      return siteSettings;
    }

    throw new Error('Invalid site settings data structure');

  } catch (error) {
    console.error("Error fetching site settings:", error);

    // Only return cached data if it exists and has the current version
    if (siteSettingsCache?.data && siteSettingsCache.version === CACHE_VERSION) {
      console.warn("Returning cached site settings due to fetch error");
      return siteSettingsCache.data;
    }

    // If cache is stale or invalid, return null and force a reload
    console.warn("No valid cached site settings available");
    return null;
  }
}

// Function to get fresh site settings without any caching
export async function getSiteSettingsFresh(): Promise<SiteSettings | null> {
  try {
    const query = `*[_type == "siteSettings"][0]{
      _id,
      logo{
        asset->{
          _id,
          url
        },
        alt
      },
      favicon{
        asset->{
          _id,
          url
        }
      },
      siteDescription,
      headerVisibility,
      contactInfo,
      socialMedia,
      seo,
      journal,
      refundPolicy,
      adminSettings,
      footerContent{
        termsAndConditions,
        privacyPolicy,
        faqs[]{
          question,
          answer
        },
        footerSocialMedia{
          twitter,
          instagram,
          linkedin,
          facebook
        },
        footerBackgroundImage{
          asset->{
            _id,
            url
          },
          alt
        },
        footerLogo{
          asset->{
            _id,
            url
          },
          alt
        },
        registerButton{
          text,
          url,
          openInNewTab
        }
      }
    }`;

    const siteSettings = await client.fetch(query, {}, {
      next: {
        revalidate: 60, // Cache for 60 seconds
      },
    });

    return siteSettings;
  } catch (error) {
    console.error("Error fetching fresh site settings:", error);
    return null;
  }
}

// Function specifically for header component that always fetches fresh data
export async function getSiteSettingsForHeader(): Promise<SiteSettings | null> {
  try {
    // Add timestamp to ensure unique requests
    const timestamp = Date.now();
    // Use crypto.getRandomValues for better randomness and avoid hydration issues
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const randomId = randomArray[0].toString(36);
    const query = `*[_type == "siteSettings"][0]{
      _id,
      logo{
        asset->{
          _id,
          url
        },
        alt
      },
      favicon{
        asset->{
          _id,
          url
        }
      },
      brandName,
      brandSecondary,
      brandTagline,
      websiteUrl,
      siteDescription,
      headerVisibility,
      contactInfo,
      socialMedia,
      seo,
      journal,
      refundPolicy,
      adminSettings,
      footerContent{
        termsAndConditions,
        privacyPolicy,
        faqs[]{
          question,
          answer
        },
        footerSocialMedia{
          twitter,
          instagram,
          linkedin,
          facebook
        },
        footerBackgroundImage{
          asset->{
            _id,
            url
          },
          alt
        },
        footerLogo{
          asset->{
            _id,
            url
          },
          alt
        },
        registerButton{
          text,
          url,
          openInNewTab
        }
      },
      _updatedAt
    }`;

    // Use headerClient (no CDN) with cache busting parameters
    const siteSettings = await headerClient.fetch(query, {
      timestamp,
      randomId,
      cacheBust: `header-${timestamp}-${randomId}`
    }, {
      next: {
        revalidate: 30, // Cache for 30 seconds
      },
    });

    // Clear any existing cache when fetching for header
    clearSiteSettingsCache();

    if (process.env.NODE_ENV === 'development') {
      console.warn('Header data fetched fresh');
    }

    return siteSettings;
  } catch (error) {
    console.error("Error fetching header site settings:", error);
    return null;
  }
}

// Function to get site settings with server-side rendering support
export async function getSiteSettingsSSR(): Promise<SiteSettings | null> {
  try {
    const query = `*[_type == "siteSettings"][0]{
      _id,
      logo{
        asset->{
          _id,
          url
        },
        alt
      },
      favicon{
        asset->{
          _id,
          url
        }
      },
      siteDescription,
      headerVisibility,
      contactInfo,
      socialMedia,
      seo,
      journal,
      adminSettings,
      footerContent{
        termsAndConditions,
        privacyPolicy,
        faqs[]{
          question,
          answer
        },
        footerSocialMedia{
          twitter,
          instagram,
          linkedin,
          facebook
        },
        footerBackgroundImage{
          asset->{
            _id,
            url
          },
          alt
        },
        footerLogo{
          asset->{
            _id,
            url
          },
          alt
        },
        registerButton{
          text,
          url,
          openInNewTab
        }
      }
    }`;

    const siteSettings = await client.fetch(query, {}, {
      next: {
        revalidate: process.env.NODE_ENV === 'development' ? 5 : 30, // 5 seconds in dev, 30 seconds in production
        tags: ['site-settings'] // Cache tag for targeted revalidation
      },
    });

    return siteSettings;
  } catch (error) {
    console.error("Error fetching site settings (SSR):", error);
    return null;
  }
}

// Function to clear the cache (useful for revalidation)
export function clearSiteSettingsCache(): void {
  siteSettingsCache = null;
  if (process.env.NODE_ENV === 'development') {
    console.warn('Site settings cache cleared');
  }
}

// Helper function to get image URL from Sanity asset with quality optimization
export function getImageUrl(
  imageAsset: { asset?: { url?: string } } | null | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }
): string | null {
  if (!imageAsset?.asset?.url) {
    return null;
  }

  let url = imageAsset.asset.url;

  // Add Sanity image transformation parameters for better quality
  if (options) {
    const params = new URLSearchParams();

    if (options.width) params.append('w', options.width.toString());
    if (options.height) params.append('h', options.height.toString());
    if (options.quality) params.append('q', options.quality.toString());
    if (options.format) params.append('fm', options.format);

    // Add fit parameter to maintain aspect ratio
    params.append('fit', 'max');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  return url;
}

// Helper function specifically for logo images with optimized settings
export function getLogoImageUrl(imageAsset: { asset?: { url?: string } } | null | undefined): string | null {
  return getImageUrl(imageAsset, {
    width: 600,  // Reduced from 800 for better header fit
    height: 200, // Added height constraint
    quality: 95,
    format: 'webp'
  });
}

// Helper function to get the full brand name
export function getFullBrandName(siteSettings: SiteSettings | null): string {
  if (!siteSettings) return 'Intelli Global Conferences';

  const brandName = siteSettings.brandName || 'Intelli Global';
  const brandSecondary = siteSettings.brandSecondary || 'Conferences';

  return `${brandName} ${brandSecondary}`;
}

// Helper function to get brand name parts
export function getBrandParts(siteSettings: SiteSettings | null): { primary: string; secondary: string; tagline?: string } {
  if (!siteSettings) {
    return {
      primary: 'Nursing',
      secondary: 'Conference 2026'
    };
  }

  return {
    primary: siteSettings.brandName || 'Nursing',
    secondary: siteSettings.brandSecondary || 'Conference 2026',
    tagline: siteSettings.brandTagline
  };
}

// Helper function to get the website URL
export function getWebsiteUrl(siteSettings: SiteSettings | null): string {
  return siteSettings?.websiteUrl || 'https://nursingconference2026.com';
}
