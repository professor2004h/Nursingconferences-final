// TypeScript interfaces for brochure download system

export interface BrochureFormData {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  country: string;
  professionalTitle?: string;
}

export interface BrochureSettings {
  _id: string;
  title: string;
  description: string;
  pdfFile: {
    asset: {
      _id: string;
      url: string;
      originalFilename: string;
      size: number;
      mimeType?: string;
    };
  };
  active: boolean;
  downloadCount: number;
  lastUpdated: string;
}

export interface BrochureDownload {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  country: string;
  professionalTitle?: string;
  downloadTimestamp: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export interface BrochureSubmitResponse {
  success: boolean;
  message: string;
  downloadUrl?: string;
  downloadId?: string;
  brochureTitle?: string;
  timestamp?: string;
  error?: string; // For error responses
}

export interface BrochureDownloadResponse {
  success: boolean;
  downloadUrl: string;
  filename: string;
  size: number;
  mimeType: string;
  title: string;
  description: string;
}

export interface BrochureFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  country?: string;
  general?: string;
}

export interface BrochureFormState {
  data: BrochureFormData;
  errors: BrochureFormErrors;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  downloadUrl?: string;
  showDownload: boolean;
}

// Import comprehensive country list
import { getCountryOptions, getCountryName } from '../utils/countries';

// Country options for the dropdown - now uses comprehensive list
export interface CountryOption {
  label: string;
  value: string;
}

// Get all country options (stores full names instead of codes)
export const COUNTRY_OPTIONS: CountryOption[] = getCountryOptions();

// API Error response interface
export interface ApiErrorResponse {
  error: string;
  details?: string;
}

// Form validation functions
export const validateBrochureForm = (data: BrochureFormData): BrochureFormErrors => {
  const errors: BrochureFormErrors = {};

  // Validate full name
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters long';
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email) {
    errors.email = 'Email address is required';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate phone
  if (!data.phone) {
    errors.phone = 'Phone number is required';
  } else if (data.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Phone number must be at least 10 digits';
  }

  // Validate organization
  if (!data.organization || data.organization.trim().length < 2) {
    errors.organization = 'Organization/Institution is required';
  }

  // Validate country (now required)
  if (!data.country || data.country.trim().length === 0) {
    errors.country = 'Country is required';
  }

  return errors;
};

// Helper function to check if form has errors
export const hasFormErrors = (errors: BrochureFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// Helper function to format country display name (now handles both codes and names)
export const getCountryDisplayName = (countryValue: string): string => {
  // If it's already a full country name, return as is
  if (COUNTRY_OPTIONS.some(option => option.value === countryValue)) {
    return countryValue;
  }

  // If it's a code, convert to full name
  return getCountryName(countryValue);
};

// Helper function to clean phone number for display
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length (basic formatting)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
};
