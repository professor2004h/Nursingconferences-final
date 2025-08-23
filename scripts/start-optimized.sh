#!/bin/sh

# Optimized startup script for Next.js Conference Registration System
# Designed for high-traffic scenarios with proper error handling

set -e

echo "🚀 Starting Conference Registration System - Instance: ${INSTANCE_ID:-unknown}"
echo "📊 Memory limit: ${NODE_OPTIONS}"
echo "🌐 Environment: ${NODE_ENV}"
echo "🔗 Redis URL: ${REDIS_URL:-not configured}"

# Function to check if Redis is available
check_redis() {
    if [ -n "$REDIS_URL" ]; then
        echo "🔍 Checking Redis connection..."
        # Simple Redis ping using nc (netcat) if available
        if command -v nc >/dev/null 2>&1; then
            if echo "PING" | nc -w 1 redis 6379 | grep -q "PONG"; then
                echo "✅ Redis connection successful"
                return 0
            else
                echo "⚠️  Redis connection failed, continuing without cache"
                return 1
            fi
        else
            echo "⚠️  Cannot check Redis (nc not available), continuing..."
            return 1
        fi
    else
        echo "ℹ️  Redis not configured"
        return 1
    fi
}

# Function to wait for dependencies
wait_for_dependencies() {
    echo "⏳ Waiting for dependencies..."
    
    # Check Redis if configured
    check_redis || true
    
    # Wait a moment for any other services
    sleep 2
    
    echo "✅ Dependencies check completed"
}

# Function to handle graceful shutdown
graceful_shutdown() {
    echo "🛑 Received shutdown signal, gracefully stopping..."
    
    # Kill the Node.js process if it's running
    if [ -n "$NODE_PID" ]; then
        kill -TERM "$NODE_PID" 2>/dev/null || true
        wait "$NODE_PID" 2>/dev/null || true
    fi
    
    echo "✅ Graceful shutdown completed"
    exit 0
}

# Set up signal handlers for graceful shutdown
trap graceful_shutdown TERM INT

# Wait for dependencies
wait_for_dependencies

# Set Node.js optimizations for production
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Memory and performance optimizations
if [ -z "$NODE_OPTIONS" ]; then
    export NODE_OPTIONS="--max-old-space-size=1024 --optimize-for-size"
fi

# UV thread pool size for better I/O performance
if [ -z "$UV_THREADPOOL_SIZE" ]; then
    export UV_THREADPOOL_SIZE=16
fi

echo "🎯 Starting Next.js server..."
echo "📍 Instance ID: ${INSTANCE_ID:-default}"
echo "🔧 Node options: $NODE_OPTIONS"
echo "🧵 UV thread pool size: $UV_THREADPOOL_SIZE"

# Start the Next.js server
node server.js &
NODE_PID=$!

echo "✅ Server started with PID: $NODE_PID"
echo "🌐 Server listening on port ${PORT:-3000}"

# Wait for the Node.js process
wait $NODE_PID
