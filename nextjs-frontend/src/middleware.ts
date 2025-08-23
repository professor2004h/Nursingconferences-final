import { NextRequest, NextResponse } from 'next/server';

// Simple metrics tracking
let requestCount = 0;
let errorCount = 0;
const requestTimes = new Map<string, number>();

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  // Track request start time
  requestTimes.set(requestId, startTime);
  
  // Increment request counter
  requestCount++;
  
  // Create response
  const response = NextResponse.next();
  
  // Add performance headers
  response.headers.set('X-Request-ID', requestId);
  response.headers.set('X-Instance-ID', process.env.INSTANCE_ID || 'unknown');
  response.headers.set('X-Request-Count', requestCount.toString());
  
  // Add security headers for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  }
  
  // Track response time when response is sent
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  response.headers.set('X-Response-Time', `${responseTime}ms`);
  
  // Clean up request time tracking
  requestTimes.delete(requestId);
  
  // Log request for monitoring (in production, you might want to use a proper logger)
  if (process.env.NODE_ENV === 'development') {
    console.log(`${request.method} ${request.url} - ${responseTime}ms`);
  }
  
  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/metrics (avoid recursive calls)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/metrics|_next/static|_next/image|favicon.ico).*)',
  ],
};
