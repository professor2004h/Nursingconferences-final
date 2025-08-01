import { optimizedFetch } from './lib/optimizedFetching';

export interface HeroImage {
  url: string;
}

export interface SlideshowSettings {
  enableSlideshow: boolean;
  overlayColor: {
    hex: string;
  } | string;
  overlayOpacity: number;
  transitionDuration: number;
  enableZoomEffect: boolean;
  enableFadeTransition: boolean;
  showNavigationDots: boolean;
}

export interface HeroSectionType {
  images: HeroImage[];
  slideshowSettings: SlideshowSettings;
  conferenceTitle: string;
  conferenceSubject: string;
  conferenceTheme: string;
  conferenceDate: string;
  conferenceVenue: string;
  eventType: string;
  abstractSubmissionInfo: string;
  registrationInfo: string;
  showRegisterButton: boolean;
  registerButtonText: string;
  registerButtonUrl: string;
  textColor: {
    hex: string;
    alpha: number;
  };
}

export async function getHeroSection(): Promise<HeroSectionType | null> {
  try {
    // Complete hero section query with conference information
    const query = `*[_type == "heroSection"][0]{
      images[] {
        "url": asset->url
      },
      slideshowSettings {
        enableSlideshow,
        overlayColor,
        overlayOpacity,
        transitionDuration,
        enableZoomEffect,
        enableFadeTransition,
        showNavigationDots
      },
      conferenceTitle,
      conferenceSubject,
      conferenceTheme,
      conferenceDate,
      conferenceVenue,
      eventType,
      abstractSubmissionInfo,
      registrationInfo,
      showRegisterButton,
      registerButtonText,
      registerButtonUrl,
      textColor
    }`;

    const data = await optimizedFetch<HeroSectionType>(query, {}, {
      ttl: 5 * 60 * 1000, // 5 minutes cache
      tags: ['hero-section'],
      useCache: true
    });

    // Provide comprehensive defaults if needed
    if (data) {
      // Default slideshow settings
      if (!data.slideshowSettings) {
        data.slideshowSettings = {
          enableSlideshow: true,
          overlayColor: '#000000',
          overlayOpacity: 40,
          transitionDuration: 5,
          enableZoomEffect: true,
          enableFadeTransition: true,
          showNavigationDots: true,
        };
      }

      // Default conference title
      if (!data.conferenceTitle) {
        data.conferenceTitle = 'INTERNATIONAL CONFERENCE ON';
      }

      // Default conference subject
      if (!data.conferenceSubject) {
        data.conferenceSubject = 'MATERIAL CHEMISTRY & NANO MATERIALS';
      }

      // Default conference theme
      if (!data.conferenceTheme) {
        data.conferenceTheme = 'Theme: Innovative Frontiers in Material Chemistry and Nanotechnology for Sustainable Future';
      }

      // Default conference date
      if (!data.conferenceDate) {
        data.conferenceDate = 'June 23-24, 2025';
      }

      // Default conference venue
      if (!data.conferenceVenue) {
        data.conferenceVenue = 'Hotel Indigo Kuala Lumpur On The Park, Kuala Lumpur, Malaysia';
      }

      // Default event type
      if (!data.eventType) {
        data.eventType = 'Hybrid event (Online and Offline)';
      }

      // Default abstract submission info
      if (!data.abstractSubmissionInfo) {
        data.abstractSubmissionInfo = 'Abstract Submission Opens: March 20, 2024';
      }

      // Default registration info
      if (!data.registrationInfo) {
        data.registrationInfo = 'Early Bird Registration Start: April 15, 2024';
      }

      // Default register button settings
      if (data.showRegisterButton === undefined) {
        data.showRegisterButton = true;
      }

      if (!data.registerButtonText) {
        data.registerButtonText = 'Register Now';
      }

      if (!data.registerButtonUrl) {
        data.registerButtonUrl = '/registration';
      }

      // Default text color
      if (!data.textColor) {
        data.textColor = {
          hex: '#ffffff',
          alpha: 1
        };
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return null;
  }
}
