import { NextRequest, NextResponse } from 'next/server';
import { testSanityConnection } from '../../sanity/client';

// Performance metrics tracking
let requestCount = 0;
let errorCount = 0;
let totalResponseTime = 0;
const startTime = Date.now();

export async function GET(_request: NextRequest) {
  const requestStart = Date.now();
  requestCount++;

  try {
    console.warn('🏥 Health check initiated...');

    // Test Sanity connection
    const sanityConnected = await testSanityConnection();

    // Get current timestamp
    const timestamp = new Date().toISOString();

    // Calculate response time
    const responseTime = Date.now() - requestStart;
    totalResponseTime += responseTime;

    // Get memory usage
    const memUsage = process.memoryUsage();

    // Prepare health status with enhanced metrics
    const healthStatus = {
      status: sanityConnected ? 'healthy' : 'unhealthy',
      timestamp,
      instance: process.env.INSTANCE_ID || 'unknown',
      services: {
        sanity: {
          status: sanityConnected ? 'connected' : 'disconnected',
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'unknown',
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'unknown',
          apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'unknown'
        },
        frontend: {
          status: 'running',
          environment: process.env.NODE_ENV || 'unknown'
        },
        redis: {
          status: process.env.REDIS_URL ? 'configured' : 'not_configured',
          url: process.env.REDIS_URL ? 'configured' : 'none'
        }
      },
      uptime: process.uptime(),
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024), // MB
        arrayBuffers: Math.round(memUsage.arrayBuffers / 1024 / 1024) // MB
      },
      performance: {
        requestCount,
        errorCount,
        averageResponseTime: requestCount > 0 ? Math.round(totalResponseTime / requestCount) : 0,
        currentResponseTime: responseTime,
        uptime: Math.floor((Date.now() - startTime) / 1000)
      }
    };

    console.warn('🏥 Health check completed:', healthStatus.status);

    return NextResponse.json(healthStatus, {
      status: sanityConnected ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Instance-ID': process.env.INSTANCE_ID || 'unknown',
        'X-Response-Time': responseTime.toString()
      }
    });

  } catch (error) {
    errorCount++;
    const responseTime = Date.now() - requestStart;
    totalResponseTime += responseTime;

    console.error('❌ Health check failed:', error);

    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      instance: process.env.INSTANCE_ID || 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        sanity: { status: 'error' },
        frontend: { status: 'error' }
      },
      performance: {
        requestCount,
        errorCount,
        averageResponseTime: requestCount > 0 ? Math.round(totalResponseTime / requestCount) : 0,
        currentResponseTime: responseTime
      }
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Instance-ID': process.env.INSTANCE_ID || 'unknown',
        'X-Response-Time': responseTime.toString()
      }
    });
  }
}
