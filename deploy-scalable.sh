#!/bin/bash

# Scalable Conference Registration System Deployment Script
# Deploys multi-container architecture with auto-scaling and monitoring

set -e

echo "🚀 Deploying Scalable Conference Registration System"
echo "=================================================="

# Configuration
ENVIRONMENT=${ENVIRONMENT:-production}
DOMAIN=${DOMAIN:-localhost}
MIN_REPLICAS=${MIN_REPLICAS:-3}
MAX_REPLICAS=${MAX_REPLICAS:-10}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running. Please start Docker first."
    fi
    
    log "✅ Prerequisites check passed"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    
    mkdir -p nginx/conf.d
    mkdir -p ssl
    mkdir -p monitoring
    mkdir -p autoscaler
    mkdir -p scripts
    mkdir -p testing
    mkdir -p logs
    
    log "✅ Directories created"
}

# Generate environment file
generate_env_file() {
    log "Generating environment configuration..."
    
    if [ ! -f .env.production ]; then
        cat > .env.production << EOF
# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://${DOMAIN}

# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=${SANITY_PROJECT_ID:-n3no08m3}
NEXT_PUBLIC_SANITY_DATASET=${SANITY_DATASET:-production}
NEXT_PUBLIC_SANITY_API_VERSION=${SANITY_API_VERSION:-2023-05-03}
SANITY_API_TOKEN=${SANITY_API_TOKEN}

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
PAYPAL_CLIENT_SECRET=${PAYPAL_CLIENT_SECRET}
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=production
NEXT_PUBLIC_PAYPAL_CURRENCY=USD

# Redis Configuration
REDIS_URL=redis://redis:6379

# Auto-scaling Configuration
SCALE_UP_THRESHOLD=${SCALE_UP_THRESHOLD:-80}
SCALE_DOWN_THRESHOLD=${SCALE_DOWN_THRESHOLD:-30}
MIN_REPLICAS=${MIN_REPLICAS}
MAX_REPLICAS=${MAX_REPLICAS}
CHECK_INTERVAL=30000
SCALE_COOLDOWN=300000

# Monitoring Configuration
PROMETHEUS_URL=http://prometheus:9090
EOF
        log "✅ Environment file created (.env.production)"
    else
        log "✅ Environment file already exists"
    fi
}

# Build Docker images
build_images() {
    log "Building Docker images..."
    
    # Build optimized frontend image
    log "Building frontend image..."
    docker build -f Dockerfile.optimized -t conference_app:latest .
    
    # Build Sanity backend image
    log "Building Sanity backend image..."
    docker build -f SanityBackend/Dockerfile.sanity -t conference_sanity:latest ./SanityBackend
    
    # Build auto-scaler image
    log "Building auto-scaler image..."
    docker build -f autoscaler/Dockerfile -t conference_autoscaler:latest ./autoscaler
    
    log "✅ Docker images built successfully"
}

# Deploy services
deploy_services() {
    log "Deploying services..."
    
    # Stop existing services
    log "Stopping existing services..."
    docker-compose -f coolify.yaml down --remove-orphans || true
    
    # Start services
    log "Starting services..."
    docker-compose -f coolify.yaml up -d
    
    log "✅ Services deployed"
}

# Wait for services to be healthy
wait_for_health() {
    log "Waiting for services to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log "Health check attempt $attempt/$max_attempts"
        
        # Check frontend health
        if curl -f http://localhost/api/health &> /dev/null; then
            log "✅ Frontend is healthy"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            error "Services failed to become healthy within timeout"
        fi
        
        sleep 10
        ((attempt++))
    done
    
    log "✅ All services are healthy"
}

# Run load test
run_load_test() {
    if [ "$RUN_LOAD_TEST" = "true" ]; then
        log "Running load test..."
        
        # Install Node.js dependencies for load test
        if [ ! -d "testing/node_modules" ]; then
            cd testing
            npm init -y &> /dev/null
            npm install --silent &> /dev/null
            cd ..
        fi
        
        # Run load test with reduced load for initial verification
        TEST_URL=http://localhost \
        MAX_USERS=50 \
        TEST_DURATION=60 \
        RAMP_UP_TIME=30 \
        node testing/load-test.js
        
        log "✅ Load test completed"
    else
        log "Skipping load test (set RUN_LOAD_TEST=true to enable)"
    fi
}

# Display deployment summary
show_summary() {
    log "Deployment Summary"
    echo "=================="
    echo ""
    echo "🌐 Application URL: http://${DOMAIN}"
    echo "🏥 Health Check: http://${DOMAIN}/api/health"
    echo "📊 Metrics: http://${DOMAIN}:3001/metrics"
    echo "📈 Prometheus: http://${DOMAIN}:9090"
    echo ""
    echo "🔧 Configuration:"
    echo "   Environment: ${ENVIRONMENT}"
    echo "   Min Replicas: ${MIN_REPLICAS}"
    echo "   Max Replicas: ${MAX_REPLICAS}"
    echo "   Domain: ${DOMAIN}"
    echo ""
    echo "📋 Management Commands:"
    echo "   View logs: docker-compose -f coolify.yaml logs -f"
    echo "   Scale up: docker-compose -f coolify.yaml up -d --scale app-1=2"
    echo "   Stop all: docker-compose -f coolify.yaml down"
    echo "   Restart: docker-compose -f coolify.yaml restart"
    echo ""
    echo "🚨 Monitoring:"
    echo "   Check container status: docker-compose -f coolify.yaml ps"
    echo "   View resource usage: docker stats"
    echo "   Monitor auto-scaling: curl http://localhost:3001/metrics"
    echo ""
    echo "✅ Deployment completed successfully!"
    echo ""
    echo "📚 For detailed documentation, see SCALABLE_DEPLOYMENT_GUIDE.md"
}

# Cleanup function
cleanup() {
    if [ "$?" -ne 0 ]; then
        error "Deployment failed. Cleaning up..."
        docker-compose -f coolify.yaml down --remove-orphans || true
    fi
}

# Set trap for cleanup
trap cleanup EXIT

# Main deployment flow
main() {
    log "Starting deployment process..."
    
    check_prerequisites
    create_directories
    generate_env_file
    build_images
    deploy_services
    wait_for_health
    run_load_test
    show_summary
    
    log "🎉 Scalable Conference Registration System deployed successfully!"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --min-replicas)
            MIN_REPLICAS="$2"
            shift 2
            ;;
        --max-replicas)
            MAX_REPLICAS="$2"
            shift 2
            ;;
        --load-test)
            RUN_LOAD_TEST="true"
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --domain DOMAIN          Set the domain name (default: localhost)"
            echo "  --min-replicas N         Set minimum replicas (default: 3)"
            echo "  --max-replicas N         Set maximum replicas (default: 10)"
            echo "  --load-test              Run load test after deployment"
            echo "  --help                   Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  SANITY_PROJECT_ID        Sanity project ID"
            echo "  SANITY_API_TOKEN         Sanity API token"
            echo "  PAYPAL_CLIENT_ID         PayPal client ID"
            echo "  PAYPAL_CLIENT_SECRET     PayPal client secret"
            echo ""
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Run main function
main
