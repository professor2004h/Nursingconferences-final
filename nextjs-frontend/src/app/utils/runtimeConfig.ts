/**
 * Runtime Configuration Loader
 * Handles environment variables that may not be available at build time
 */

interface RuntimePayPalConfig {
  clientId: string | null;
  environment: string;
  currency: string;
  baseUrl: string;
  isLoaded: boolean;
}

class RuntimeConfigManager {
  private static instance: RuntimeConfigManager;
  private config: RuntimePayPalConfig | null = null;
  private loading = false;
  private loadPromise: Promise<RuntimePayPalConfig> | null = null;

  private constructor() {}

  static getInstance(): RuntimeConfigManager {
    if (!RuntimeConfigManager.instance) {
      RuntimeConfigManager.instance = new RuntimeConfigManager();
    }
    return RuntimeConfigManager.instance;
  }

  async getPayPalConfig(): Promise<RuntimePayPalConfig> {
    // Return cached config if available
    if (this.config && this.config.isLoaded) {
      return this.config;
    }

    // Return existing promise if already loading
    if (this.loading && this.loadPromise) {
      return this.loadPromise;
    }

    // Start loading configuration
    this.loading = true;
    this.loadPromise = this.loadConfig();
    
    try {
      this.config = await this.loadPromise;
      return this.config;
    } finally {
      this.loading = false;
    }
  }

  private async loadConfig(): Promise<RuntimePayPalConfig> {
    console.log('🔄 Loading PayPal runtime configuration...');

    // First try client-side environment variables
    let clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    let environment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'production';
    let currency = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || 'USD';
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

    if (clientId) {
      console.log('✅ PayPal config loaded from client-side environment variables');
      return {
        clientId,
        environment,
        currency,
        baseUrl,
        isLoaded: true
      };
    }

    // If client-side variables not available, try API
    try {
      console.log('🔄 Client-side env vars not available, fetching from API...');
      const response = await fetch('/api/paypal/client-config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.clientId) {
        throw new Error('API returned invalid configuration');
      }

      console.log('✅ PayPal config loaded from API');
      return {
        clientId: data.clientId,
        environment: data.environment || 'production',
        currency: currency, // Use default since API doesn't provide this
        baseUrl: data.baseUrl || baseUrl,
        isLoaded: true
      };

    } catch (error) {
      console.error('❌ Failed to load PayPal configuration:', error);
      
      // Return empty config with error state
      return {
        clientId: null,
        environment: 'production',
        currency: 'USD',
        baseUrl: '',
        isLoaded: true
      };
    }
  }

  // Clear cached config (useful for retrying)
  clearCache(): void {
    this.config = null;
    this.loading = false;
    this.loadPromise = null;
    console.log('🔄 PayPal configuration cache cleared');
  }

  // Get current config without loading (returns null if not loaded)
  getCurrentConfig(): RuntimePayPalConfig | null {
    return this.config;
  }
}

// Export singleton instance
export const runtimeConfig = RuntimeConfigManager.getInstance();

// Export convenience function
export async function getPayPalRuntimeConfig(): Promise<RuntimePayPalConfig> {
  return runtimeConfig.getPayPalConfig();
}

// Export function to clear cache
export function clearPayPalConfigCache(): void {
  runtimeConfig.clearCache();
}

// Export function to check if config is loaded
export function isPayPalConfigLoaded(): boolean {
  const config = runtimeConfig.getCurrentConfig();
  return config?.isLoaded || false;
}

// Export function to get current config synchronously
export function getCurrentPayPalConfig(): RuntimePayPalConfig | null {
  return runtimeConfig.getCurrentConfig();
}
