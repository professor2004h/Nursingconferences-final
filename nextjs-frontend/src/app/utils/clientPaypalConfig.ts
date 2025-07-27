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
    console.log('✅ Using environment variables for PayPal config');
    return {
      clientId: envClientId,
      environment: envEnvironment as 'sandbox' | 'production',
      baseUrl: envBaseUrl || 'https://nursingeducationconferences.org',
      isConfigured: true
    };
  }

  // Fallback: Fetch configuration from API
  console.log('⚠️ Environment variables not available, fetching from API...');
  
  try {
    const response = await fetch('/api/paypal/client-config');
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.clientId) {
      console.log('✅ Fetched PayPal config from API');
      return {
        clientId: data.clientId,
        environment: data.environment || 'production',
        baseUrl: data.baseUrl || 'https://nursingeducationconferences.org',
        isConfigured: true
      };
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    console.error('❌ Failed to fetch PayPal config from API:', error);
    
    // Last resort: Use hardcoded production values
    console.log('⚠️ Using hardcoded production fallback');
    return {
      clientId: 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc',
      environment: 'production',
      baseUrl: 'https://nursingeducationconferences.org',
      isConfigured: true
    };
  }
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
