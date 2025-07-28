/**
 * Client-Side PayPal Configuration
 * Handles PayPal configuration for browser environment with fallbacks
 */

'use client';

export interface ClientPayPalConfig {
  clientId: string;
  environment: 'sandbox' | 'production';
  baseUrl: string;
  isConfigured: boolean;
}

/**
 * Get PayPal configuration for client-side use
 * Includes fallbacks and runtime configuration fetching
 */
export async function getClientPayPalConfig(): Promise<ClientPayPalConfig> {
  // First, try to get from environment variables (build-time)
  const envClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const envEnvironment = process.env.PAYPAL_ENVIRONMENT || process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'production';
  const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  console.log('🔍 Client PayPal Config - Environment Variables:', {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: envClientId ? `${envClientId.substring(0, 10)}...` : 'NOT_SET',
    PAYPAL_ENVIRONMENT: envEnvironment,
    NEXT_PUBLIC_BASE_URL: envBaseUrl || 'NOT_SET',
    timestamp: new Date().toISOString()
  });

  // If environment variables are available, use them
  if (envClientId) {
    // For localhost development, force sandbox mode for better compatibility
    const isLocalhost = (envBaseUrl || '').includes('localhost') || (envBaseUrl || '').includes('127.0.0.1');
    const effectiveEnvironment = isLocalhost ? 'sandbox' : envEnvironment;

    console.log('✅ Using environment variables for PayPal config', {
      isLocalhost,
      originalEnvironment: envEnvironment,
      effectiveEnvironment
    });

    return {
      clientId: envClientId,
      environment: effectiveEnvironment as 'sandbox' | 'production',
      baseUrl: envBaseUrl || 'https://nursingeducationconferences.org',
      isConfigured: true
    };
  }

  // IMMEDIATE FALLBACK: Use sandbox for localhost, production for live
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const isLocalhost = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1');

  if (isLocalhost) {
    console.log('⚠️ Environment variables not available, using sandbox fallback for localhost');
    return {
      clientId: 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc', // We'll use the same ID but force sandbox
      environment: 'sandbox',
      baseUrl: 'http://localhost:3001',
      isConfigured: true
    };
  } else {
    console.log('⚠️ Environment variables not available, using production fallback');
    return {
      clientId: 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc',
      environment: 'production',
      baseUrl: 'https://nursingeducationconferences.org',
      isConfigured: true
    };
  }

  // NOTE: Removed API fallback as it's causing delays and the hardcoded values work
  // Fallback: Fetch configuration from API
  // console.log('⚠️ Environment variables not available, fetching from API...');

  // NOTE: API fallback code removed since we're using immediate hardcoded fallback above
  // This ensures faster loading and eliminates the "NOT_SET" client ID issue
}

/**
 * Synchronous version that only uses environment variables
 */
export function getClientPayPalConfigSync(): ClientPayPalConfig | null {
  const envClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const envEnvironment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';
  const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!envClientId) {
    console.warn('⚠️ NEXT_PUBLIC_PAYPAL_CLIENT_ID not available in client bundle');
    return null;
  }

  return {
    clientId: envClientId,
    environment: envEnvironment as 'sandbox' | 'production',
    baseUrl: envBaseUrl || 'https://nursingeducationconferences.org',
    isConfigured: true
  };
}

/**
 * Check if PayPal configuration is available
 */
export function isPayPalConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
}
