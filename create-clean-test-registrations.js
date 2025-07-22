const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'your-project-id', // Replace with actual project ID
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN || 'your-token-here'
});

// Generate unique registration ID
function generateRegistrationId() {
  const now = new Date();
  const timestamp = now.getTime().toString(36);
  const microseconds = (performance.now() % 1000).toFixed(3).replace('.', '');
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `REG-${timestamp}${microseconds}-${randomStr}`.toUpperCase();
}

// Test registration data with proper sponsorship tiers
const testRegistrations = [
  {
    _type: 'conferenceRegistration',
    registrationId: generateRegistrationId(),
    registrationType: 'sponsorship',
    sponsorType: 'Gold', // This is the key field that was missing!
    personalDetails: {
      title: 'Dr',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phoneNumber: '+1234567890',
      country: 'United States',
      fullPostalAddress: '123 Main St, New York, NY 10001'
    },
    accommodationDetails: {
      accommodationType: 'YaUKtSRJPGGV5DwX1UOi6E-single-2',
      accommodationNights: '2'
    },
    numberOfParticipants: 1,
    pricing: {
      registrationFee: 99,
      accommodationFee: 360,
      totalPrice: 459,
      currency: 'USD',
      pricingPeriod: 'nextRound'
    },
    paymentStatus: 'completed',
    registrationDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    isActive: true
  },
  {
    _type: 'conferenceRegistration',
    registrationId: generateRegistrationId(),
    registrationType: 'sponsorship',
    sponsorType: 'Diamond', // Diamond tier
    personalDetails: {
      title: 'Prof',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@university.edu',
      phoneNumber: '+1987654321',
      country: 'Canada',
      fullPostalAddress: '456 University Ave, Toronto, ON M5S 1A1'
    },
    accommodationDetails: {
      accommodationType: 'YaUKtSRJPGGV5DwX1UOi6E-double-3',
      accommodationNights: '3'
    },
    numberOfParticipants: 1,
    pricing: {
      registrationFee: 199,
      accommodationFee: 540,
      totalPrice: 739,
      currency: 'USD',
      pricingPeriod: 'nextRound'
    },
    paymentStatus: 'completed',
    registrationDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    isActive: true
  },
  {
    _type: 'conferenceRegistration',
    registrationId: generateRegistrationId(),
    registrationType: 'sponsorship',
    sponsorType: 'Platinum', // Platinum tier
    personalDetails: {
      title: 'Dr',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@hospital.org',
      phoneNumber: '+44123456789',
      country: 'United Kingdom',
      fullPostalAddress: '789 Medical Center Dr, London SW1A 1AA'
    },
    accommodationDetails: {
      accommodationType: 'YaUKtSRJPGGV5DwX1UOiIZ-single-2',
      accommodationNights: '2'
    },
    numberOfParticipants: 1,
    pricing: {
      registrationFee: 299,
      accommodationFee: 242,
      totalPrice: 541,
      currency: 'USD',
      pricingPeriod: 'nextRound'
    },
    paymentStatus: 'completed',
    registrationDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    isActive: true
  },
  {
    _type: 'conferenceRegistration',
    registrationId: generateRegistrationId(),
    registrationType: 'regular',
    selectedRegistrationName: 'Student (In-Person)',
    personalDetails: {
      title: 'Ms',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@student.edu',
      phoneNumber: '+61234567890',
      country: 'Australia',
      fullPostalAddress: '321 Student St, Sydney NSW 2000'
    },
    accommodationDetails: {
      accommodationType: 'YaUKtSRJPGGV5DwX1UOiIZ-single-1',
      accommodationNights: '1'
    },
    numberOfParticipants: 1,
    pricing: {
      registrationFee: 150,
      accommodationFee: 121,
      totalPrice: 271,
      currency: 'USD',
      pricingPeriod: 'earlyBird'
    },
    paymentStatus: 'completed',
    registrationDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    isActive: true
  }
];

async function createTestRegistrations() {
  console.log('🚀 Creating test registrations with proper sponsorship data...');
  
  try {
    for (const registration of testRegistrations) {
      console.log(`Creating registration: ${registration.registrationId} (${registration.registrationType}${registration.sponsorType ? '-' + registration.sponsorType : ''})`);
      
      const result = await client.create(registration);
      console.log(`✅ Created: ${result._id}`);
    }
    
    console.log('🎉 All test registrations created successfully!');
    console.log('\nTest data includes:');
    console.log('- Sponsorship-Gold registration');
    console.log('- Sponsorship-Diamond registration');
    console.log('- Sponsorship-Platinum registration');
    console.log('- Regular Student registration');
    console.log('\nNow check the Sanity table view to see the proper sponsorship tiers displayed!');
    
  } catch (error) {
    console.error('❌ Error creating test registrations:', error);
    
    if (error.statusCode === 403) {
      console.log('\n🔧 To fix this, you need to:');
      console.log('1. Set your SANITY_API_TOKEN environment variable');
      console.log('2. Make sure the token has write permissions');
      console.log('3. Update the projectId in this script');
    }
  }
}

// Run the script
if (require.main === module) {
  createTestRegistrations();
}

module.exports = { createTestRegistrations };
