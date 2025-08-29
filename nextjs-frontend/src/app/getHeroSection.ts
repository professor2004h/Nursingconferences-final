import { client } from './sanity/client';
import { HeroSectionType } from './types/heroSection';

export async function getHeroSection(): Promise<HeroSectionType | null> {
  try {
    const query = `*[_type == "heroSection"][0]{
      images[]{
        "url": asset->url
      },
      slideshowSettings{
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

    const data = await client.fetch(query, {}, {
      next: {
        revalidate: 5, // Revalidate every 5 seconds for real-time updates
        tags: ['hero-section']
      }
    });

    if (!data) {
      console.log('No hero section data found, returning fallback');
      return {
        images: [],
        slideshowSettings: {
          enableSlideshow: true,
          overlayColor: { hex: '#000000' },
          overlayOpacity: 0.4,
          transitionDuration: 5,
          enableZoomEffect: true,
          enableFadeTransition: true,
          showNavigationDots: true,
        },
        conferenceTitle: 'INTERNATIONAL CONFERENCE ON',
        conferenceSubject: 'MATERIAL CHEMISTRY & NANO MATERIALS',
        conferenceTheme: 'A NEVER-ENDING JOURNEY OF SEEKING KNOWLEDGE - WITH PEOPLE AND THEIR THOUGHTS THAT ENABLE A BETTER LIVING',
        conferenceDate: 'June 23-24, 2025',
        conferenceVenue: 'Kuala Lumpur, Malaysia',
        eventType: 'Hybrid event (Online and Offline)',
        abstractSubmissionInfo: 'Abstract Submission Open',
        registrationInfo: 'Early Bird Registration Available',
        showRegisterButton: true,
        registerButtonText: 'REGISTER NOW',
        registerButtonUrl: '/registration',
        textColor: { hex: '#ffffff', alpha: 1 },
      };
    }

    return data;
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return null;
  }
}
