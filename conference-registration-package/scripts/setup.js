#!/usr/bin/env node

/**
 * Setup script for Conference Registration Package
 * This script helps with initial configuration and validation
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Conference Registration Package Setup\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📋 Creating .env.local from template...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env.local created from .env.example');
  } else {
    console.log('❌ .env.example not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env.local already exists');
}

// Generate secure secrets
console.log('\n🔐 Generating secure secrets...');

const jwtSecret = crypto.randomBytes(32).toString('hex');
const sessionSecret = crypto.randomBytes(32).toString('hex');

console.log('Generated JWT Secret:', jwtSecret);
console.log('Generated Session Secret:', sessionSecret);

// Read current .env.local
let envContent = fs.readFileSync(envPath, 'utf8');

// Update secrets if they contain placeholder values
if (envContent.includes('your-super-secret-jwt-key-here')) {
  envContent = envContent.replace('your-super-secret-jwt-key-here', jwtSecret);
  console.log('✅ Updated JWT_SECRET');
}

if (envContent.includes('your-session-secret-here')) {
  envContent = envContent.replace('your-session-secret-here', sessionSecret);
  console.log('✅ Updated SESSION_SECRET');
}

// Write updated content
fs.writeFileSync(envPath, envContent);

// Check for placeholder values
console.log('\n🔍 Checking configuration...');

const placeholders = [
  'YOUR_PAYPAL_CLIENT_ID_HERE',
  'YOUR_PAYPAL_CLIENT_SECRET_HERE',
  'YOUR_PAYPAL_WEBHOOK_ID_HERE',
  'your-domain.com',
  'contact@your-domain.com',
  'postgresql://localhost:5432/conference_db',
  'smtp.your-email-provider.com',
  'your-email@your-domain.com',
  'your-email-password'
];

const missingConfig = [];

placeholders.forEach(placeholder => {
  if (envContent.includes(placeholder)) {
    missingConfig.push(placeholder);
  }
});

if (missingConfig.length > 0) {
  console.log('\n⚠️  Configuration needed:');
  console.log('Please update the following placeholders in .env.local:');
  missingConfig.forEach(item => {
    console.log(`   - ${item}`);
  });
} else {
  console.log('✅ All placeholders have been replaced');
}

// Installation check
console.log('\n📦 Checking dependencies...');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const nodeModulesExists = fs.existsSync('node_modules');
  
  if (!nodeModulesExists) {
    console.log('⚠️  Dependencies not installed. Run: npm install');
  } else {
    console.log('✅ Dependencies installed');
  }
} catch (error) {
  console.log('❌ Error checking dependencies:', error.message);
}

// Next steps
console.log('\n📋 Next Steps:');
console.log('1. Update .env.local with your actual configuration values');
console.log('2. Set up your database and update DATABASE_URL');
console.log('3. Configure PayPal credentials (Client ID, Secret, Webhook ID)');
console.log('4. Set up email service (SMTP settings)');
console.log('5. Update conference details (name, date, location, pricing)');
console.log('6. Run: npm run dev (for development)');
console.log('7. Test the registration flow');
console.log('8. Deploy to your hosting platform');

console.log('\n📚 Documentation:');
console.log('- Setup Guide: docs/SETUP.md');
console.log('- Configuration: docs/CONFIGURATION.md');
console.log('- Deployment: docs/DEPLOYMENT.md');
console.log('- API Reference: docs/API.md');

console.log('\n🎉 Setup complete! Happy conferencing!');
