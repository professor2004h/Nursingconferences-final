export interface Speaker {
  _id: string;
  name: string;
  title: string;
  institution: string;
  country: string;
  profileImageUrl?: string;
  bio: string;
  specialization?: string;
  speakerCategory: 'keynote' | 'invited' | 'plenary' | 'session' | 'workshop' | 'moderator';
  sessionTitle?: string;
  sessionAbstract?: string;
  email?: string;
  linkedinUrl?: string;
  orcidId?: string;
  researchGateUrl?: string;
  websiteUrl?: string;
  displayOrder: number;
  isKeynote: boolean;
  isActive: boolean;
  isFeatured?: boolean;
  yearsOfExperience?: number;
  achievements?: string[];
  publications?: string[];
  sessionDate?: string;
  sessionLocation?: string;
}

export interface SpeakerApiResponse {
  success: boolean;
  data: Speaker[];
  count: number;
  error?: string;
}

export interface SingleSpeakerApiResponse {
  success: boolean;
  data: Speaker;
  error?: string;
}

export interface SpeakersByCategory {
  keynote: Speaker[];
  invited: Speaker[];
  plenary: Speaker[];
  session: Speaker[];
  workshop: Speaker[];
  moderator: Speaker[];
}

export const SPEAKER_CATEGORIES = {
  keynote: 'Keynote Speakers',
  invited: 'Invited Speakers', 
  plenary: 'Plenary Speakers',
  session: 'Session Speakers',
  workshop: 'Workshop Leaders',
  moderator: 'Panel Moderators'
} as const;

export const SPEAKER_CATEGORY_DESCRIPTIONS = {
  keynote: 'Distinguished speakers delivering major presentations',
  invited: 'Specially invited experts in their fields',
  plenary: 'Speakers addressing the full conference audience',
  session: 'Speakers presenting in specialized sessions',
  workshop: 'Leaders conducting hands-on workshops',
  moderator: 'Experienced moderators facilitating panel discussions'
} as const;
