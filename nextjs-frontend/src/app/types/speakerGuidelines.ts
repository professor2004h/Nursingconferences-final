export interface DeadlineItem {
  item: string;
  date: string;
  description?: string;
}

export interface GuidelinesSection {
  title: string;
  requirements?: string[];
  guidelines?: string[];
  information?: string[];
  formats?: string[];
  audioVisual?: string[];
  equipment?: string[];
  deadlines?: DeadlineItem[];
}

export interface ContactInformation {
  title: string;
  programEnquiry?: string;
  generalQueries?: string;
  technicalSupport?: string;
  phone?: string;
}

export interface SpeakerGuidelines {
  _id: string;
  title: string;
  subtitle?: string;
  introduction?: any[]; // Rich text blocks
  speakerRequirements?: GuidelinesSection;
  posterGuidelines?: GuidelinesSection;
  presentationRequirements?: GuidelinesSection;
  virtualGuidelines?: GuidelinesSection;
  certificationInfo?: GuidelinesSection;
  technicalSpecifications?: GuidelinesSection;
  submissionDeadlines?: GuidelinesSection;
  contactInformation?: ContactInformation;
  additionalNotes?: any[]; // Rich text blocks
  isActive?: boolean;
  lastUpdated?: string;
}

export interface SpeakerGuidelinesApiResponse {
  success: boolean;
  data: SpeakerGuidelines | null;
  error?: string;
}

export interface PopulateSpeakerGuidelinesResponse {
  success: boolean;
  message: string;
  data?: SpeakerGuidelines;
  error?: string;
}
