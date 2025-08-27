#!/usr/bin/env node

/**
 * SIMPLE TEST RUNNER FOR COMPREHENSIVE PAYMENT SYSTEM
 * Executes end-to-end tests for both PayPal and Razorpay payment processing
 */

console.log('🚀 PAYMENT SYSTEM TEST RUNNER');
console.log('=' .repeat(50));

// Import and run the comprehensive tests
import('./comprehensive-payment-test.js')
  .then(async (testModule) => {
    console.log('📦 Test module loaded successfully');
    
    // Run the comprehensive test suite
    const results = await testModule.runComprehensiveTests();
    
    // Display final summary
    console.log('\n🎯 FINAL TEST SUMMARY');
    console.log('=' .repeat(50));
    console.log(`Total Tests: ${results.summary.totalTests}`);
    console.log(`Passed: ${results.summary.passedTests}`);
    console.log(`Failed: ${results.summary.failedTests}`);
    console.log(`Duration: ${results.summary.totalDuration}ms`);
    
    const success = results.summary.failedTests === 0;
    console.log(`Result: ${success ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    // Save detailed results
    const fs = await import('fs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsFile = `payment-test-results-${timestamp}.json`;
    
    try {
      fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
      console.log(`📄 Detailed results saved to: ${resultsFile}`);
    } catch (saveError) {
      console.warn('⚠️ Could not save results file:', saveError.message);
    }
    
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test runner failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  });
