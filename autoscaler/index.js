// Auto-scaler for Conference Registration System
// Monitors metrics and automatically scales containers based on load

const express = require('express');
const axios = require('axios');
const Docker = require('dockerode');

const app = express();
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// Configuration
const CONFIG = {
  PROMETHEUS_URL: process.env.PROMETHEUS_URL || 'http://prometheus:9090',
  SCALE_UP_THRESHOLD: parseInt(process.env.SCALE_UP_THRESHOLD) || 80,
  SCALE_DOWN_THRESHOLD: parseInt(process.env.SCALE_DOWN_THRESHOLD) || 30,
  MIN_REPLICAS: parseInt(process.env.MIN_REPLICAS) || 3,
  MAX_REPLICAS: parseInt(process.env.MAX_REPLICAS) || 10,
  CHECK_INTERVAL: parseInt(process.env.CHECK_INTERVAL) || 30000, // 30 seconds
  SCALE_COOLDOWN: parseInt(process.env.SCALE_COOLDOWN) || 300000, // 5 minutes
  PORT: parseInt(process.env.PORT) || 3001
};

// State tracking
let lastScaleAction = 0;
let currentReplicas = CONFIG.MIN_REPLICAS;
let scalingInProgress = false;

// Metrics storage
const metrics = {
  cpuUsage: [],
  memoryUsage: [],
  requestRate: [],
  responseTime: [],
  errorRate: []
};

// Logging function
function log(level, message, data = {}) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, 
    Object.keys(data).length > 0 ? JSON.stringify(data, null, 2) : '');
}

// Get metrics from Prometheus
async function getMetrics() {
  try {
    const queries = {
      cpuUsage: 'avg(rate(container_cpu_usage_seconds_total{name=~"conference_app_.*"}[5m])) * 100',
      memoryUsage: 'avg(container_memory_usage_bytes{name=~"conference_app_.*"}) / avg(container_spec_memory_limit_bytes{name=~"conference_app_.*"}) * 100',
      requestRate: 'sum(rate(nginx_http_requests_total[5m]))',
      responseTime: 'avg(nginx_http_request_duration_seconds{quantile="0.95"})',
      errorRate: 'sum(rate(nginx_http_requests_total{status=~"5.."}[5m])) / sum(rate(nginx_http_requests_total[5m])) * 100'
    };

    const results = {};
    
    for (const [metric, query] of Object.entries(queries)) {
      try {
        const response = await axios.get(`${CONFIG.PROMETHEUS_URL}/api/v1/query`, {
          params: { query },
          timeout: 5000
        });
        
        if (response.data.status === 'success' && response.data.data.result.length > 0) {
          results[metric] = parseFloat(response.data.data.result[0].value[1]);
        } else {
          results[metric] = 0;
        }
      } catch (error) {
        log('warn', `Failed to get ${metric}`, { error: error.message });
        results[metric] = 0;
      }
    }

    // Store metrics for trend analysis
    Object.keys(metrics).forEach(key => {
      if (results[key] !== undefined) {
        metrics[key].push(results[key]);
        // Keep only last 10 measurements
        if (metrics[key].length > 10) {
          metrics[key].shift();
        }
      }
    });

    return results;
  } catch (error) {
    log('error', 'Failed to fetch metrics from Prometheus', { error: error.message });
    return null;
  }
}

// Get current number of running app containers
async function getCurrentReplicas() {
  try {
    const containers = await docker.listContainers({
      filters: {
        name: ['conference_app_'],
        status: ['running']
      }
    });
    return containers.length;
  } catch (error) {
    log('error', 'Failed to get current replicas', { error: error.message });
    return currentReplicas;
  }
}

// Scale up by creating new container
async function scaleUp() {
  if (scalingInProgress || currentReplicas >= CONFIG.MAX_REPLICAS) {
    return false;
  }

  scalingInProgress = true;
  const newInstanceId = currentReplicas + 1;
  
  try {
    log('info', `Scaling up: Creating app-${newInstanceId}`);
    
    // Create new container based on existing configuration
    const container = await docker.createContainer({
      Image: 'conference_app:latest',
      name: `conference_app_${newInstanceId}`,
      Env: [
        'NODE_ENV=production',
        'NEXT_TELEMETRY_DISABLED=1',
        'PORT=3000',
        'HOSTNAME=0.0.0.0',
        `INSTANCE_ID=app-${newInstanceId}`,
        'REDIS_URL=redis://redis:6379',
        // Add other environment variables as needed
      ],
      HostConfig: {
        Memory: 1610612736, // 1.5GB
        CpuShares: 1024,
        RestartPolicy: { Name: 'unless-stopped' }
      },
      NetworkingConfig: {
        EndpointsConfig: {
          conference_network: {}
        }
      }
    });

    await container.start();
    currentReplicas++;
    lastScaleAction = Date.now();
    
    log('info', `Successfully scaled up to ${currentReplicas} replicas`);
    
    // Update NGINX configuration (would need to implement config reload)
    await updateLoadBalancer();
    
    return true;
  } catch (error) {
    log('error', 'Failed to scale up', { error: error.message });
    return false;
  } finally {
    scalingInProgress = false;
  }
}

