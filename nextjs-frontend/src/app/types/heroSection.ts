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

export interface HeroSectionResponse {
  hero: HeroSectionType | null;
}
