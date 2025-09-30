// lib/getImageSection.ts

import { client } from './sanity/client';

export interface CarouselSlide {
  logo: {
    asset: {
      _ref: string;
      url: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  name: string;
  description?: string;
  link?: string;
  layout: 'top-center' | 'left-right';
}

export interface ImageSectionData {
  _id: string;
  title?: string;
  carouselSlides?: CarouselSlide[];
  carouselSettings?: {
    autoplay: boolean;
    autoplaySpeed: number;
    showDots: boolean;
    showArrows: boolean;
  };
  // Legacy fields for backward compatibility
  image?: {
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
  cpdImage?: {
    asset?: {
      _ref?: string;
      url?: string;
    };
    alt?: string;
    caption?: string;
    hotspot?: {
      x: number;
      y: number;
    };
  };
  layout: {
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
      "carouselSlides": carouselSlides[]{
        "logo": logo{
          asset->{
            _ref,
            url
          },
          hotspot
        },
        name,
        description,
        link,
        layout
      },
      carouselSettings,
      "cpdImage": cpdImage{
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
      "carouselSlides": carouselSlides[]{
        "logo": logo{
          asset->{
            _ref,
            url
          },
          hotspot
        },
        name,
        description,
        link,
        layout
      },
      carouselSettings,
      "cpdImage": cpdImage{
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
    carouselSlides: [],
    carouselSettings: {
      autoplay: true,
      autoplaySpeed: 5,
      showDots: true,
      showArrows: true,
    },
    layout: {
      borderRadius: 'lg',
    },
    visibility: {
      showOnHomepage: true,
      showOnAboutPage: false,
    },
  };
}
