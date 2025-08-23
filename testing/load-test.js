#!/usr/bin/env node

// Load Testing Script for Conference Registration System
// Tests the scalable architecture under various load conditions

const http = require('http');
const https = require('https');
const { performance } = require('perf_hooks');

// Configuration
const CONFIG = {
  baseUrl: process.env.TEST_URL || 'http://localhost',
  maxConcurrentUsers: parseInt(process.env.MAX_USERS) || 500,
  testDuration: parseInt(process.env.TEST_DURATION) || 300, // 5 minutes
  rampUpTime: parseInt(process.env.RAMP_UP_TIME) || 60, // 1 minute
  endpoints: [
    { path: '/', weight: 40, method: 'GET' },
    { path: '/api/health', weight: 10, method: 'GET' },
    { path: '/api/conferences', weight: 20, method: 'GET' },
    { path: '/api/speakers', weight: 15, method: 'GET' },
    { path: '/api/sponsorship-tiers', weight: 10, method: 'GET' },
    { path: '/register', weight: 5, method: 'GET' }
  ]
};

// Metrics tracking
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimes: [],
  errorsByCode: {},
  requestsPerSecond: [],
  concurrentUsers: 0,
  startTime: null,
  endTime: null
};

// Utility functions
function log(level, message, data = {}) {
  const timestamp = new Date().toISOString();
  const logData = Object.keys(data).length > 0 ? ` ${JSON.stringify(data)}` : '';
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}${logData}`);
}

function getRandomEndpoint() {
  const totalWeight = CONFIG.endpoints.reduce((sum, ep) => sum + ep.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const endpoint of CONFIG.endpoints) {
    random -= endpoint.weight;
    if (random <= 0) {
      return endpoint;
    }
  }
  
  return CONFIG.endpoints[0]; // fallback
}

function makeRequest(endpoint) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const url = new URL(endpoint.path, CONFIG.baseUrl);
    const isHttps = url.protocol === 'https:';
    const httpModule = isHttps ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: endpoint.method,
      headers: {
        'User-Agent': 'LoadTest/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
      },
      timeout: 30000 // 30 second timeout
    };

    const req = httpModule.request(options, (res) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        metrics.totalRequests++;
        metrics.responseTimes.push(responseTime);
        
        if (res.statusCode >= 200 && res.statusCode < 400) {
          metrics.successfulRequests++;
        } else {
          metrics.failedRequests++;
          metrics.errorsByCode[res.statusCode] = (metrics.errorsByCode[res.statusCode] || 0) + 1;
        }
        
        resolve({
          statusCode: res.statusCode,
          responseTime,
          success: res.statusCode >= 200 && res.statusCode < 400,
          endpoint: endpoint.path
        });
      });
    });

    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      metrics.totalRequests++;
      metrics.failedRequests++;
      metrics.responseTimes.push(responseTime);
      metrics.errorsByCode['ERROR'] = (metrics.errorsByCode['ERROR'] || 0) + 1;
      
      resolve({
        statusCode: 0,
        responseTime,
        success: false,
        error: error.message,
        endpoint: endpoint.path
      });
    });

    req.on('timeout', () => {
      req.destroy();
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      metrics.totalRequests++;
      metrics.failedRequests++;
      metrics.responseTimes.push(responseTime);
      metrics.errorsByCode['TIMEOUT'] = (metrics.errorsByCode['TIMEOUT'] || 0) + 1;
      
      resolve({
        statusCode: 0,
        responseTime,
        success: false,
        error: 'Request timeout',
        endpoint: endpoint.path
      });
    });

    req.end();
  });
}

async function simulateUser(userId, duration) {
  const userStartTime = performance.now();
  const userMetrics = {
    requests: 0,
    errors: 0,
    totalResponseTime: 0
  };

  log('debug', `User ${userId} started`);
  metrics.concurrentUsers++;

  while (performance.now() - userStartTime < duration * 1000) {
    const endpoint = getRandomEndpoint();
    const result = await makeRequest(endpoint);
    
    userMetrics.requests++;
    userMetrics.totalResponseTime += result.responseTime;
    
    if (!result.success) {
      userMetrics.errors++;
      log('warn', `User ${userId} request failed`, {
        endpoint: result.endpoint,
        statusCode: result.statusCode,
        error: result.error
      });
    }

    // Random think time between requests (1-5 seconds)
    const thinkTime = Math.random() * 4000 + 1000;
    await new Promise(resolve => setTimeout(resolve, thinkTime));
  }

  metrics.concurrentUsers--;
  
  const avgResponseTime = userMetrics.totalResponseTime / userMetrics.requests;
  log('info', `User ${userId} completed`, {
    requests: userMetrics.requests,
    errors: userMetrics.errors,
    avgResponseTime: Math.round(avgResponseTime)
  });
}

function calculateStats() {
  if (metrics.responseTimes.length === 0) return {};

  const sorted = metrics.responseTimes.slice().sort((a, b) => a - b);
  const len = sorted.length;
  
  return {
    min: Math.round(sorted[0]),
    max: Math.round(sorted[len - 1]),
    avg: Math.round(sorted.reduce((a, b) => a + b, 0) / len),
    p50: Math.round(sorted[Math.floor(len * 0.5)]),
    p90: Math.round(sorted[Math.floor(len * 0.9)]),
    p95: Math.round(sorted[Math.floor(len * 0.95)]),
    p99: Math.round(sorted[Math.floor(len * 0.99)])
  };
}

function printProgress() {
  const elapsed = (performance.now() - metrics.startTime) / 1000;
  const rps = metrics.totalRequests / elapsed;
  const successRate = (metrics.successfulRequests / metrics.totalRequests * 100) || 0;
  const stats = calculateStats();
  
  console.clear();
  console.log('🚀 Conference Registration System - Load Test');
  console.log('=' .repeat(60));
  console.log(`⏱️  Elapsed Time: ${Math.round(elapsed)}s`);
  console.log(`👥 Concurrent Users: ${metrics.concurrentUsers}`);
  console.log(`📊 Total Requests: ${metrics.totalRequests}`);
  console.log(`✅ Successful: ${metrics.successfulRequests}`);
  console.log(`❌ Failed: ${metrics.failedRequests}`);
  console.log(`📈 Requests/sec: ${rps.toFixed(2)}`);
  console.log(`🎯 Success Rate: ${successRate.toFixed(2)}%`);
  console.log('');
  console.log('📊 Response Times (ms):');
  console.log(`   Min: ${stats.min || 0}`);
  console.log(`   Avg: ${stats.avg || 0}`);
  console.log(`   P50: ${stats.p50 || 0}`);
  console.log(`   P90: ${stats.p90 || 0}`);
  console.log(`   P95: ${stats.p95 || 0}`);
  console.log(`   P99: ${stats.p99 || 0}`);
  console.log(`   Max: ${stats.max || 0}`);
  
  if (Object.keys(metrics.errorsByCode).length > 0) {
    console.log('');
    console.log('❌ Errors by Type:');
    Object.entries(metrics.errorsByCode).forEach(([code, count]) => {
      console.log(`   ${code}: ${count}`);
    });
  }
}

async function runLoadTest() {
  log('info', 'Starting load test', CONFIG);
  
  metrics.startTime = performance.now();
  
  // Progress reporting
  const progressInterval = setInterval(printProgress, 2000);
  
  // Ramp up users gradually
  const usersPerSecond = CONFIG.maxConcurrentUsers / CONFIG.rampUpTime;
  const userPromises = [];
  
  for (let i = 0; i < CONFIG.maxConcurrentUsers; i++) {
    const delay = (i / usersPerSecond) * 1000;
    const remainingTime = CONFIG.testDuration - (delay / 1000);
    
    setTimeout(() => {
      if (remainingTime > 0) {
        userPromises.push(simulateUser(i + 1, remainingTime));
      }
    }, delay);
  }
  
  // Wait for test duration
  await new Promise(resolve => setTimeout(resolve, CONFIG.testDuration * 1000));
  
  // Wait for all users to complete
  log('info', 'Waiting for users to complete...');
  await Promise.all(userPromises);
  
  clearInterval(progressInterval);
  metrics.endTime = performance.now();
  
  // Final report
  console.clear();
  printFinalReport();
}

function printFinalReport() {
  const totalTime = (metrics.endTime - metrics.startTime) / 1000;
  const rps = metrics.totalRequests / totalTime;
  const successRate = (metrics.successfulRequests / metrics.totalRequests * 100) || 0;
  const stats = calculateStats();
  
  console.log('🎉 Load Test Completed!');
  console.log('=' .repeat(60));
  console.log(`⏱️  Total Duration: ${Math.round(totalTime)}s`);
  console.log(`👥 Max Concurrent Users: ${CONFIG.maxConcurrentUsers}`);
  console.log(`📊 Total Requests: ${metrics.totalRequests}`);
  console.log(`✅ Successful Requests: ${metrics.successfulRequests}`);
  console.log(`❌ Failed Requests: ${metrics.failedRequests}`);
  console.log(`📈 Average RPS: ${rps.toFixed(2)}`);
  console.log(`🎯 Success Rate: ${successRate.toFixed(2)}%`);
  console.log('');
  console.log('📊 Response Time Statistics (ms):');
  console.log(`   Minimum: ${stats.min || 0}`);
  console.log(`   Average: ${stats.avg || 0}`);
  console.log(`   Median (P50): ${stats.p50 || 0}`);
  console.log(`   90th Percentile: ${stats.p90 || 0}`);
  console.log(`   95th Percentile: ${stats.p95 || 0}`);
  console.log(`   99th Percentile: ${stats.p99 || 0}`);
  console.log(`   Maximum: ${stats.max || 0}`);
  
  console.log('');
  console.log('🎯 Performance Assessment:');
  
  if (successRate >= 99.5) {
    console.log('✅ Excellent: Success rate > 99.5%');
  } else if (successRate >= 99) {
    console.log('✅ Good: Success rate > 99%');
  } else if (successRate >= 95) {
    console.log('⚠️  Warning: Success rate < 99%');
  } else {
    console.log('❌ Critical: Success rate < 95%');
  }
  
  if (stats.p95 <= 2000) {
    console.log('✅ Excellent: 95th percentile response time ≤ 2s');
  } else if (stats.p95 <= 5000) {
    console.log('⚠️  Warning: 95th percentile response time > 2s');
  } else {
    console.log('❌ Critical: 95th percentile response time > 5s');
  }
  
  if (rps >= 100) {
    console.log('✅ Excellent: Throughput ≥ 100 RPS');
  } else if (rps >= 50) {
    console.log('✅ Good: Throughput ≥ 50 RPS');
  } else {
    console.log('⚠️  Warning: Throughput < 50 RPS');
  }
  
  if (Object.keys(metrics.errorsByCode).length > 0) {
    console.log('');
    console.log('❌ Error Breakdown:');
    Object.entries(metrics.errorsByCode).forEach(([code, count]) => {
      const percentage = (count / metrics.totalRequests * 100).toFixed(2);
      console.log(`   ${code}: ${count} (${percentage}%)`);
    });
  }
  
  console.log('');
  console.log('📋 Recommendations:');
  
  if (successRate < 99) {
    console.log('• Investigate failed requests and error patterns');
    console.log('• Check server logs for error details');
    console.log('• Consider increasing server resources');
  }
  
  if (stats.p95 > 2000) {
    console.log('• Optimize slow endpoints');
    console.log('• Review database query performance');
    console.log('• Consider adding more cache layers');
  }
  
  if (rps < 50) {
    console.log('• Scale up server instances');
    console.log('• Optimize application performance');
    console.log('• Review load balancer configuration');
  }
  
  console.log('');
  console.log('🔗 Next Steps:');
  console.log('• Review application logs during test period');
  console.log('• Check monitoring dashboards for resource usage');
  console.log('• Run tests with different load patterns');
  console.log('• Test auto-scaling behavior under sustained load');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('info', 'Received SIGINT, stopping load test...');
  if (metrics.startTime && !metrics.endTime) {
    metrics.endTime = performance.now();
    printFinalReport();
  }
  process.exit(0);
});

// Start the load test
if (require.main === module) {
  runLoadTest().catch(error => {
    log('error', 'Load test failed', { error: error.message });
    process.exit(1);
  });
}
