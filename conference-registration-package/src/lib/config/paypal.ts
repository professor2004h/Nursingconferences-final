// =============================================================================
// PAYPAL CONFIGURATION
// =============================================================================

import { env, isPayPalProduction } from './environment';
import { PayPalConfig } from '@/types/payment';

// PayPal SDK configuration
export const paypalConfig: PayPalConfig = {
  clientId: env.PAYPAL.CLIENT_ID,
  clientSecret: env.PAYPAL.CLIENT_SECRET,
  environment: env.PAYPAL.ENVIRONMENT,
  webhookId: env.PAYPAL.WEBHOOK_ID,
  currency: 'USD',
  locale: 'en_US',
};

// PayPal API URLs
export const getPayPalApiUrl = (): string => {
  return isPayPalProduction() 
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
};

// PayPal SDK script options for client-side
export const getPayPalScriptOptions = () => {
  return {
    'client-id': paypalConfig.clientId,
    currency: paypalConfig.currency,
    intent: 'capture',
    locale: paypalConfig.locale,
    'enable-funding': 'venmo,paylater',
    'disable-funding': '',
    'data-sdk-integration-source': 'integrationbuilder_sc',
    components: 'buttons,funding-eligibility',
  };
};

// PayPal button style configuration
export const paypalButtonStyle = {
  layout: 'vertical' as const,
  color: 'blue' as const,
  shape: 'rect' as const,
  label: 'paypal' as const,
  height: 45,
  tagline: false,
};

// PayPal order configuration
export const createOrderConfig = {
  intent: 'CAPTURE',
  application_context: {
    brand_name: env.APP_NAME,
    landing_page: 'NO_PREFERENCE',
    user_action: 'PAY_NOW',
    return_url: `${env.APP_URL}/registration/success`,
    cancel_url: `${env.APP_URL}/registration`,
  },
};

// PayPal webhook events to handle
export const webhookEvents = [
  'PAYMENT.CAPTURE.COMPLETED',
  'PAYMENT.CAPTURE.DENIED',
  'PAYMENT.CAPTURE.PENDING',
  'PAYMENT.CAPTURE.REFUNDED',
  'CHECKOUT.ORDER.APPROVED',
  'CHECKOUT.ORDER.COMPLETED',
];

// PayPal error codes and messages
export const paypalErrorMessages: Record<string, string> = {
  'INSTRUMENT_DECLINED': 'Your payment method was declined. Please try a different payment method.',
  'PAYER_CANNOT_PAY': 'Unable to process payment. Please contact PayPal support.',
  'PAYER_ACCOUNT_RESTRICTED': 'Your PayPal account has restrictions. Please contact PayPal support.',
  'PAYEE_ACCOUNT_RESTRICTED': 'Merchant account has restrictions. Please contact support.',
  'TRANSACTION_REFUSED': 'Transaction was refused. Please try again or contact support.',
  'INTERNAL_SERVICE_ERROR': 'PayPal service error. Please try again later.',
  'VALIDATION_ERROR': 'Payment validation failed. Please check your information.',
  'PERMISSION_DENIED': 'Permission denied. Please contact support.',
  'INVALID_REQUEST': 'Invalid payment request. Please try again.',
  'RESOURCE_NOT_FOUND': 'Payment resource not found. Please start a new payment.',
};

// Get user-friendly error message
export const getPayPalErrorMessage = (errorCode: string): string => {
  return paypalErrorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

// Validate PayPal configuration
export const validatePayPalConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!paypalConfig.clientId || paypalConfig.clientId.includes('YOUR_')) {
    errors.push('PayPal Client ID is not configured');
  }
  
  if (!paypalConfig.clientSecret || paypalConfig.clientSecret.includes('YOUR_')) {
    errors.push('PayPal Client Secret is not configured');
  }
  
  if (!['sandbox', 'live'].includes(paypalConfig.environment)) {
    errors.push('PayPal environment must be either "sandbox" or "live"');
  }
  
  if (isPayPalProduction() && paypalConfig.clientId.includes('sandbox')) {
    errors.push('Production environment detected but using sandbox credentials');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// PayPal amount validation
export const validatePayPalAmount = (amount: number): { isValid: boolean; error?: string } => {
  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (amount > 10000) {
    return { isValid: false, error: 'Amount exceeds maximum limit ($10,000)' };
  }
  
  if (amount < 1) {
    return { isValid: false, error: 'Amount must be at least $1.00' };
  }
  
  // Check for valid decimal places (max 2)
  if (Number(amount.toFixed(2)) !== amount) {
    return { isValid: false, error: 'Amount can have maximum 2 decimal places' };
  }
  
  return { isValid: true };
};

// Format amount for PayPal (ensure 2 decimal places)
export const formatPayPalAmount = (amount: number): string => {
  return amount.toFixed(2);
};

// Generate PayPal invoice ID
export const generateInvoiceId = (registrationId: string): string => {
  const timestamp = Date.now();
  return `INV_${registrationId}_${timestamp}`;
};

// Generate PayPal custom ID (for tracking)
export const generateCustomId = (registrationId: string): string => {
  return registrationId;
};

// PayPal soft descriptor (appears on credit card statements)
export const getSoftDescriptor = (): string => {
  const appName = env.APP_NAME.replace(/[^a-zA-Z0-9]/g, '').substring(0, 22);
  return appName || 'CONFERENCE_REG';
};

// Check if PayPal is ready for production
export const isPayPalProductionReady = (): { ready: boolean; issues: string[] } => {
  const validation = validatePayPalConfig();
  const issues: string[] = [...validation.errors];
  
  if (isPayPalProduction()) {
    if (!env.PAYPAL.WEBHOOK_ID || env.PAYPAL.WEBHOOK_ID.includes('YOUR_')) {
      issues.push('PayPal Webhook ID is required for production');
    }
    
    if (env.APP_URL.includes('localhost')) {
      issues.push('Production PayPal requires a public domain (not localhost)');
    }
  }
  
  return {
    ready: issues.length === 0,
    issues,
  };
};
