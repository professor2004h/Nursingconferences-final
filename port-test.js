const http = require('http');

console.log('Testing Next.js server ports...');

function testPort(port) {
  return new Promise((resolve) => {
    console.log(`Testing port ${port}...`);
    const req = http.get(`http://localhost:${port}`, { timeout: 3000 }, (res) => {
      console.log(`✅ Port ${port}: Status ${res.statusCode}`);
      resolve(res.statusCode);
    });
    
    req.on('error', (err) => {
      console.log(`❌ Port ${port}: ${err.message}`);
      resolve(null);
    });
    
    req.on('timeout', () => {
      console.log(`⏰ Port ${port}: Timeout`);
      req.destroy();
      resolve(null);
    });
  });
}

async function testPorts() {
  const ports = [3000, 3001, 3002];
  
  for (const port of ports) {
    await testPort(port);
  }
  
  console.log('\nDone testing ports.');
}

testPorts();
