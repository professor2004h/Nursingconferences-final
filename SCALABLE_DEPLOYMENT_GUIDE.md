# Scalable Conference Registration System - Deployment Guide

## 🎯 Overview

This guide provides complete instructions for deploying a scalable, high-traffic conference registration system capable of handling 100,000+ visitors using a multi-container architecture with auto-scaling, load balancing, and monitoring.

## 🏗️ Architecture Overview

### Multi-Container Setup
- **3+ Frontend Instances**: Next.js applications with load balancing
- **1 Sanity Backend**: CMS for content management
- **1 NGINX Load Balancer**: Traffic distribution and caching
- **1 Redis Instance**: Session management and caching
- **1 Prometheus**: Metrics collection and monitoring
- **1 Auto-scaler**: Automatic horizontal scaling based on metrics

### Traffic Capacity
- **Target**: 100,000 visitors over 10 days
- **Peak Load**: ~417 visitors/hour average, up to 2,000+ during spikes
- **Scaling**: 3-10 frontend instances based on load
- **Response Time**: <2 seconds under normal load

## 🚀 Quick Start Deployment

### Prerequisites
- Coolify VPS with Docker support
- Minimum 4GB RAM, 2 vCPU (scales up automatically)
- Domain name configured
- SSL certificates (Let's Encrypt recommended)

### 1. Clone and Prepare Repository
```bash
git clone <your-repo-url>
cd conference-registration-system
```

### 2. Environment Configuration
Create `.env.production` file:
```env
# Application
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=your-api-token

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=production

# Redis
REDIS_URL=redis://redis:6379

# Auto-scaling
SCALE_UP_THRESHOLD=80
SCALE_DOWN_THRESHOLD=30
MIN_REPLICAS=3
MAX_REPLICAS=10
```

### 3. Deploy with Coolify
```bash
# Build and deploy the multi-container stack
docker-compose -f coolify.yaml up -d

# Verify deployment
docker-compose ps
```

## 📊 Monitoring and Scaling

### Health Checks
- **Frontend**: `http://your-domain.com/api/health`
- **Backend**: `http://your-domain.com/studio/api/health`
- **Load Balancer**: `http://your-domain.com/health`

### Metrics Dashboard
- **Prometheus**: `http://your-server:9090`
- **Auto-scaler**: `http://your-server:3001/metrics`

### Auto-scaling Triggers
- **Scale Up**: CPU > 80% OR Memory > 80% OR Response Time > 2s
- **Scale Down**: CPU < 30% AND Memory < 30% AND Response Time < 1s
- **Cooldown**: 5 minutes between scaling actions

## 🔧 Configuration Details

### NGINX Load Balancer
- **Algorithm**: Least connections
- **Health Checks**: Every 15 seconds
- **Failover**: Automatic with 3 retry attempts
- **Caching**: Static assets cached for 1 hour
- **Rate Limiting**: 30 requests/second per IP

### Redis Configuration
- **Memory Limit**: 256MB with LRU eviction
- **Persistence**: Snapshots every 60 seconds
- **Connection Pooling**: Up to 32 connections per app instance

### Container Resources
```yaml
Frontend Instances:
  Memory: 1.5GB limit, 512MB reserved
  CPU: 1.0 limit, 0.5 reserved

Sanity Backend:
  Memory: 1GB limit, 512MB reserved
  CPU: 0.5 limit, 0.25 reserved

NGINX:
  Memory: 256MB limit, 128MB reserved
  CPU: 0.5 limit, 0.25 reserved

Redis:
  Memory: 512MB limit, 256MB reserved
  CPU: 0.5 limit, 0.25 reserved
```

## 🛡️ Security Features

### Network Security
- Internal Docker network isolation
- CORS configuration for Sanity
- Rate limiting on all endpoints
- Security headers (HSTS, CSP, etc.)

### Container Security
- Non-root user execution
- Read-only file systems where possible
- Resource limits to prevent DoS
- Health checks for automatic recovery

## 📈 Performance Optimizations

### Frontend Optimizations
- **Next.js Standalone**: Minimal runtime footprint
- **Image Optimization**: WebP/AVIF support
- **Static Asset Caching**: 1-year cache headers
- **API Response Caching**: 5-minute cache with stale-while-revalidate

### Database Optimizations
- **Sanity CDN**: Enabled for faster content delivery
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Cached frequently accessed data

### Caching Strategy
- **L1 Cache**: In-memory application cache
- **L2 Cache**: Redis distributed cache
- **L3 Cache**: NGINX proxy cache
- **CDN**: Sanity CDN for images and assets

## 🚨 Troubleshooting

### Common Issues

#### High Memory Usage
```bash
# Check container memory usage
docker stats

# Scale up if needed
docker-compose up -d --scale app=5
```

#### Slow Response Times
```bash
# Check NGINX logs
docker logs conference_nginx

# Check application logs
docker logs conference_app_1
```

#### Database Connection Issues
```bash
# Test Sanity connection
curl http://localhost:3000/api/health

# Check Sanity backend
docker logs conference_sanity
```

### Performance Monitoring
```bash
# View real-time metrics
curl http://localhost:3001/metrics

# Check Prometheus targets
curl http://localhost:9090/api/v1/targets
```

## 🔄 Scaling Operations

### Manual Scaling
```bash
# Scale up to 5 instances
docker-compose up -d --scale app-1=2 --scale app-2=2 --scale app-3=1

# Scale down to 3 instances
docker-compose up -d --scale app-1=1 --scale app-2=1 --scale app-3=1
```

### Automatic Scaling
The auto-scaler monitors metrics every 30 seconds and makes scaling decisions based on:
- CPU usage across all instances
- Memory usage across all instances
- Request rate and response times
- Error rates

## 📋 Maintenance

### Regular Tasks
- **Daily**: Check health endpoints and error logs
- **Weekly**: Review performance metrics and scaling events
- **Monthly**: Update dependencies and security patches

### Backup Strategy
- **Sanity Data**: Automatic backups via Sanity Cloud
- **Configuration**: Version controlled in Git
- **Logs**: Retained for 7 days in containers

### Updates and Rollbacks
```bash
# Update to new version
git pull origin main
docker-compose build
docker-compose up -d

# Rollback if needed
git checkout previous-tag
docker-compose build
docker-compose up -d
```

## 📞 Support and Monitoring

### Alerts and Notifications
Configure alerts for:
- High error rates (>5%)
- Slow response times (>3 seconds)
- Memory usage (>90%)
- Failed health checks

### Log Aggregation
All container logs are available via:
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app-1
docker-compose logs -f nginx
```

## 🎯 Success Metrics

### Performance Targets
- **Response Time**: <2 seconds (95th percentile)
- **Availability**: >99.9% uptime
- **Error Rate**: <1% of requests
- **Concurrent Users**: 500+ simultaneous users

### Scaling Verification
- **Load Test**: Use tools like Apache Bench or Artillery
- **Stress Test**: Gradually increase load to verify auto-scaling
- **Failover Test**: Stop containers to verify automatic recovery

---

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NGINX Load Balancing Guide](https://nginx.org/en/docs/http/load_balancing.html)
- [Prometheus Monitoring](https://prometheus.io/docs/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Sanity Optimization](https://www.sanity.io/docs/optimizing-performance)

For technical support or questions about this deployment, please refer to the project documentation or contact the development team.
