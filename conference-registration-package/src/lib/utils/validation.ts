// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

import { z } from 'zod';
import { RegistrationFormData, ValidationError, FormValidationResult } from '@/types/registration';

// Zod schemas for validation
export const registrationSchema = z.object({
  // Personal Information
  title: z.string().min(1, 'Title is required'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  country: z.string().min(1, 'Country is required'),
  organization: z.string().min(1, 'Organization is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  
  // Address Information
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(3, 'ZIP code must be at least 3 characters'),
  
  // Conference Preferences
  registrationType: z.enum(['early-bird', 'regular', 'student', 'speaker']),
  attendanceType: z.enum(['in-person', 'virtual', 'hybrid']),
  
  // Optional fields
  dietaryRequirements: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
  
  // Emergency Contact (optional but if provided, all fields required)
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name is required'),
    phone: z.string().min(10, 'Emergency contact phone is required'),
    relationship: z.string().min(1, 'Relationship is required'),
  }).optional(),
  
  // Marketing & Communication
  marketingConsent: z.boolean(),
  newsletterSubscription: z.boolean(),
  
  // Special Requests
  specialRequests: z.string().optional(),
});

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (international format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
};

// Name validation (no numbers or special characters)
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\-\'\.]+$/;
  return nameRegex.test(name) && name.trim().length >= 2;
};

// ZIP code validation (flexible for international)
export const validateZipCode = (zipCode: string, country: string): boolean => {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
    UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    // Default pattern for other countries
    default: /^.{3,10}$/,
  };
  
  const pattern = patterns[country] || patterns.default;
  return pattern.test(zipCode);
};

// Comprehensive form validation
export const validateRegistrationForm = (data: Partial<RegistrationFormData>): FormValidationResult => {
  try {
    registrationSchema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { isValid: false, errors };
    }
    return {
      isValid: false,
      errors: [{ field: 'general', message: 'Validation failed' }],
    };
  }
};

// Step-by-step validation for multi-step forms
export const validateStep = (step: string, data: Partial<RegistrationFormData>): FormValidationResult => {
  const stepSchemas = {
    'personal-info': z.object({
      title: registrationSchema.shape.title,
      firstName: registrationSchema.shape.firstName,
      lastName: registrationSchema.shape.lastName,
      email: registrationSchema.shape.email,
      phone: registrationSchema.shape.phone,
    }),
    'contact-details': z.object({
      country: registrationSchema.shape.country,
      address: registrationSchema.shape.address,
      city: registrationSchema.shape.city,
      state: registrationSchema.shape.state,
      zipCode: registrationSchema.shape.zipCode,
    }),
    'conference-preferences': z.object({
      organization: registrationSchema.shape.organization,
      jobTitle: registrationSchema.shape.jobTitle,
      registrationType: registrationSchema.shape.registrationType,
      attendanceType: registrationSchema.shape.attendanceType,
    }),
    'additional-info': z.object({
      marketingConsent: registrationSchema.shape.marketingConsent,
      newsletterSubscription: registrationSchema.shape.newsletterSubscription,
    }),
  };

  const schema = stepSchemas[step as keyof typeof stepSchemas];
  if (!schema) {
    return { isValid: true, errors: [] };
  }

  try {
    schema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { isValid: false, errors };
    }
    return {
      isValid: false,
      errors: [{ field: 'general', message: 'Step validation failed' }],
    };
  }
};

// Sanitize input data
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Check if registration is within deadline
export const isWithinDeadline = (deadline: string): boolean => {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return now <= deadlineDate;
};

// Calculate registration type based on current date
export const calculateRegistrationType = (
  earlyBirdDeadline: string,
  regularDeadline: string
): 'early-bird' | 'regular' | 'closed' => {
  const now = new Date();
  const earlyBird = new Date(earlyBirdDeadline);
  const regular = new Date(regularDeadline);

  if (now <= earlyBird) {
    return 'early-bird';
  } else if (now <= regular) {
    return 'regular';
  } else {
    return 'closed';
  }
};
