// Cancellation Policy Types
export interface RefundTier {
  daysBeforeConference: number;
  refundPercentage: number;
  description?: string;
}

export interface NameChangePolicy {
  title: string;
  content: any[];
  deadline?: number;
}

export interface RefundPolicy {
  title: string;
  generalPolicy: any[];
  refundTiers: RefundTier[];
  additionalTerms: any[];
}

export interface NaturalDisasterPolicy {
  title: string;
  content: any[];
  organizerRights: any[];
  liabilityDisclaimer: any[];
}

export interface PostponementPolicy {
  title: string;
  content: any[];
  creditValidityPeriod?: number;
}

export interface TransferPolicy {
  title: string;
  personTransfer: any[];
  conferenceTransfer: any[];
  transferDeadline?: number;
  transferLimitations: any[];
}

export interface VisaPolicy {
  title: string;
  generalAdvice: any[];
  failedVisaPolicy: any[];
}

export interface ContactInformation {
  title: string;
  primaryEmail?: string;
  phone?: string;
  instructions: any[];
}

export interface ImportantNote {
  title: string;
  content: any[];
  priority: 'high' | 'medium' | 'low';
}

export interface CancellationPolicy {
  _id: string;
  title: string;
  subtitle?: string;
  introduction?: any[];
  nameChangePolicy?: NameChangePolicy;
  refundPolicy?: RefundPolicy;
  naturalDisasterPolicy?: NaturalDisasterPolicy;
  postponementPolicy?: PostponementPolicy;
  transferPolicy?: TransferPolicy;
  visaPolicy?: VisaPolicy;
  contactInformation?: ContactInformation;
  importantNotes?: ImportantNote[];
  lastUpdated?: string;
  isActive?: boolean;
  effectiveDate?: string;
  seoTitle?: string;
  seoDescription?: string;
}

// API Response Types
export interface CancellationPolicyApiResponse {
  success: boolean;
  data?: CancellationPolicy;
  error?: string;
}

export interface PopulateCancellationPolicyResponse {
  success: boolean;
  message: string;
  data?: CancellationPolicy;
  error?: string;
}
