import { NextRequest, NextResponse } from 'next/server';

// Metrics collection
let metrics = {
  http_requests_total: 0,
  http_request_duration_seconds: [],
  http_errors_total: 0,
  memory_usage_bytes: 0,
  cpu_usage_percent: 0,
  active_connections: 0,
  sanity_connection_status: 0, // 1 for connected, 0 for disconnected
  last_updated: Date.now()
};

// Update metrics (this would be called from middleware or other parts of the app)
export function updateMetrics(data: Partial<typeof metrics>) {
  metrics = { ...metrics, ...data, last_updated: Date.now() };
}

export async function GET(_request: NextRequest) {
  try {
    // Get current memory usage
    const memUsage = process.memoryUsage();
    
    // Update memory metrics
    metrics.memory_usage_bytes = memUsage.heapUsed;
    
    // Format metrics in Prometheus format
    const prometheusMetrics = `
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{instance="${process.env.INSTANCE_ID || 'unknown'}"} ${metrics.http_requests_total}

# HELP http_errors_total Total number of HTTP errors
# TYPE http_errors_total counter
http_errors_total{instance="${process.env.INSTANCE_ID || 'unknown'}"} ${metrics.http_errors_total}

# HELP memory_usage_bytes Current memory usage in bytes
# TYPE memory_usage_bytes gauge
memory_usage_bytes{instance="${process.env.INSTANCE_ID || 'unknown'}"} ${metrics.memory_usage_bytes}

# HELP process_uptime_seconds Process uptime in seconds
# TYPE process_uptime_seconds gauge
process_uptime_seconds{instance="${process.env.INSTANCE_ID || 'unknown'}"} ${Math.floor(process.uptime())}

# HELP sanity_connection_status Sanity CMS connection status (1=connected, 0=disconnected)
# TYPE sanity_connection_status gauge
sanity_connection_status{instance="${process.env.INSTANCE_ID || 'unknown'}"} ${metrics.sanity_connection_status}

# HELP nodejs_heap_size_total_bytes Total heap size in bytes
# TYPE nodejs_heap_size_total_bytes gauge
nodejs_heap_size_total_bytes{instance="${process.env.INSTANCE_ID || 'unknown'}"} ${memUsage.heapTotal}

# HELP nodejs_heap_size_used_bytes Used heap size in bytes
# TYPE nodejs_heap_size_used_bytes gauge
nodejs_heap_size_used_bytes{instance="${process.env.INSTANCE_ID || 'unknown'}"} ${memUsage.heapUsed}

# HELP nodejs_external_memory_bytes External memory usage in bytes
# TYPE nodejs_external_memory_bytes gauge
nodejs_external_memory_bytes{instance="${process.env.INSTANCE_ID || 'unknown'}"} ${memUsage.external}

# HELP nodejs_version_info Node.js version information
# TYPE nodejs_version_info gauge
nodejs_version_info{instance="${process.env.INSTANCE_ID || 'unknown'}",version="${process.version}"} 1
`.trim();

    return new NextResponse(prometheusMetrics, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('❌ Metrics endpoint failed:', error);
    
    return NextResponse.json({
      error: 'Failed to generate metrics',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Helper function to increment request counter (to be used in middleware)
export function incrementRequestCounter() {
  metrics.http_requests_total++;
}

// Helper function to increment error counter
export function incrementErrorCounter() {
  metrics.http_errors_total++;
}

// Helper function to record request duration
export function recordRequestDuration(duration: number) {
  metrics.http_request_duration_seconds.push(duration);
  // Keep only last 100 measurements
  if (metrics.http_request_duration_seconds.length > 100) {
    metrics.http_request_duration_seconds.shift();
  }
}

// Helper function to update Sanity connection status
export function updateSanityConnectionStatus(connected: boolean) {
  metrics.sanity_connection_status = connected ? 1 : 0;
}
