import { client } from './sanity/client';

export interface SponsorshipSettingsType {
  _id: string;
  title: string;
  heroSection: {
    backgroundImage?: {
      asset: {
        _ref: string;
        url?: string;
      };
      hotspot?: any;
    };
    title: string;
    description: string;
  };
  mainContent: {
    sectionTitle?: string;
    content: any[]; // Rich text blocks
    highlightText: string;
  };
  callToAction: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  pageSettings: {
    showSponsorshipTiers: boolean;
    metaTitle: string;
    metaDescription: string;
  };
  lastUpdated: string;
}

// Get the sponsorship settings
export async function getSponsorshipSettings(): Promise<SponsorshipSettingsType | null> {
  try {
    const query = `*[
      _type == "sponsorshipSettings"
    ][0]{
      _id,
      title,
      heroSection{
        backgroundImage{
          asset->{
            _id,
            url
          },
          hotspot
        },
        title,
        description
      },
      mainContent{
        sectionTitle,
        content,
        highlightText
      },
      callToAction{
        title,
        description,
        buttonText,
        buttonLink
      },
      pageSettings{
        showSponsorshipTiers,
        metaTitle,
        metaDescription
      },
      lastUpdated
    }`;

    const data = await client.fetch(query, {}, {
      next: {
        revalidate: 300, // Cache for 5 minutes
        tags: ['sponsorship-settings']
      }
    });

    return data || null;
  } catch (error) {
    console.error('Error fetching sponsorship settings:', error);
    return null;
  }
}

// Get default sponsorship settings (fallback)
export function getDefaultSponsorshipSettings(): SponsorshipSettingsType {
  return {
    _id: 'default',
    title: 'Sponsorship Settings',
    heroSection: {
      title: 'For Sponsor / Exhibitor',
      description: 'Intelli Global Conferences organizes interdisciplinary global conferences to showcase revolutionary basic and applied research outcomes within life sciences including medicine and other diverse roles of science and technology around the world.',
    },
    mainContent: {
      sectionTitle: 'Partnership Value Proposition',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Adding value to the experience while integrating your brand\'s products will not only showcase the authenticity of the brand, but will result in great, objective 3rd party recognition that will move the influencer needle. When your brand purchases a Sponsorship package, it is committing itself to delivering experiential relevance and value to thousands of industry influencers including press, creative\'s and their millions of collective followers, who have come to expect nothing less from Intelli Global Conferences and its partners.'
            }
          ]
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Intelli Global Conferences offers different packages for sponsors/exhibitors to demonstrate their support towards science and its people by providing financial contributions to facilitate the presentations of noble research findings, hospitality and other necessary management for the scientific gathering.'
            }
          ]
        }
      ],
      highlightText: 'Visualize this partnership through the eyes of world class noble people…!!!',
    },
    callToAction: {
      title: 'Ready to Become a Sponsor?',
      description: 'Join us in supporting groundbreaking research and innovation. Choose your sponsorship package and make a lasting impact.',
      buttonText: 'Become a Sponsor',
      buttonLink: '/registration',
    },
    pageSettings: {
      showSponsorshipTiers: true,
      metaTitle: 'Sponsorship Opportunities - Intelli Global Conferences',
      metaDescription: 'Partner with us to showcase your brand at our global conferences. Explore sponsorship packages and benefits for industry leaders.',
    },
    lastUpdated: new Date().toISOString(),
  };
}

// Convert Sanity rich text blocks to plain text (for fallback)
export function blocksToText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  
  return blocks
    .filter(block => block._type === 'block')
    .map(block => 
      block.children
        ?.filter((child: any) => child._type === 'span')
        ?.map((span: any) => span.text)
        ?.join('') || ''
    )
    .join('\n\n');
}

// Get sponsorship settings with fallback
export async function getSponsorshipSettingsWithFallback(): Promise<SponsorshipSettingsType> {
  try {
    const settings = await getSponsorshipSettings();
    return settings || getDefaultSponsorshipSettings();
  } catch (error) {
    console.error('Error fetching sponsorship settings, using defaults:', error);
    return getDefaultSponsorshipSettings();
  }
}
