// lib/getImageSection.ts

import { client } from './sanity/client';

export interface ImageSectionData {
  _id: string;
  title?: string;
  image: {
    asset: {
      _ref: string;
      url: string;
    };
    alt: string;
    caption?: string;
    hotspot?: {
      x: number;
      y: number;
    };
  };
  layout: {
    aspectRatio: string;
    objectFit: string;
    borderRadius: string;
  };
  visibility: {
    showOnHomepage: boolean;
    showOnAboutPage: boolean;
  };
}

export async function getImageSectionContent(): Promise<ImageSectionData | null> {
  try {
    const query = `*[_type == "imageSection" && visibility.showOnHomepage == true][0]{
      _id,
      title,
      image{
        asset->{
          _ref,
          url
        },
        alt,
        caption,
        hotspot
      },
      layout,
      visibility
    }`;

    const imageSection = await client.fetch(query, {}, {
      next: { revalidate: 5 } // 5-second revalidation for real-time updates
    });

    return imageSection;
  } catch (error) {
    console.error('Error fetching image section content:', error);
    return null;
  }
}

export async function getAboutPageImageSection(): Promise<ImageSectionData | null> {
  try {
    const query = `*[_type == "imageSection" && visibility.showOnAboutPage == true][0]{
      _id,
      title,
      image{
        asset->{
          _ref,
          url
        },
        alt,
        caption,
        hotspot
      },
      layout,
      visibility
    }`;

    const imageSection = await client.fetch(query, {}, {
      next: { revalidate: 5 } // 5-second revalidation for real-time updates
    });

    return imageSection;
  } catch (error) {
    console.error('Error fetching about page image section content:', error);
    return null;
  }
}

// Helper function to get default image section if no CMS data is available
export function getDefaultImageSection(): ImageSectionData {
  return {
    _id: 'default',
    title: 'Our Impact',
    image: {
      asset: {
        _ref: 'default',
        url: '/api/placeholder/600/400', // Fallback placeholder
      },
      alt: 'Conference Impact Image',
      caption: 'Making a difference in the academic community',
    },
    layout: {
      aspectRatio: '16/9',
      objectFit: 'cover',
      borderRadius: 'lg',
    },
    visibility: {
      showOnHomepage: true,
      showOnAboutPage: false,
    },
  };
}
