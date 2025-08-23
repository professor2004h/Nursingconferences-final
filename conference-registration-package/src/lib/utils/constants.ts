// =============================================================================
// CONSTANTS
// =============================================================================

// Registration types
export const REGISTRATION_TYPES = {
  EARLY_BIRD: 'early-bird',
  REGULAR: 'regular',
  STUDENT: 'student',
  SPEAKER: 'speaker',
} as const;

// Attendance types
export const ATTENDANCE_TYPES = {
  IN_PERSON: 'in-person',
  VIRTUAL: 'virtual',
  HYBRID: 'hybrid',
} as const;

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

// Registration statuses
export const REGISTRATION_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

// Form field names
export const FORM_FIELDS = {
  TITLE: 'title',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  PHONE: 'phone',
  COUNTRY: 'country',
  ORGANIZATION: 'organization',
  JOB_TITLE: 'jobTitle',
  ADDRESS: 'address',
  CITY: 'city',
  STATE: 'state',
  ZIP_CODE: 'zipCode',
  REGISTRATION_TYPE: 'registrationType',
  ATTENDANCE_TYPE: 'attendanceType',
  DIETARY_REQUIREMENTS: 'dietaryRequirements',
  ACCESSIBILITY_NEEDS: 'accessibilityNeeds',
  MARKETING_CONSENT: 'marketingConsent',
  NEWSLETTER_SUBSCRIPTION: 'newsletterSubscription',
  SPECIAL_REQUESTS: 'specialRequests',
} as const;

// Title options
export const TITLE_OPTIONS = [
  { value: 'mr', label: 'Mr.' },
  { value: 'mrs', label: 'Mrs.' },
  { value: 'ms', label: 'Ms.' },
  { value: 'dr', label: 'Dr.' },
  { value: 'prof', label: 'Prof.' },
  { value: 'other', label: 'Other' },
];

// Country list (top countries first)
export const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'BR', label: 'Brazil' },
  // Add more countries as needed
];

// Supported currencies
export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
];

// Registration steps
export const REGISTRATION_STEPS = [
  {
    id: 'personal-info',
    title: 'Personal Information',
    description: 'Basic personal details',
  },
  {
    id: 'contact-details',
    title: 'Contact Details',
    description: 'Address and contact information',
  },
  {
    id: 'conference-preferences',
    title: 'Conference Preferences',
    description: 'Registration and attendance type',
  },
  {
    id: 'additional-info',
    title: 'Additional Information',
    description: 'Optional details and preferences',
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Review your information',
  },
  {
    id: 'payment',
    title: 'Payment',
    description: 'Complete your payment',
  },
  {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Registration complete',
  },
];

// Validation rules
export const VALIDATION_RULES = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,
  MIN_ADDRESS_LENGTH: 5,
  MAX_ADDRESS_LENGTH: 200,
  MIN_PASSWORD_LENGTH: 8,
  MAX_SPECIAL_REQUESTS_LENGTH: 500,
};

// API endpoints
export const API_ENDPOINTS = {
  REGISTRATION: {
    CREATE: '/api/registration/create',
    UPDATE: '/api/registration/update',
    GET: '/api/registration',
    LIST: '/api/registration/list',
    DELETE: '/api/registration/delete',
  },
  PAYMENT: {
    CREATE_ORDER: '/api/paypal/create-order',
    CAPTURE_ORDER: '/api/paypal/capture-order',
    WEBHOOK: '/api/paypal/webhook',
    CONFIG: '/api/paypal/config',
  },
  HEALTH: '/api/health',
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_NAME: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your information and try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_CREATED: 'Registration created successfully!',
  PAYMENT_COMPLETED: 'Payment completed successfully!',
  EMAIL_SENT: 'Confirmation email sent successfully!',
  DATA_SAVED: 'Your information has been saved.',
};

// PayPal configuration
export const PAYPAL_CONFIG = {
  CURRENCY: 'USD',
  LOCALE: 'en_US',
  INTENT: 'CAPTURE',
  BUTTON_STYLE: {
    layout: 'vertical',
    color: 'blue',
    shape: 'rect',
    label: 'paypal',
    height: 45,
    tagline: false,
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  REGISTRATION_DRAFT: 'registration_draft',
  USER_PREFERENCES: 'user_preferences',
  FORM_PROGRESS: 'form_progress',
};

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  FULL: 'EEEE, MMMM dd, yyyy',
  ISO: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm',
};

// File upload limits
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  MAX_FILES: 3,
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Timeout values (in milliseconds)
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  PAYMENT_PROCESSING: 300000, // 5 minutes
  SESSION: 3600000, // 1 hour
};