// Scale down by removing container
async function scaleDown() {
  if (scalingInProgress || currentReplicas <= CONFIG.MIN_REPLICAS) {
    return false;
  }

  scalingInProgress = true;
  
  try {
    log('info', `Scaling down: Removing app-${currentReplicas}`);
    
    const container = docker.getContainer(`conference_app_${currentReplicas}`);
    await container.stop({ t: 30 }); // 30 second graceful shutdown
    await container.remove();
    
    currentReplicas--;
    lastScaleAction = Date.now();
    
    log('info', `Successfully scaled down to ${currentReplicas} replicas`);
    
    // Update NGINX configuration
    await updateLoadBalancer();
    
    return true;
  } catch (error) {
    log('error', 'Failed to scale down', { error: error.message });
    return false;
  } finally {
    scalingInProgress = false;
  }
}

// Update load balancer configuration (placeholder)
async function updateLoadBalancer() {
  // In a real implementation, this would update NGINX upstream configuration
  // For now, we'll just log the action
  log('info', 'Load balancer configuration updated', { replicas: currentReplicas });
}

// Make scaling decision based on metrics
function makeScalingDecision(currentMetrics) {
  if (!currentMetrics) {
    return 'no_action';
  }

  const { cpuUsage, memoryUsage, requestRate, responseTime, errorRate } = currentMetrics;
  
  // Calculate composite score
  const cpuScore = Math.min(cpuUsage / CONFIG.SCALE_UP_THRESHOLD, 1);
  const memoryScore = Math.min(memoryUsage / CONFIG.SCALE_UP_THRESHOLD, 1);
  const responseTimeScore = Math.min(responseTime / 2, 1); // 2 seconds threshold
  const errorScore = Math.min(errorRate / 5, 1); // 5% error rate threshold
  
  const overallScore = (cpuScore + memoryScore + responseTimeScore + errorScore) / 4;
  
  log('debug', 'Scaling metrics', {
    cpuUsage: cpuUsage.toFixed(2),
    memoryUsage: memoryUsage.toFixed(2),
    requestRate: requestRate.toFixed(2),
    responseTime: responseTime.toFixed(3),
    errorRate: errorRate.toFixed(2),
    overallScore: overallScore.toFixed(3),
    currentReplicas
  });

  // Check cooldown period
  const timeSinceLastScale = Date.now() - lastScaleAction;
  if (timeSinceLastScale < CONFIG.SCALE_COOLDOWN) {
    return 'cooldown';
  }

  // Scale up conditions
  if (overallScore > 0.8 || cpuUsage > CONFIG.SCALE_UP_THRESHOLD || memoryUsage > CONFIG.SCALE_UP_THRESHOLD) {
    return 'scale_up';
  }

  // Scale down conditions (more conservative)
  if (overallScore < 0.3 && cpuUsage < CONFIG.SCALE_DOWN_THRESHOLD && memoryUsage < CONFIG.SCALE_DOWN_THRESHOLD) {
    return 'scale_down';
  }

  return 'no_action';
}

// Main monitoring loop
async function monitorAndScale() {
  try {
    log('debug', 'Starting monitoring cycle');
    
    // Update current replica count
    currentReplicas = await getCurrentReplicas();
    
    // Get current metrics
    const currentMetrics = await getMetrics();
    
    if (!currentMetrics) {
      log('warn', 'No metrics available, skipping scaling decision');
      return;
    }

    // Make scaling decision
    const decision = makeScalingDecision(currentMetrics);
    
    switch (decision) {
      case 'scale_up':
        log('info', 'Scaling decision: SCALE UP', currentMetrics);
        await scaleUp();
        break;
      case 'scale_down':
        log('info', 'Scaling decision: SCALE DOWN', currentMetrics);
        await scaleDown();
        break;
      case 'cooldown':
        log('debug', 'Scaling decision: COOLDOWN PERIOD');
        break;
      case 'no_action':
        log('debug', 'Scaling decision: NO ACTION NEEDED');
        break;
    }
    
  } catch (error) {
    log('error', 'Error in monitoring cycle', { error: error.message });
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    currentReplicas,
    scalingInProgress,
    lastScaleAction: new Date(lastScaleAction).toISOString(),
    config: CONFIG
  });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    currentReplicas,
    metrics,
    config: CONFIG
  });
});

// Start the auto-scaler
function start() {
  log('info', 'Starting Conference Auto-scaler', CONFIG);
  
  // Start monitoring loop
  setInterval(monitorAndScale, CONFIG.CHECK_INTERVAL);
  
  // Start HTTP server
  app.listen(CONFIG.PORT, () => {
    log('info', `Auto-scaler API listening on port ${CONFIG.PORT}`);
  });
  
  // Initial monitoring cycle
  setTimeout(monitorAndScale, 5000);
}

// Graceful shutdown
process.on('SIGTERM', () => {
  log('info', 'Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  log('info', 'Received SIGINT, shutting down gracefully');
  process.exit(0);
});

// Start the service
start();
