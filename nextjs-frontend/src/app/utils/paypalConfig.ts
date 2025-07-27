/**
 * PayPal Configuration and Validation Utility
 * Provides centralized PayPal configuration management with proper error handling
 */

export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
  baseUrl: string;
  isConfigured: boolean;
}

/**
 * Validates and returns PayPal configuration
 * Throws descriptive errors for missing or invalid configuration
 */
export function getPayPalConfig(): PayPalConfig {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const environment = (process.env.PAYPAL_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production';
  const baseUrl = environment === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

  // Validate required environment variables
  const missingVars: string[] = [];
  
  if (!clientId) {
    missingVars.push('PAYPAL_CLIENT_ID');
  }
  
  if (!clientSecret) {
    missingVars.push('PAYPAL_CLIENT_SECRET');
  }

  if (missingVars.length > 0) {
    const errorMessage = `Missing PayPal environment variables: ${missingVars.join(', ')}`;
    console.error('❌ PayPal Configuration Error:', errorMessage);
    throw new Error(errorMessage);
  }

  // Validate environment
  if (!['sandbox', 'production'].includes(environment)) {
    const errorMessage = `Invalid PAYPAL_ENVIRONMENT: ${environment}. Must be 'sandbox' or 'production'`;
    console.error('❌ PayPal Configuration Error:', errorMessage);
    throw new Error(errorMessage);
  }

  console.log('✅ PayPal Configuration Valid:', {
    environment,
    baseUrl,
    clientIdLength: clientId.length,
    hasClientSecret: !!clientSecret
  });

  return {
    clientId,
    clientSecret,
    environment,
    baseUrl,
    isConfigured: true
  };
}

/**
 * Gets client-side PayPal configuration
 * Only returns public configuration safe for client-side use
 */
export function getClientPayPalConfig() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const environment = (process.env.PAYPAL_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (!clientId) {
    const errorMessage = 'Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID environment variable';
    console.error('❌ Client PayPal Configuration Error:', errorMessage);
    throw new Error(errorMessage);
  }

  console.log('✅ Client PayPal Configuration Valid:', {
    environment,
    baseUrl,
    clientIdLength: clientId.length
  });

  return {
    clientId,
    environment,
    baseUrl,
    isConfigured: true
  };
}

/**
 * Validates PayPal configuration without throwing errors
 * Returns validation result with detailed error information
 */
export function validatePayPalConfig(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config?: Partial<PayPalConfig>;
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const publicClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Check required server-side variables
  if (!clientId) {
    errors.push('PAYPAL_CLIENT_ID is missing');
  }
  
  if (!clientSecret) {
    errors.push('PAYPAL_CLIENT_SECRET is missing');
  }
  
  if (!publicClientId) {
    errors.push('NEXT_PUBLIC_PAYPAL_CLIENT_ID is missing');
  }

  // Check if client IDs match
  if (clientId && publicClientId && clientId !== publicClientId) {
    warnings.push('PAYPAL_CLIENT_ID and NEXT_PUBLIC_PAYPAL_CLIENT_ID do not match');
  }

  // Validate environment
  if (!['sandbox', 'production'].includes(environment)) {
    errors.push(`Invalid PAYPAL_ENVIRONMENT: ${environment}. Must be 'sandbox' or 'production'`);
  }

  // Check base URL
  if (!baseUrl) {
    warnings.push('NEXT_PUBLIC_BASE_URL is missing - using default');
  }

  // Environment-specific warnings
  if (environment === 'production') {
    if (!baseUrl || baseUrl.includes('localhost')) {
      warnings.push('Production environment detected but base URL appears to be localhost');
    }

    // Production-specific validations
    if (clientId && clientId.length < 50) {
      warnings.push('Production Client ID appears to be too short');
    }

    if (clientSecret && clientSecret.length < 50) {
      warnings.push('Production Client Secret appears to be too short');
    }

    console.log('🔒 PRODUCTION PayPal environment detected - real money transactions enabled!');
  } else {
    console.log('🧪 Sandbox PayPal environment detected - test transactions only');
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    config: isValid ? {
      clientId,
      clientSecret,
      environment: environment as 'sandbox' | 'production',
      baseUrl: environment === 'sandbox' 
        ? 'https://api-m.sandbox.paypal.com'
        : 'https://api-m.paypal.com',
      isConfigured: true
    } : undefined
  };
}

/**
 * Logs PayPal configuration status for debugging
 */
export function logPayPalConfigStatus(): void {
  console.log('🔍 PayPal Configuration Status Check:');
  
  const validation = validatePayPalConfig();
  
  if (validation.isValid) {
    console.log('✅ PayPal configuration is valid');
    if (validation.config) {
      console.log('📋 Configuration details:', {
        environment: validation.config.environment,
        baseUrl: validation.config.baseUrl,
        hasClientId: !!validation.config.clientId,
        hasClientSecret: !!validation.config.clientSecret
      });
    }
  } else {
    console.error('❌ PayPal configuration is invalid');
    validation.errors.forEach(error => console.error(`  - ${error}`));
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ PayPal configuration warnings:');
    validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
}
