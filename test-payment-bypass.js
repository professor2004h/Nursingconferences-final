/**
 * Test script to verify the payment bypass functionality
 * This script tests the registration form with test payment processing
 */

const testRegistrationData = {
  // Personal Details
  title: 'Dr',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@test.com',
  phoneNumber: '+1234567890',

  // Further Information
  country: 'United States',
  abstractCategory: 'Poster',
  fullPostalAddress: '123 Test Street, Test City, Test State, 12345',

  // Registration Selection
  selectedRegistration: 'Speaker/Poster (In-Person)',
  sponsorType: '',

  // Accommodation
  accommodationType: 'Hotel A - Single - 2',
  accommodationNights: '2',

  // Participants
  numberOfParticipants: 1,

  // Pricing (these will be calculated by the form)
  registrationFee: 299,
  accommodationFee: 150,
  totalPrice: 449,
  pricingPeriod: 'earlyBird',
};

async function testRegistrationSubmission() {
  try {
    console.log('🧪 Testing registration submission with test payment bypass...');
    
    // Test the registration API
    const registrationResponse = await fetch('http://localhost:3000/api/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRegistrationData),
    });

    const registrationResult = await registrationResponse.json();
    
    if (!registrationResult.success) {
      throw new Error(`Registration failed: ${registrationResult.error}`);
    }

    console.log('✅ Registration successful:', {
      registrationId: registrationResult.registrationId,
      totalPrice: registrationResult.data.totalPrice,
    });

    // Test the payment update API
    const testPaymentData = {
      registrationId: registrationResult.registrationId,
      paymentId: `TEST_PAY_${Date.now()}`,
      orderId: `TEST_ORDER_${Date.now()}`,
      amount: testRegistrationData.totalPrice,
      currency: 'USD',
      paymentMethod: 'test_payment',
      paymentStatus: 'completed',
      paymentDate: new Date().toISOString(),
      isTestPayment: true,
    };

    const paymentResponse = await fetch('http://localhost:3000/api/registration/update-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPaymentData),
    });

    const paymentResult = await paymentResponse.json();

    if (!paymentResult.success) {
      throw new Error(`Payment update failed: ${paymentResult.error}`);
    }

    console.log('✅ Test payment processing successful:', {
      registrationId: paymentResult.data.registrationId,
      paymentId: paymentResult.data.paymentId,
      amount: paymentResult.data.amount,
      isTestPayment: paymentResult.data.isTestPayment,
    });

    // Test the registration retrieval
    const retrievalResponse = await fetch(`http://localhost:3000/api/registration?registrationId=${registrationResult.registrationId}`);
    const retrievalResult = await retrievalResponse.json();

    if (retrievalResult.success) {
      console.log('✅ Registration retrieval successful:', {
        registrationId: retrievalResult.data.registrationId,
        paymentStatus: retrievalResult.data.paymentStatus,
        customerName: `${retrievalResult.data.personalDetails.firstName} ${retrievalResult.data.personalDetails.lastName}`,
      });
    }

    console.log('\n🎉 All tests passed! The test payment bypass system is working correctly.');
    console.log('\n📋 Test Summary:');
    console.log(`   Registration ID: ${registrationResult.registrationId}`);
    console.log(`   Payment ID: ${testPaymentData.paymentId}`);
    console.log(`   Order ID: ${testPaymentData.orderId}`);
    console.log(`   Amount: $${testPaymentData.amount} USD`);
    console.log(`   Status: ${testPaymentData.paymentStatus.toUpperCase()} (TEST)`);
    console.log(`   Success URL: http://localhost:3000/registration/success?registration_id=${registrationResult.registrationId}&payment_id=${testPaymentData.paymentId}&order_id=${testPaymentData.orderId}&test_mode=true`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testRegistrationSubmission();
