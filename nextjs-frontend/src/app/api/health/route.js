import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        sanity: {
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? 'configured' : 'missing',
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ? 'configured' : 'missing',
        },
        paypal: {
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 'configured' : 'missing',
          environment: process.env.PAYPAL_ENVIRONMENT || 'not-set',
        }
      }
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error.message,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
