/**
 * Create a test registration directly in Sanity to demonstrate the table format
 */

const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN || 'your-token',
  useCdn: false,
  apiVersion: '2023-05-03',
});

// Generate unique registration ID
function generateRegistrationId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `REG-${timestamp}-${randomStr}`.toUpperCase();
}

async function createTestRegistration() {
  try {
    console.log('🧪 Creating test registration with payment data...');

    const registrationId = generateRegistrationId();
    const paymentId = `TEST_PAY_${Date.now()}`;
    const orderId = `TEST_ORDER_${Date.now()}`;

    // Create test registration record
    const registrationRecord = {
      _type: 'conferenceRegistration',
      registrationId,
      registrationType: 'regular',
      personalDetails: {
        title: 'Dr',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'Dr John Doe',
        email: 'john.doe@test.com',
        phoneNumber: '+1234567890',
        country: 'United States',
        abstractCategory: 'Poster',
        fullPostalAddress: '123 Test Street, Test City, Test State, 12345',
      },
      selectedRegistration: 'Speaker/Poster (In-Person)',
      numberOfParticipants: 1,
      pricing: {
        registrationFee: 299,
        accommodationFee: 150,
        totalPrice: 449,
        currency: 'USD',
        pricingPeriod: 'earlyBird',
        formattedTotalPrice: '$449 USD',
      },
      paymentStatus: 'completed',
      paymentId: paymentId,
      razorpayOrderId: orderId,
      paymentMethod: 'test_payment',
      paymentDate: new Date().toISOString(),
      isTestPayment: true,
      registrationDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isActive: true,

      // Computed fields for table display
      fullName: 'Dr John Doe',
      formattedTotalPrice: '$449 USD',

      // Registration summary for better table display
      registrationSummary: {
        registrationType: 'Regular Registration',
        selectedOption: 'Speaker/Poster (In-Person)',
        participantCount: 1,
        hasAccommodation: true,
        registrationMonth: new Date().toISOString().substring(0, 7),
        paymentStatusDisplay: 'COMPLETED (TEST)',
      },
    };

    // Save registration to Sanity
    const registrationResult = await client.create(registrationRecord);
    console.log('✅ Test registration created:', registrationResult._id);

    // Create corresponding payment record
    const paymentRecord = {
      _type: 'paymentRecord',
      registrationId: registrationId,
      registrationRef: {
        _type: 'reference',
        _ref: registrationResult._id,
      },
      paymentId: paymentId,
      orderId: orderId,
      amount: 449,
      currency: 'USD',
      paymentMethod: 'test_payment',
      paymentStatus: 'completed',
      paymentDate: new Date().toISOString(),
      isTestPayment: true,
      
      // Customer information for table display
      customerName: 'Dr John Doe',
      customerEmail: 'john.doe@test.com',
      formattedAmount: '$449 USD',
      paymentStatusDisplay: 'COMPLETED (TEST)',
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save payment record to Sanity
    const paymentResult = await client.create(paymentRecord);
    console.log('✅ Test payment record created:', paymentResult._id);

    console.log('\n🎉 Test data created successfully!');
    console.log('\n📋 Test Registration Details:');
    console.log(`   Registration ID: ${registrationId}`);
    console.log(`   Customer: Dr John Doe`);
    console.log(`   Email: john.doe@test.com`);
    console.log(`   Registration Type: Speaker/Poster (In-Person)`);
    console.log(`   Total Amount: $449 USD`);
    console.log(`   Payment ID: ${paymentId}`);
    console.log(`   Order ID: ${orderId}`);
    console.log(`   Payment Status: COMPLETED (TEST)`);
    console.log(`   Payment Method: test_payment`);

    console.log('\n📊 Sanity Backend Access:');
    console.log('   1. Conference Registrations: Check the "Conference Registration" document type');
    console.log('   2. Payment Records: Check the "Payment Records" document type');
    console.log('   3. Both records are linked and display in table format');

    return {
      registrationId,
      registrationDocId: registrationResult._id,
      paymentDocId: paymentResult._id,
      paymentId,
      orderId,
    };

  } catch (error) {
    console.error('❌ Error creating test data:', error);
    throw error;
  }
}

// Create multiple test records for better table demonstration
async function createMultipleTestRecords() {
  try {
    console.log('🧪 Creating multiple test records for table demonstration...\n');

    const testUsers = [
      {
        title: 'Dr',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        registrationType: 'Speaker/Poster (In-Person)',
        amount: 449,
      },
      {
        title: 'Prof',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@test.com',
        registrationType: 'Listener (Virtual)',
        amount: 199,
      },
      {
        title: 'Ms',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@test.com',
        registrationType: 'Student (In-Person)',
        amount: 149,
      },
    ];

    const results = [];

    for (const user of testUsers) {
      const registrationId = generateRegistrationId();
      const paymentId = `TEST_PAY_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const orderId = `TEST_ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      // Create registration record
      const registrationRecord = {
        _type: 'conferenceRegistration',
        registrationId,
        registrationType: 'regular',
        personalDetails: {
          title: user.title,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.title} ${user.firstName} ${user.lastName}`,
          email: user.email,
          phoneNumber: `+123456789${Math.floor(Math.random() * 10)}`,
          country: 'United States',
          abstractCategory: 'Poster',
          fullPostalAddress: `${Math.floor(Math.random() * 999)} Test Street, Test City, Test State, ${Math.floor(Math.random() * 99999)}`,
        },
        selectedRegistration: user.registrationType,
        numberOfParticipants: 1,
        pricing: {
          registrationFee: user.amount,
          accommodationFee: 0,
          totalPrice: user.amount,
          currency: 'USD',
          pricingPeriod: 'earlyBird',
          formattedTotalPrice: `$${user.amount} USD`,
        },
        paymentStatus: 'completed',
        paymentId: paymentId,
        razorpayOrderId: orderId,
        paymentMethod: 'test_payment',
        paymentDate: new Date().toISOString(),
        isTestPayment: true,
        registrationDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        isActive: true,
        fullName: `${user.title} ${user.firstName} ${user.lastName}`,
        formattedTotalPrice: `$${user.amount} USD`,
        registrationSummary: {
          registrationType: 'Regular Registration',
          selectedOption: user.registrationType,
          participantCount: 1,
          hasAccommodation: false,
          registrationMonth: new Date().toISOString().substring(0, 7),
          paymentStatusDisplay: 'COMPLETED (TEST)',
        },
      };

      const registrationResult = await client.create(registrationRecord);

      // Create payment record
      const paymentRecord = {
        _type: 'paymentRecord',
        registrationId: registrationId,
        registrationRef: {
          _type: 'reference',
          _ref: registrationResult._id,
        },
        paymentId: paymentId,
        orderId: orderId,
        amount: user.amount,
        currency: 'USD',
        paymentMethod: 'test_payment',
        paymentStatus: 'completed',
        paymentDate: new Date().toISOString(),
        isTestPayment: true,
        customerName: `${user.title} ${user.firstName} ${user.lastName}`,
        customerEmail: user.email,
        formattedAmount: `$${user.amount} USD`,
        paymentStatusDisplay: 'COMPLETED (TEST)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const paymentResult = await client.create(paymentRecord);

      results.push({
        registrationId,
        customerName: `${user.title} ${user.firstName} ${user.lastName}`,
        email: user.email,
        registrationType: user.registrationType,
        amount: user.amount,
        paymentId,
        registrationDocId: registrationResult._id,
        paymentDocId: paymentResult._id,
      });

      console.log(`✅ Created: ${user.title} ${user.firstName} ${user.lastName} - $${user.amount} USD`);
      
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n🎉 All test records created successfully!');
    console.log('\n📊 Sanity Backend Table View:');
    console.log('┌─────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│                           CONFERENCE REGISTRATIONS                             │');
    console.log('├─────────────────┬─────────────────────┬─────────────────────┬─────────────────┤');
    console.log('│ Registration ID │ Customer Name       │ Registration Type   │ Payment Status  │');
    console.log('├─────────────────┼─────────────────────┼─────────────────────┼─────────────────┤');
    
    results.forEach(result => {
      console.log(`│ ${result.registrationId.padEnd(15)} │ ${result.customerName.padEnd(19)} │ ${result.registrationType.padEnd(19)} │ COMPLETED (TEST)│`);
    });
    
    console.log('└─────────────────┴─────────────────────┴─────────────────────┴─────────────────┘');

    console.log('\n┌─────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│                              PAYMENT RECORDS                                   │');
    console.log('├─────────────────┬─────────────────────┬─────────────────────┬─────────────────┤');
    console.log('│ Payment ID      │ Customer Name       │ Amount              │ Payment Method  │');
    console.log('├─────────────────┼─────────────────────┼─────────────────────┼─────────────────┤');
    
    results.forEach(result => {
      console.log(`│ ${result.paymentId.substring(0, 15).padEnd(15)} │ ${result.customerName.padEnd(19)} │ $${result.amount} USD${(' ').repeat(12 - result.amount.toString().length)} │ test_payment    │`);
    });
    
    console.log('└─────────────────┴─────────────────────┴─────────────────────┴─────────────────┘');

    return results;

  } catch (error) {
    console.error('❌ Error creating multiple test records:', error);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  createMultipleTestRecords()
    .then(() => {
      console.log('\n🎯 Next Steps:');
      console.log('1. Open Sanity Studio to view the data in table format');
      console.log('2. Navigate to "Conference Registration" document type');
      console.log('3. Navigate to "Payment Records" document type');
      console.log('4. Both will show organized table views with all test data');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to create test data:', error);
      process.exit(1);
    });
}
