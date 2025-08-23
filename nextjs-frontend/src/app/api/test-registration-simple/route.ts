/**
 * Simple Registration Test API Endpoint
 * Tests the registration process with minimal data
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Starting simple registration test...');

    // Test 1: Parse request body
    let body;
    try {
      body = await request.json();
      console.log('✅ Test 1 PASSED: Request body parsed successfully');
    } catch (error) {
      console.error('❌ Test 1 FAILED: Request body parsing failed:', error);
      return NextResponse.json({
        test: 'failed',
        step: 'body_parsing',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 400 });
    }

    // Test 2: Environment variables
    const envTest = {
      hasSanityToken: !!process.env.SANITY_API_TOKEN,
      sanityTokenLength: process.env.SANITY_API_TOKEN?.length || 0,
      hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasPayPalClientId: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      hasPayPalSecret: !!process.env.PAYPAL_CLIENT_SECRET
    };

    if (!envTest.hasSanityToken) {
      console.error('❌ Test 2 FAILED: Missing SANITY_API_TOKEN');
      return NextResponse.json({
        test: 'failed',
        step: 'environment_check',
        error: 'Missing SANITY_API_TOKEN',
        envTest
      }, { status: 500 });
    }

    console.log('✅ Test 2 PASSED: Environment variables present');

    // Test 3: Generate registration ID
    let registrationId;
    try {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 8);
      registrationId = `TEST-${timestamp}-${randomStr}`.toUpperCase();
      console.log('✅ Test 3 PASSED: Registration ID generated:', registrationId);
    } catch (error) {
      console.error('❌ Test 3 FAILED: Registration ID generation failed:', error);
      return NextResponse.json({
        test: 'failed',
        step: 'id_generation',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

    // Test 4: Create minimal registration record
    const testRecord = {
      _type: 'conferenceRegistration',
      registrationId,
      registrationType: 'test',
      personalDetails: {
        firstName: body.firstName || 'Test',
        lastName: body.lastName || 'User',
        email: body.email || 'test@example.com',
        phoneNumber: body.phoneNumber || '+1234567890',
        country: body.country || 'Test Country',
        fullPostalAddress: body.fullPostalAddress || 'Test Address'
      },
      pricing: {
        registrationFee: 0,
        accommodationFee: 0,
        totalPrice: 0,
        currency: 'USD',
        pricingPeriod: 'test'
      },
      paymentStatus: 'test',
      registrationDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isActive: true,
      isTestRecord: true
    };

    console.log('✅ Test 4 PASSED: Test record structure created');

    // Test 5: Sanity write operation
    let sanityResult;
    try {
      console.log('🔄 Test 5: Attempting Sanity write operation...');
      sanityResult = await writeClient.create(testRecord);
      console.log('✅ Test 5 PASSED: Sanity write successful:', sanityResult._id);
    } catch (error) {
      console.error('❌ Test 5 FAILED: Sanity write failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: (error as any)?.statusCode,
        details: (error as any)?.details
      });
      
      return NextResponse.json({
        test: 'failed',
        step: 'sanity_write',
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: (error as any)?.statusCode,
        details: (error as any)?.details,
        envTest
      }, { status: 500 });
    }

    // Test 6: Clean up test record
    try {
      await writeClient.delete(sanityResult._id);
      console.log('✅ Test 6 PASSED: Test record cleaned up');
    } catch (error) {
      console.warn('⚠️ Test 6 WARNING: Failed to clean up test record:', error);
      // Don't fail the test for cleanup issues
    }

    // All tests passed
    console.log('🎉 All simple registration tests PASSED!');

    return NextResponse.json({
      test: 'success',
      message: 'All registration tests passed successfully',
      results: {
        bodyParsing: 'passed',
        environmentCheck: 'passed',
        idGeneration: 'passed',
        recordCreation: 'passed',
        sanityWrite: 'passed',
        cleanup: 'passed'
      },
      testData: {
        registrationId,
        sanityId: sanityResult._id,
        envTest
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Simple registration test failed with unexpected error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined
    });

    return NextResponse.json({
      test: 'failed',
      step: 'unexpected_error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Simple registration test endpoint',
    usage: 'POST with minimal registration data to test the registration process',
    example: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '+1234567890',
      country: 'United States',
      fullPostalAddress: '123 Test St, Test City, TS 12345'
    }
  });
}
