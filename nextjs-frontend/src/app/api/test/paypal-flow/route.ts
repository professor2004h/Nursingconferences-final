import { NextRequest, NextResponse } from 'next/server';

/**
 * Test PayPal Registration Flow
 * This endpoint tests the complete flow from registration to PayPal order creation
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing PayPal registration flow...');

    const body = await request.json();
    const { testType = 'full' } = body;

    const results = {
      testType,
      timestamp: new Date().toISOString(),
      steps: [] as any[],
      success: true,
      errors: [] as string[]
    };

    // Step 1: Test registration creation
    try {
      console.log('📝 Step 1: Creating test registration...');
      const registrationResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalDetails: {
            title: 'Dr',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phoneNumber: '+1234567890',
            country: 'United States',
            fullPostalAddress: '123 Test Street, Test City, Test State, 12345'
          },
          selectedRegistration: 'Speaker/Poster (In-Person)',
          numberOfParticipants: 1,
          totalPrice: 299,
          currency: 'USD'
        }),
      });

      const registrationData = await registrationResponse.json();
      
      results.steps.push({
        step: 1,
        name: 'Registration Creation',
        success: registrationResponse.ok,
        data: registrationData,
        registrationId: registrationData.registrationId
      });

      if (!registrationResponse.ok) {
        results.errors.push(`Registration creation failed: ${registrationData.error}`);
        results.success = false;
      }

      // Step 2: Test PayPal order creation (if registration was successful)
      if (registrationResponse.ok && registrationData.registrationId) {
        console.log('💳 Step 2: Creating PayPal order...');
        const paypalResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/paypal/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: '299.00',
            currency: 'USD',
            registrationId: registrationData.registrationId,
            registrationData: {
              personalDetails: {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com'
              }
            }
          }),
        });

        const paypalData = await paypalResponse.json();
        
        results.steps.push({
          step: 2,
          name: 'PayPal Order Creation',
          success: paypalResponse.ok,
          data: paypalData,
          paypalOrderId: paypalData.orderId,
          updatedRegistrationId: paypalData.registrationId
        });

        if (!paypalResponse.ok) {
          results.errors.push(`PayPal order creation failed: ${paypalData.error}`);
          results.success = false;
        }

        // Step 3: Verify registration ID update
        if (paypalResponse.ok && paypalData.registrationId !== registrationData.registrationId) {
          console.log('🔄 Step 3: Verifying registration ID update...');
          results.steps.push({
            step: 3,
            name: 'Registration ID Update',
            success: true,
            data: {
              originalId: registrationData.registrationId,
              updatedId: paypalData.registrationId,
              paypalOrderId: paypalData.orderId,
              message: 'Registration ID successfully updated to PayPal order ID'
            }
          });
        } else if (paypalResponse.ok) {
          results.steps.push({
            step: 3,
            name: 'Registration ID Update',
            success: false,
            data: {
              message: 'Registration ID was not updated with PayPal order ID',
              originalId: registrationData.registrationId,
              paypalOrderId: paypalData.orderId
            }
          });
          results.errors.push('Registration ID was not updated with PayPal order ID');
          results.success = false;
        }
      }

    } catch (error) {
      console.error('❌ Test flow error:', error);
      results.errors.push(error instanceof Error ? error.message : 'Unknown error');
      results.success = false;
    }

    // Summary
    const summary = {
      totalSteps: results.steps.length,
      successfulSteps: results.steps.filter(step => step.success).length,
      failedSteps: results.steps.filter(step => !step.success).length,
      overallSuccess: results.success,
      registrationIdFlow: results.steps.length >= 3 ? 
        `${results.steps[0]?.registrationId} → ${results.steps[2]?.data?.updatedId}` : 
        'Incomplete flow'
    };

    return NextResponse.json({
      ...results,
      summary
    });

  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Test endpoint failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
