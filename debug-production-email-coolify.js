require('dotenv').config();
const nodemailer = require('nodemailer');
const dns = require('dns').promises;
const net = require('net');

/**
 * Comprehensive Coolify Production Email Debugging Script
 * This script diagnoses SMTP issues specific to Coolify deployment environments
 */

async function debugCoolifyEmailSystem() {
  console.log('🔍 DEBUGGING COOLIFY PRODUCTION EMAIL SYSTEM...');
  console.log('=' .repeat(70));
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'undefined'}`);
  console.log(`📍 Platform: ${process.platform}`);
  console.log(`🔧 Node Version: ${process.version}`);
  
  const diagnostics = {
    environmentVars: false,
    dnsResolution: false,
    networkConnectivity: false,
    smtpConnection: false,
    emailDelivery: false,
    coolifySpecific: false
  };

  try {
    // 1. Environment Variables Verification
    console.log('\n📋 STEP 1: Environment Variables Check');
    console.log('-'.repeat(50));
    
    const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    const envStatus = {};
    
    requiredVars.forEach(varName => {
      const value = process.env[varName];
      envStatus[varName] = {
        set: !!value,
        value: varName === 'SMTP_PASS' ? (value ? '***SET***' : '❌ NOT SET') : value
      };
      
      const status = value ? '✅' : '❌';
      console.log(`   ${status} ${varName}: ${envStatus[varName].value}`);
    });
    
    const allVarsSet = requiredVars.every(varName => process.env[varName]);
    diagnostics.environmentVars = allVarsSet;
    
    if (!allVarsSet) {
      console.log('\n❌ CRITICAL: Missing environment variables in Coolify!');
      console.log('🔧 ACTION REQUIRED: Check Coolify application environment settings');
      return diagnostics;
    }
    
    // 2. DNS Resolution Test
    console.log('\n🌐 STEP 2: DNS Resolution Test');
    console.log('-'.repeat(50));
    
    try {
      const smtpHost = process.env.SMTP_HOST;
      console.log(`🔍 Resolving DNS for: ${smtpHost}`);
      
      const addresses = await dns.lookup(smtpHost, { all: true });
      console.log('✅ DNS Resolution successful:');
      addresses.forEach((addr, index) => {
        console.log(`   ${index + 1}. ${addr.address} (${addr.family})`);
      });
      diagnostics.dnsResolution = true;
      
    } catch (dnsError) {
      console.log('❌ DNS Resolution failed:', dnsError.message);
      console.log('🔧 This indicates network connectivity issues in Coolify');
      return diagnostics;
    }
    
    // 3. Network Connectivity Test
    console.log('\n🔗 STEP 3: Network Connectivity Test');
    console.log('-'.repeat(50));
    
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '465');
    
    // Test primary port
    const primaryConnTest = await testPortConnectivity(smtpHost, smtpPort);
    console.log(`📡 Testing ${smtpHost}:${smtpPort} - ${primaryConnTest.success ? '✅ OPEN' : '❌ BLOCKED'}`);
    
    if (!primaryConnTest.success) {
      console.log(`   Error: ${primaryConnTest.error}`);
      
      // Test alternative port
      console.log('🔄 Testing alternative port 587...');
      const altConnTest = await testPortConnectivity(smtpHost, 587);
      console.log(`📡 Testing ${smtpHost}:587 - ${altConnTest.success ? '✅ OPEN' : '❌ BLOCKED'}`);
      
      if (!altConnTest.success) {
        console.log('❌ CRITICAL: Both SMTP ports are blocked by Coolify firewall!');
        console.log('🔧 ACTION REQUIRED: Contact Coolify support to open SMTP ports');
        return diagnostics;
      } else {
        diagnostics.networkConnectivity = true;
        console.log('✅ Alternative port 587 is accessible');
      }
    } else {
      diagnostics.networkConnectivity = true;
      console.log('✅ Primary SMTP port is accessible');
    }
    
    // 4. SMTP Connection Test with Multiple Configurations
    console.log('\n📧 STEP 4: SMTP Connection Test');
    console.log('-'.repeat(50));
    
    const smtpConfigs = [
      {
        name: 'Primary Configuration (Port 465)',
        config: {
          host: process.env.SMTP_HOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
            ciphers: 'SSLv3'
          },
          connectionTimeout: 30000,
          greetingTimeout: 15000,
          socketTimeout: 30000,
          debug: true,
          logger: true
        }
      },
      {
        name: 'Alternative Configuration (Port 587)',
        config: {
          host: process.env.SMTP_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
            starttls: true
          },
          connectionTimeout: 30000,
          greetingTimeout: 15000,
          socketTimeout: 30000,
          debug: true,
          logger: true
        }
      },
      {
        name: 'Coolify-Optimized Configuration',
        config: {
          host: process.env.SMTP_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
            servername: process.env.SMTP_HOST,
            ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
          },
          connectionTimeout: 60000,
          greetingTimeout: 30000,
          socketTimeout: 60000,
          pool: false,
          maxConnections: 1,
          debug: false,
          logger: false
        }
      }
    ];
    
    let workingTransporter = null;
    let workingConfig = null;
    
    for (const { name, config } of smtpConfigs) {
      console.log(`\n🔍 Testing: ${name}`);
      
      try {
        const transporter = nodemailer.createTransporter(config);
        console.log('   🔗 Creating SMTP connection...');
        
        await transporter.verify();
        console.log('   ✅ SMTP verification successful!');
        
        workingTransporter = transporter;
        workingConfig = { name, config };
        diagnostics.smtpConnection = true;
        break;
        
      } catch (smtpError) {
        console.log(`   ❌ SMTP verification failed: ${smtpError.message}`);
        
        // Log specific error details for debugging
        if (smtpError.code) {
          console.log(`   📋 Error Code: ${smtpError.code}`);
        }
        if (smtpError.errno) {
          console.log(`   📋 Error Number: ${smtpError.errno}`);
        }
        if (smtpError.syscall) {
          console.log(`   📋 System Call: ${smtpError.syscall}`);
        }
      }
    }
    
    if (!workingTransporter) {
      console.log('\n❌ CRITICAL: All SMTP configurations failed!');
      console.log('🔧 This indicates authentication or server-side issues');
      return diagnostics;
    }
    
    console.log(`\n✅ Working Configuration: ${workingConfig.name}`);
    
    // 5. Email Delivery Test
    console.log('\n📬 STEP 5: Email Delivery Test');
    console.log('-'.repeat(50));
    
    try {
      const testEmail = {
        from: `"Intelli Global Conferences" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER, // Send to self for testing
        subject: `Coolify Production Email Test - ${new Date().toISOString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: white; padding: 20px; text-align: center;">
              <h1>🎉 Coolify Email System Working!</h1>
            </div>
            <div style="padding: 20px; background: #f8f9fa;">
              <h2>Production Email Delivery Successful</h2>
              <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
              <p><strong>Working Config:</strong> ${workingConfig.name}</p>
              <p><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</p>
              
              <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #2d5a2d; margin: 0 0 10px 0;">✅ Coolify Email Status: OPERATIONAL</h3>
                <p style="margin: 0; color: #2d5a2d;">
                  Your Coolify production email system is now working correctly!
                  Payment receipt emails will be delivered automatically.
                </p>
              </div>
            </div>
          </div>
        `,
        text: `Coolify Email System Working!\n\nTest Date: ${new Date().toLocaleString()}\nEnvironment: ${process.env.NODE_ENV}\nWorking Config: ${workingConfig.name}\n\n✅ Coolify Email Status: OPERATIONAL`
      };
      
      console.log('📧 Sending test email...');
      const result = await workingTransporter.sendMail(testEmail);
      
      console.log('✅ Test email sent successfully!');
      console.log(`   📧 Message ID: ${result.messageId}`);
      console.log(`   📧 Response: ${result.response}`);
      
      diagnostics.emailDelivery = true;
      
    } catch (emailError) {
      console.log('❌ Email delivery failed:', emailError.message);
      console.log('🔧 SMTP connection works but email sending failed');
    }
    
    // 6. Coolify-Specific Checks
    console.log('\n🐳 STEP 6: Coolify-Specific Environment Checks');
    console.log('-'.repeat(50));
    
    // Check for Coolify-specific environment indicators
    const coolifyIndicators = [
      'COOLIFY_APP_ID',
      'COOLIFY_BRANCH',
      'COOLIFY_COMMIT_SHA',
      'COOLIFY_DEPLOYMENT_UUID'
    ];
    
    const coolifyEnvFound = coolifyIndicators.some(indicator => process.env[indicator]);
    
    if (coolifyEnvFound) {
      console.log('✅ Running in Coolify environment detected');
      diagnostics.coolifySpecific = true;
      
      // Log Coolify-specific environment details
      coolifyIndicators.forEach(indicator => {
        if (process.env[indicator]) {
          console.log(`   📋 ${indicator}: ${process.env[indicator]}`);
        }
      });
    } else {
      console.log('⚠️ Coolify environment indicators not found');
      console.log('   This might indicate environment variable issues');
    }
    
    // Check container networking
    console.log('\n🔍 Container Network Analysis:');
    console.log(`   📋 Hostname: ${require('os').hostname()}`);
    console.log(`   📋 Platform: ${process.platform}`);
    console.log(`   📋 Architecture: ${process.arch}`);
    
    // 7. Final Recommendations
    console.log('\n🎯 DIAGNOSTIC SUMMARY & RECOMMENDATIONS');
    console.log('=' .repeat(70));
    
    const checks = [
      { name: 'Environment Variables', status: diagnostics.environmentVars, critical: true },
      { name: 'DNS Resolution', status: diagnostics.dnsResolution, critical: true },
      { name: 'Network Connectivity', status: diagnostics.networkConnectivity, critical: true },
      { name: 'SMTP Connection', status: diagnostics.smtpConnection, critical: true },
      { name: 'Email Delivery', status: diagnostics.emailDelivery, critical: false },
      { name: 'Coolify Environment', status: diagnostics.coolifySpecific, critical: false }
    ];
    
    console.log('\n📊 Diagnostic Results:');
    checks.forEach(check => {
      const status = check.status ? '✅ PASS' : (check.critical ? '❌ FAIL' : '⚠️ WARNING');
      console.log(`   ${status} ${check.name}`);
    });
    
    const criticalIssues = checks.filter(check => check.critical && !check.status);
    const allCriticalPassed = criticalIssues.length === 0;
    
    if (allCriticalPassed && diagnostics.emailDelivery) {
      console.log('\n🎉 SUCCESS: Email system is working in Coolify!');
      console.log('✅ Payment receipt emails should now be delivered automatically');
      
      if (workingConfig) {
        console.log(`\n🔧 RECOMMENDED CONFIGURATION FOR PRODUCTION:`);
        console.log(`   Use: ${workingConfig.name}`);
        console.log(`   Host: ${workingConfig.config.host}`);
        console.log(`   Port: ${workingConfig.config.port}`);
        console.log(`   Secure: ${workingConfig.config.secure}`);
      }
      
    } else {
      console.log('\n❌ ISSUES DETECTED - Action Required:');
      
      if (criticalIssues.length > 0) {
        console.log('\n🚨 Critical Issues:');
        criticalIssues.forEach(issue => {
          console.log(`   ❌ ${issue.name}`);
        });
      }
      
      console.log('\n🔧 TROUBLESHOOTING STEPS:');
      
      if (!diagnostics.environmentVars) {
        console.log('1. 📋 Check Coolify environment variables:');
        console.log('   - Go to Coolify app settings');
        console.log('   - Verify all SMTP_* variables are set');
        console.log('   - Redeploy after adding missing variables');
      }
      
      if (!diagnostics.dnsResolution) {
        console.log('2. 🌐 DNS Resolution Issues:');
        console.log('   - Check Coolify server internet connectivity');
        console.log('   - Verify DNS servers are configured');
        console.log('   - Contact Coolify support if needed');
      }
      
      if (!diagnostics.networkConnectivity) {
        console.log('3. 🔗 Network Connectivity Issues:');
        console.log('   - SMTP ports (465, 587) may be blocked');
        console.log('   - Contact Coolify support to open SMTP ports');
        console.log('   - Consider using alternative SMTP provider');
      }
      
      if (!diagnostics.smtpConnection) {
        console.log('4. 📧 SMTP Authentication Issues:');
        console.log('   - Verify SMTP credentials are correct');
        console.log('   - Check if email provider requires app passwords');
        console.log('   - Try alternative SMTP configuration');
      }
    }
    
    console.log('\n📞 SUPPORT CONTACTS:');
    console.log('   🐳 Coolify Issues: Contact Coolify support');
    console.log('   📧 SMTP Issues: Contact Hostinger support');
    console.log('   🔧 Application Issues: Check application logs');
    
  } catch (error) {
    console.error('\n💥 Diagnostic script failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
  
  return diagnostics;
}

// Helper function to test port connectivity
function testPortConnectivity(host, port, timeout = 5000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    const onError = (error) => {
      socket.destroy();
      resolve({ success: false, error: error.message });
    };
    
    const onTimeout = () => {
      socket.destroy();
      resolve({ success: false, error: 'Connection timeout' });
    };
    
    const onConnect = () => {
      socket.destroy();
      resolve({ success: true });
    };
    
    socket.setTimeout(timeout);
    socket.once('error', onError);
    socket.once('timeout', onTimeout);
    socket.once('connect', onConnect);
    
    socket.connect(port, host);
  });
}

// Run diagnostic if called directly
if (require.main === module) {
  debugCoolifyEmailSystem()
    .then(results => {
      const success = results.environmentVars && results.dnsResolution && 
                     results.networkConnectivity && results.smtpConnection;
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Diagnostic failed:', error);
      process.exit(1);
    });
}

module.exports = { debugCoolifyEmailSystem };
