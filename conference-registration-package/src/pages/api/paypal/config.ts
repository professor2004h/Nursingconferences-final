// =============================================================================
// PAYPAL CONFIG API ROUTE
// =============================================================================

import { NextApiRequest, NextApiResponse } from 'next';
import { paypalConfig, validatePayPalConfig, isPayPalProductionReady } from '@/lib/config/paypal';
import { env } from '@/lib/config/environment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Validate PayPal configuration
    const configValidation = validatePayPalConfig();
    const productionReadiness = isPayPalProductionReady();

    // Return client-safe configuration
    const clientConfig = {
      clientId: paypalConfig.clientId,
      environment: paypalConfig.environment,
      currency: paypalConfig.currency,
      locale: paypalConfig.locale,
    };

    // Configuration status
    const status = {
      isConfigured: configValidation.isValid,
      isProductionReady: productionReadiness.ready,
      environment: paypalConfig.environment,
      errors: configValidation.errors,
      warnings: productionReadiness.issues,
    };

    // Development information (only in development mode)
    const developmentInfo = env.NODE_ENV === 'development' ? {
      webhookUrl: env.WEBHOOK_URL,
      appUrl: env.APP_URL,
      debugMode: env.DEBUG_MODE,
    } : undefined;

    return res.status(200).json({
      success: true,
      config: clientConfig,
      status,
      developmentInfo,
    });

  } catch (error) {
    console.error('❌ PayPal config error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
