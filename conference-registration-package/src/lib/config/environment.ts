// =============================================================================
// ENVIRONMENT CONFIGURATION
// =============================================================================

// Environment variables with fallbacks and validation
export const env = {
  // Application settings
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Conference Registration',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@example.com',
  
  // PayPal configuration
  PAYPAL: {
    CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID_HERE',
    CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || 'YOUR_PAYPAL_CLIENT_SECRET_HERE',
    ENVIRONMENT: (process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT as 'sandbox' | 'live') || 'sandbox',
    WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID || 'YOUR_PAYPAL_WEBHOOK_ID_HERE',
  },
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/conference_db',
  
  // Email configuration
  SMTP: {
    HOST: process.env.SMTP_HOST || 'smtp.example.com',
    PORT: parseInt(process.env.SMTP_PORT || '587'),
    USER: process.env.SMTP_USER || 'your-email@example.com',
    PASSWORD: process.env.SMTP_PASSWORD || 'your-email-password',
    FROM: process.env.SMTP_FROM || 'noreply@example.com',
  },
  
  // Security settings
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-here',
  
  // Conference settings
  CONFERENCE: {
    NAME: process.env.NEXT_PUBLIC_CONFERENCE_NAME || 'Your Conference 2025',
    DATE: process.env.NEXT_PUBLIC_CONFERENCE_DATE || '2025-06-15',
    LOCATION: process.env.NEXT_PUBLIC_CONFERENCE_LOCATION || 'Your City, Country',
    EARLY_BIRD_DEADLINE: process.env.NEXT_PUBLIC_EARLY_BIRD_DEADLINE || '2025-04-15',
    REGULAR_DEADLINE: process.env.NEXT_PUBLIC_REGULAR_DEADLINE || '2025-05-30',
  },
  
  // Pricing (in USD)
  PRICING: {
    EARLY_BIRD: parseFloat(process.env.NEXT_PUBLIC_EARLY_BIRD_PRICE || '299'),
    REGULAR: parseFloat(process.env.NEXT_PUBLIC_REGULAR_PRICE || '399'),
    STUDENT_DISCOUNT: parseFloat(process.env.NEXT_PUBLIC_STUDENT_DISCOUNT || '50'),
  },
  
  // Third-party integrations
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  
  // Development settings
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEBUG_MODE: process.env.DEBUG_MODE === 'true',
  
  // Webhook endpoints
  WEBHOOK_URL: process.env.PAYPAL_WEBHOOK_URL || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/paypal/webhook`,
};

// Validation function to check if all required environment variables are set
export const validateEnvironment = (): { isValid: boolean; missingVars: string[] } => {
  const requiredVars = [
    'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET',
    'DATABASE_URL',
    'JWT_SECRET',
    'SESSION_SECRET',
  ];
  
  const missingVars = requiredVars.filter(varName => {
    const value = process.env[varName];
    return !value || value.includes('YOUR_') || value.includes('_HERE');
  });
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
};

// Check if we're in production
export const isProduction = (): boolean => {
  return env.NODE_ENV === 'production';
};

// Check if we're in development
export const isDevelopment = (): boolean => {
  return env.NODE_ENV === 'development';
};

// Check if PayPal is configured for production
export const isPayPalProduction = (): boolean => {
  return env.PAYPAL.ENVIRONMENT === 'live';
};

// Get base URL for API calls
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return '';
  }
  
  // Server should use full URL
  return env.APP_URL;
};

// Get PayPal configuration for client-side
export const getPayPalClientConfig = () => {
  return {
    'client-id': env.PAYPAL.CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
    'data-client-token': undefined, // Will be set if needed
    'enable-funding': 'venmo,paylater',
    'disable-funding': '',
    'data-sdk-integration-source': 'integrationbuilder_sc',
  };
};

// Configuration validation on startup
if (typeof window === 'undefined') {
  // Only run validation on server-side
  const validation = validateEnvironment();
  
  if (!validation.isValid && isProduction()) {
    console.error('❌ Missing required environment variables in production:');
    validation.missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('Please check your .env.local file and ensure all required variables are set.');
  } else if (!validation.isValid && isDevelopment()) {
    console.warn('⚠️  Missing environment variables in development:');
    validation.missingVars.forEach(varName => {
      console.warn(`   - ${varName}`);
    });
    console.warn('Some features may not work correctly. Please check your .env.local file.');
  }
  
  if (isDevelopment()) {
    console.log('🔧 Development mode configuration:');
    console.log(`   - PayPal Environment: ${env.PAYPAL.ENVIRONMENT}`);
    console.log(`   - Database: ${env.DATABASE_URL.includes('localhost') ? 'Local' : 'Remote'}`);
    console.log(`   - Debug Mode: ${env.DEBUG_MODE ? 'Enabled' : 'Disabled'}`);
  }
}
