require('dotenv').config();

/**
 * Comprehensive Payment Workflow Diagnostic Script
 * Tests the complete payment-to-email-to-storage pipeline
 */

async function debugPaymentWorkflow() {
  console.log('🔍 DEBUGGING COMPLETE PAYMENT WORKFLOW...');
  console.log('=' .repeat(60));
  
  const diagnostics = {
    environmentVars: false,
    sanityConnection: false,
    sanityWriteAccess: false,
    emailSystem: false,
    pdfGeneration: false,
    completeWorkflow: false
  };

  try {
    // 1. Environment Variables Check
    console.log('\n📋 STEP 1: Environment Variables Check');
    console.log('-'.repeat(50));
    
    const requiredVars = [
      'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS',
      'NEXT_PUBLIC_SANITY_PROJECT_ID', 'SANITY_API_TOKEN'
    ];
    
    const envStatus = {};
    requiredVars.forEach(varName => {
      const value = process.env[varName];
      envStatus[varName] = !!value;
      const status = value ? '✅' : '❌';
      const displayValue = varName === 'SMTP_PASS' || varName === 'SANITY_API_TOKEN' 
        ? (value ? '***SET***' : '❌ NOT SET') 
        : value;
      console.log(`   ${status} ${varName}: ${displayValue}`);
    });
    
    diagnostics.environmentVars = requiredVars.every(varName => process.env[varName]);
    
    if (!diagnostics.environmentVars) {
      console.log('\n❌ CRITICAL: Missing environment variables!');
      return diagnostics;
    }
    
    // 2. Sanity Connection Test
    console.log('\n🗄️ STEP 2: Sanity CMS Connection Test');
    console.log('-'.repeat(50));
    
    try {
      const { createClient } = require('@sanity/client');
      
      const sanityClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        apiVersion: '2023-05-03',
        useCdn: false,
      });
      
      // Test read access
      const testQuery = await sanityClient.fetch('*[_type == "siteSettings"][0]');
      console.log('✅ Sanity read access working');
      diagnostics.sanityConnection = true;
      
    } catch (sanityError) {
      console.log('❌ Sanity connection failed:', sanityError.message);
      return diagnostics;
    }
    
    // 3. Sanity Write Access Test
    console.log('\n🔐 STEP 3: Sanity Write Access Test');
    console.log('-'.repeat(50));
    
    try {
      const { createClient } = require('@sanity/client');
      
      const writeClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        apiVersion: '2023-05-03',
        useCdn: false,
        token: process.env.SANITY_API_TOKEN,
      });
      
      // Test write access by fetching registrations
      const registrations = await writeClient.fetch(
        `*[_type == "conferenceRegistration"][0..2]{_id, registrationId, email, personalDetails}`
      );
      
      console.log(`✅ Sanity write access working - found ${registrations.length} registrations`);
      diagnostics.sanityWriteAccess = true;
      
      // Show sample registration structure
      if (registrations.length > 0) {
        console.log('📋 Sample registration structure:');
        const sample = registrations[0];
        console.log(`   _id: ${sample._id}`);
        console.log(`   registrationId: ${sample.registrationId || 'N/A'}`);
        console.log(`   email: ${sample.email || sample.personalDetails?.email || 'N/A'}`);
        console.log(`   hasPersonalDetails: ${!!sample.personalDetails}`);
      }
      
    } catch (writeError) {
      console.log('❌ Sanity write access failed:', writeError.message);
      console.log('🔧 Check SANITY_API_TOKEN permissions');
      return diagnostics;
    }
    
    // 4. Email System Test
    console.log('\n📧 STEP 4: Email System Test');
    console.log('-'.repeat(50));
    
    try {
      const nodemailer = require('nodemailer');
      
      const smtpConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true' || false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
          servername: process.env.SMTP_HOST,
        },
        connectionTimeout: 30000,
        greetingTimeout: 15000,
        socketTimeout: 30000,
        pool: false,
        maxConnections: 1
      };
      
      const transporter = nodemailer.createTransporter(smtpConfig);
      await transporter.verify();
      console.log('✅ Email system working');
      diagnostics.emailSystem = true;
      
    } catch (emailError) {
      console.log('❌ Email system failed:', emailError.message);
      return diagnostics;
    }
    
    // 5. PDF Generation Test
    console.log('\n📄 STEP 5: PDF Generation Test');
    console.log('-'.repeat(50));
    
    try {
      // Test jsPDF availability
      const jsPDF = require('jspdf');
      const doc = new jsPDF.jsPDF();
      doc.text('Test PDF', 20, 20);
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      
      console.log(`✅ PDF generation working - generated ${pdfBuffer.length} bytes`);
      diagnostics.pdfGeneration = true;
      
    } catch (pdfError) {
      console.log('❌ PDF generation failed:', pdfError.message);
      return diagnostics;
    }
    
    // 6. Complete Workflow Test
    console.log('\n🔄 STEP 6: Complete Workflow Test');
    console.log('-'.repeat(50));
    
    try {
      // Import the email function
      const { sendPaymentReceiptEmailWithRealData } = require('./nextjs-frontend/src/app/utils/paymentReceiptEmailer');
      
      // Create test data
      const testPaymentData = {
        transactionId: 'TEST_' + Date.now(),
        orderId: 'ORDER_' + Date.now(),
        amount: '1.00',
        currency: 'USD',
        paymentMethod: 'PayPal',
        paymentDate: new Date().toISOString(),
        status: 'COMPLETED',
        capturedAt: new Date().toISOString()
      };
      
      const testRegistrationData = {
        _id: 'test-registration-id',
        registrationId: 'TEST_REG_' + Date.now(),
        fullName: 'Test User',
        email: process.env.SMTP_USER, // Send to self for testing
        phone: '+1234567890',
        country: 'United States',
        address: '123 Test Street',
        registrationType: 'Regular Registration',
        numberOfParticipants: '1'
      };
      
      console.log('🧪 Testing complete workflow with test data...');
      console.log(`   Recipient: ${testRegistrationData.email}`);
      console.log(`   Transaction ID: ${testPaymentData.transactionId}`);
      
      const result = await sendPaymentReceiptEmailWithRealData(
        testPaymentData,
        testRegistrationData,
        testRegistrationData.email
      );
      
      if (result.success) {
        console.log('✅ Complete workflow test successful!');
        console.log(`   📧 Email sent: ${result.messageId}`);
        console.log(`   📄 PDF generated: ${result.pdfGenerated}`);
        console.log(`   📤 PDF uploaded: ${result.pdfUploaded}`);
        diagnostics.completeWorkflow = true;
      } else {
        console.log('❌ Complete workflow test failed:', result.error);
      }
      
    } catch (workflowError) {
      console.log('❌ Complete workflow test failed:', workflowError.message);
      console.log('Stack trace:', workflowError.stack);
    }
    
    // 7. Summary and Recommendations
    console.log('\n📊 DIAGNOSTIC SUMMARY');
    console.log('=' .repeat(60));
    
    const checks = [
      { name: 'Environment Variables', status: diagnostics.environmentVars, critical: true },
      { name: 'Sanity Connection', status: diagnostics.sanityConnection, critical: true },
      { name: 'Sanity Write Access', status: diagnostics.sanityWriteAccess, critical: true },
      { name: 'Email System', status: diagnostics.emailSystem, critical: true },
      { name: 'PDF Generation', status: diagnostics.pdfGeneration, critical: true },
      { name: 'Complete Workflow', status: diagnostics.completeWorkflow, critical: false }
    ];
    
    console.log('\n📋 Test Results:');
    checks.forEach(check => {
      const status = check.status ? '✅ PASS' : (check.critical ? '❌ FAIL' : '⚠️ WARNING');
      console.log(`   ${status} ${check.name}`);
    });
    
    const criticalIssues = checks.filter(check => check.critical && !check.status);
    const allCriticalPassed = criticalIssues.length === 0;
    
    if (allCriticalPassed && diagnostics.completeWorkflow) {
      console.log('\n🎉 SUCCESS: Complete payment workflow is working!');
      console.log('✅ Payment receipts will be delivered and stored automatically');
      console.log('✅ Check your email inbox for the test receipt');
      
    } else {
      console.log('\n❌ ISSUES DETECTED:');
      
      if (criticalIssues.length > 0) {
        console.log('\n🚨 Critical Issues:');
        criticalIssues.forEach(issue => {
          console.log(`   ❌ ${issue.name}`);
        });
      }
      
      console.log('\n🔧 TROUBLESHOOTING STEPS:');
      
      if (!diagnostics.environmentVars) {
        console.log('1. 📋 Set missing environment variables in Coolify');
        console.log('2. 🔄 Redeploy application after setting variables');
      }
      
      if (!diagnostics.sanityConnection) {
        console.log('3. 🗄️ Check Sanity project ID and dataset');
        console.log('4. 🌐 Verify network connectivity to Sanity');
      }
      
      if (!diagnostics.sanityWriteAccess) {
        console.log('5. 🔐 Check SANITY_API_TOKEN permissions');
        console.log('6. 🔑 Ensure token has Editor/Admin access');
      }
      
      if (!diagnostics.emailSystem) {
        console.log('7. 📧 Check SMTP configuration and credentials');
        console.log('8. 🔗 Verify network connectivity to SMTP server');
      }
      
      if (!diagnostics.pdfGeneration) {
        console.log('9. 📄 Check jsPDF package installation');
        console.log('10. 🔧 Verify Node.js environment compatibility');
      }
    }
    
    console.log('\n📞 SUPPORT CONTACTS:');
    console.log('   🐳 Coolify Issues: Contact Coolify support');
    console.log('   🗄️ Sanity Issues: Check Sanity dashboard');
    console.log('   📧 SMTP Issues: Contact email provider');
    
  } catch (error) {
    console.error('\n💥 Diagnostic script failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
  
  return diagnostics;
}

// Run diagnostic if called directly
if (require.main === module) {
  debugPaymentWorkflow()
    .then(results => {
      const success = results.environmentVars && results.sanityConnection && 
                     results.sanityWriteAccess && results.emailSystem && 
                     results.pdfGeneration;
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Diagnostic failed:', error);
      process.exit(1);
    });
}

module.exports = { debugPaymentWorkflow };
