// Health check endpoint for Sanity Backend
// Provides detailed health status for load balancer and monitoring

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3333;
const HEALTH_PORT = process.env.HEALTH_PORT || 3334;

// Health check data
let healthStatus = {
    status: 'starting',
    timestamp: new Date().toISOString(),
    uptime: 0,
    memory: {},
    services: {
        sanity: 'unknown',
        filesystem: 'unknown'
    }
};

// Update health status
function updateHealthStatus() {
    const memUsage = process.memoryUsage();
    
    healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        memory: {
            rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
            heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
            heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
            external: Math.round(memUsage.external / 1024 / 1024) + 'MB'
        },
        services: {
            sanity: checkSanityStudio(),
            filesystem: checkFilesystem()
        }
    };
}

// Check if Sanity Studio files are accessible
function checkSanityStudio() {
    try {
        const distPath = path.join(__dirname, '../dist');
        const indexPath = path.join(distPath, 'index.html');
        
        if (fs.existsSync(indexPath)) {
            return 'healthy';
        } else {
            return 'missing_files';
        }
    } catch (error) {
        console.error('Sanity Studio check failed:', error);
        return 'error';
    }
}

// Check filesystem access
function checkFilesystem() {
    try {
        const testFile = path.join(__dirname, '../.health_check');
        fs.writeFileSync(testFile, Date.now().toString());
        fs.unlinkSync(testFile);
        return 'healthy';
    } catch (error) {
        console.error('Filesystem check failed:', error);
        return 'error';
    }
}

// Create health check server
const healthServer = http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/api/health') {
        updateHealthStatus();
        
        const isHealthy = healthStatus.services.sanity === 'healthy' && 
                         healthStatus.services.filesystem === 'healthy';
        
        const statusCode = isHealthy ? 200 : 503;
        
        res.writeHead(statusCode, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        
        res.end(JSON.stringify(healthStatus, null, 2));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start health check server
healthServer.listen(HEALTH_PORT, () => {
    console.log(`🏥 Sanity health check server running on port ${HEALTH_PORT}`);
});

// Update health status every 30 seconds
setInterval(updateHealthStatus, 30000);

// Initial health status update
updateHealthStatus();

// Export for use in main server
module.exports = {
    healthStatus,
    updateHealthStatus,
    healthServer
};
