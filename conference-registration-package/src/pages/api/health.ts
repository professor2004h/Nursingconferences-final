// =============================================================================
// HEALTH CHECK API ROUTE
// =============================================================================

import { NextApiRequest, NextApiResponse } from 'next';
import { validatePayPalConfig, isPayPalProductionReady } from '@/lib/config/paypal';
import { validateEnvironment, env } from '@/lib/config/environment';
import { HealthCheckResponse } from '@/types/api';

// Check database connection (placeholder - implement with your database)
async function checkDatabaseConnection(): Promise<'connected' | 'disconnected'> {
  try {
    // TODO: Implement database connection check here
    // This is where you would test your database connection
    
    // Example implementation (replace with your database logic):
    /*
    await database.$queryRaw`SELECT 1`;
    return 'connected';
    */

    // Placeholder - always return connected for now
    return 'connected';
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return 'disconnected';
  }
}

// Check PayPal connection
async function checkPayPalConnection(): Promise<'connected' | 'disconnected'> {
  try {
    const validation = validatePayPalConfig();
    if (!validation.isValid) {
      return 'disconnected';
    }

    // Test PayPal API connection by getting an access token
    const auth = Buffer.from(`${env.PAYPAL.CLIENT_ID}:${env.PAYPAL.CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch(`https://api-m.${env.PAYPAL.ENVIRONMENT === 'live' ? '' : 'sandbox.'}paypal.com/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    return response.ok ? 'connected' : 'disconnected';
  } catch (error) {
    console.error('❌ PayPal health check failed:', error);
    return 'disconnected';
  }
}

// Check email service connection (placeholder - implement with your email service)
async function checkEmailConnection(): Promise<'connected' | 'disconnected'> {
  try {
    // TODO: Implement email service connection check here
    // This is where you would test your email service connection
    
    // Example implementation (replace with your email service):
    /*
    await emailService.verify();
    return 'connected';
    */

    // Placeholder - check if SMTP settings are configured
    if (env.SMTP.HOST && env.SMTP.USER && env.SMTP.PASSWORD) {
      return 'connected';
    }
    
    return 'disconnected';
  } catch (error) {
    console.error('❌ Email health check failed:', error);
    return 'disconnected';
  }
}

// Calculate uptime (placeholder - implement with your monitoring)
function getUptime(): number {
  // Return process uptime in seconds
  return Math.floor(process.uptime());
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const startTime = Date.now();

    // Run all health checks in parallel
    const [databaseStatus, paypalStatus, emailStatus] = await Promise.all([
      checkDatabaseConnection(),
      checkPayPalConnection(),
      checkEmailConnection(),
    ]);

    // Determine overall health status
    const allServicesHealthy = [databaseStatus, paypalStatus, emailStatus].every(
      status => status === 'connected'
    );

    // Environment validation
    const envValidation = validateEnvironment();
    const paypalValidation = validatePayPalConfig();
    const paypalProduction = isPayPalProductionReady();

    // Build health check response
    const healthResponse: HealthCheckResponse = {
      status: allServicesHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: databaseStatus,
        paypal: paypalStatus,
        email: emailStatus,
      },
      uptime: getUptime(),
    };

    // Add additional information for development
    if (env.NODE_ENV === 'development') {
      (healthResponse as any).development = {
        environment: env.NODE_ENV,
        paypalEnvironment: env.PAYPAL.ENVIRONMENT,
        envValidation: {
          isValid: envValidation.isValid,
          missingVars: envValidation.missingVars,
        },
        paypalValidation: {
          isValid: paypalValidation.isValid,
          errors: paypalValidation.errors,
        },
        paypalProduction: {
          ready: paypalProduction.ready,
          issues: paypalProduction.issues,
        },
        responseTime: `${Date.now() - startTime}ms`,
      };
    }

    // Set appropriate status code
    const statusCode = allServicesHealthy ? 200 : 503;

    // Log health check result
    console.log(`🏥 Health check completed: ${healthResponse.status} (${Date.now() - startTime}ms)`);

    return res.status(statusCode).json(healthResponse);

  } catch (error) {
    console.error('❌ Health check error:', error);
    
    const errorResponse: HealthCheckResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'disconnected',
        paypal: 'disconnected',
        email: 'disconnected',
      },
      uptime: getUptime(),
    };

    return res.status(503).json(errorResponse);
  }
}
