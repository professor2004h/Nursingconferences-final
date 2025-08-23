// =============================================================================
// REGISTRATION TYPES
// =============================================================================

export interface RegistrationFormData {
  // Personal Information
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  organization: string;
  jobTitle: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Conference Preferences
  registrationType: 'early-bird' | 'regular' | 'student' | 'speaker';
  attendanceType: 'in-person' | 'virtual' | 'hybrid';
  
  // Dietary Requirements & Accessibility
  dietaryRequirements?: string;
  accessibilityNeeds?: string;
  
  // Additional Information
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  // Marketing & Communication
  marketingConsent: boolean;
  newsletterSubscription: boolean;
  
  // Special Requests
  specialRequests?: string;
}

export interface RegistrationData extends RegistrationFormData {
  id: string;
  registrationNumber: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
}

export type RegistrationStatus = 
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface RegistrationPricing {
  earlyBird: number;
  regular: number;
  student: number;
  speaker: number;
  earlyBirdDeadline: string;
  regularDeadline: string;
  currency: string;
}

export interface ConferenceSettings {
  name: string;
  date: string;
  location: string;
  description: string;
  maxAttendees: number;
  registrationOpen: boolean;
  pricing: RegistrationPricing;
  requiredFields: string[];
  optionalFields: string[];
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Registration step types for multi-step form
export type RegistrationStep = 
  | 'personal-info'
  | 'contact-details'
  | 'conference-preferences'
  | 'additional-info'
  | 'review'
  | 'payment'
  | 'confirmation';

export interface RegistrationStepData {
  step: RegistrationStep;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

// API Response types
export interface RegistrationResponse {
  success: boolean;
  data?: RegistrationData;
  error?: string;
  message?: string;
}

export interface RegistrationListResponse {
  success: boolean;
  data?: RegistrationData[];
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
}
