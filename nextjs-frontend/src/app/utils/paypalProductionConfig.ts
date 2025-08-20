/**
 * PayPal Production Configuration
 * Official PayPal SDK configuration for live payments
 */

export interface PayPalConfig {
  clientId: string;
  currency: string;
  environment: 'production' | 'sandbox';
  intent: 'capture' | 'authorize';
  components: string;
  enableFunding?: string;
  disableFunding?: string;
}

/**
 * Production PayPal Configuration
 * Uses live PayPal credentials for real payments
 */
export const paypalProductionConfig: PayPalConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  currency: process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || 'USD',
  environment: 'production', // Live PayPal environment
  intent: 'capture', // Immediate payment capture
  components: 'buttons,funding-eligibility', // Official PayPal button components
  enableFunding: 'venmo,paylater', // Enable additional funding sources
  disableFunding: '', // No disabled funding sources
};

/**
 * PayPal SDK Options for Production
 * Official configuration for PayPal React SDK
 */
export const paypalSDKOptions = {
  clientId: paypalProductionConfig.clientId,
  currency: paypalProductionConfig.currency,
  intent: paypalProductionConfig.intent,
  components: paypalProductionConfig.components,
  enableFunding: paypalProductionConfig.enableFunding,
  disableFunding: paypalProductionConfig.disableFunding,
  // Production-specific options
  dataClientToken: undefined, // Not needed for production
  debug: false, // Disable debug mode for production
};

/**
 * Validate PayPal Configuration
 * Ensures all required production credentials are present
 */
export const validatePayPalConfig = (): boolean => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET',
    'NEXT_PUBLIC_PAYPAL_ENVIRONMENT',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error('❌ Missing PayPal environment variables:', missingVars);
    return false;
  }

  if (process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT !== 'production') {
    console.warn('⚠️ PayPal environment is not set to production');
  }

  return true;
};

/**
 * PayPal Button Style Configuration
 * Official PayPal button styling options
 */
export const paypalButtonStyle = {
  layout: 'vertical' as const,
  color: 'blue' as const,
  shape: 'rect' as const,
  label: 'paypal' as const,
  height: 45,
  tagline: false,
  fundingicons: false,
};

/**
 * PayPal Error Messages
 * User-friendly error messages for common PayPal errors
 */
export const paypalErrorMessages = {
  PAYMENT_CANCELLED: 'Payment was cancelled. You can try again when ready.',
  PAYMENT_FAILED: 'Payment failed. Please check your payment method and try again.',
  INVALID_AMOUNT: 'Invalid payment amount. Please refresh the page and try again.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection and try again.',
  CONFIGURATION_ERROR: 'Payment system configuration error. Please contact support.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again or contact support.',
};

/**
 * PayPal Success Messages
 * User-friendly success messages for completed payments
 */
export const paypalSuccessMessages = {
  PAYMENT_COMPLETED: 'Payment completed successfully!',
  REGISTRATION_CONFIRMED: 'Your registration has been confirmed.',
  TRANSACTION_RECORDED: 'Transaction has been recorded in our system.',
};
