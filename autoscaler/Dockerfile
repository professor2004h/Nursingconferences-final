# Auto-scaler for Conference Registration System
# Monitors metrics and scales containers based on load

FROM node:20-alpine

# Install required packages
RUN apk add --no-cache \
    curl \
    docker-cli \
    && rm -rf /var/cache/apk/*

# Create app user
RUN addgroup --system --gid 1001 scaler && \
    adduser --system --uid 1001 scaler

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy application code
COPY . .

# Change ownership
RUN chown -R scaler:scaler /app

# Switch to non-root user
USER scaler

# Health check
HEALTHCHECK --interval=60s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the auto-scaler
CMD ["node", "index.js"]
