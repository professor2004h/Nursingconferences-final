const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'n3no08m3',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN, // You'll need to set this
  useCdn: false,
});

async function populateRegistrationData() {
  try {
    console.log('🚀 Populating registration system data...');

    // 1. Create Registration Settings
    const registrationSettings = await client.create({
      _type: 'registrationSettings',
      title: 'Conference Registration Settings',
      pricingDates: {
        earlyBirdEnd: '2025-02-28',
        nextRoundStart: '2025-03-01',
        nextRoundEnd: '2025-05-31',
        spotRegistrationStart: '2025-06-01',
      },
      registrationStatus: {
        isOpen: true,
        closedMessage: 'Registration is currently closed. Please check back later.',
      },
      conferenceDetails: {
        conferenceName: 'International Nursing Conference 2025',
        conferenceDate: '2025-07-15',
        venue: 'Grand Convention Center',
        city: 'New York',
        country: 'USA',
      },
      contactInfo: {
        email: 'intelliglobalconferences@gmail.com',
        phone: '+919876543210',
        supportEmail: 'support@intelliglobalconferences.com',
      },
      paymentSettings: {
        currency: 'USD',
        currencySymbol: '$',
        paymentMethods: ['card', 'netbanking', 'upi'],
      },
      formSettings: {
        maxParticipants: 10,
        requiredFields: ['firstName', 'lastName', 'email', 'phoneNumber', 'country', 'fullPostalAddress'],
        abstractCategories: [
          { value: 'poster', label: 'Poster' },
          { value: 'oral', label: 'Oral' },
          { value: 'delegate', label: 'Delegate' },
          { value: 'other', label: 'Other' },
        ],
      },
    });

    console.log('✅ Registration Settings created:', registrationSettings._id);

    // 2. Create Registration Types
    const registrationTypes = [
      {
        _type: 'registrationTypes',
        name: 'Speaker Registration',
        category: 'speaker',
        description: 'For conference speakers and keynote presenters',
        pricing: {
          earlyBird: { academiaPrice: 299, businessPrice: 399 },
          nextRound: { academiaPrice: 349, businessPrice: 449 },
          spotRegistration: { academiaPrice: 399, businessPrice: 499 },
        },
        benefits: [
          'Access to all conference sessions',
          'Speaker dinner invitation',
          'Conference materials',
          'Certificate of participation',
          'Networking opportunities',
        ],
        isActive: true,
        displayOrder: 1,
      },
      {
        _type: 'registrationTypes',
        name: 'Delegate Registration',
        category: 'delegate',
        description: 'For conference attendees and delegates',
        pricing: {
          earlyBird: { academiaPrice: 199, businessPrice: 299 },
          nextRound: { academiaPrice: 249, businessPrice: 349 },
          spotRegistration: { academiaPrice: 299, businessPrice: 399 },
        },
        benefits: [
          'Access to all conference sessions',
          'Conference materials',
          'Certificate of participation',
          'Networking opportunities',
          'Refreshments during breaks',
        ],
        isActive: true,
        displayOrder: 2,
      },
      {
        _type: 'registrationTypes',
        name: 'Student Registration',
        category: 'student',
        description: 'Special pricing for students with valid ID',
        pricing: {
          earlyBird: { academiaPrice: 99, businessPrice: 99 },
          nextRound: { academiaPrice: 129, businessPrice: 129 },
          spotRegistration: { academiaPrice: 159, businessPrice: 159 },
        },
        benefits: [
          'Access to all conference sessions',
          'Conference materials',
          'Certificate of participation',
          'Student networking session',
        ],
        isActive: true,
        displayOrder: 3,
      },
      {
        _type: 'registrationTypes',
        name: 'Online Participant',
        category: 'online',
        description: 'Virtual attendance with live streaming access',
        pricing: {
          earlyBird: { academiaPrice: 79, businessPrice: 99 },
          nextRound: { academiaPrice: 99, businessPrice: 129 },
          spotRegistration: { academiaPrice: 129, businessPrice: 159 },
        },
        benefits: [
          'Live streaming access',
          'Digital conference materials',
          'Digital certificate',
          'Access to recorded sessions',
        ],
        isActive: true,
        displayOrder: 4,
      },
    ];

    for (const regType of registrationTypes) {
      const created = await client.create(regType);
      console.log(`✅ Registration Type created: ${created.name} (${created._id})`);
    }

    // 3. Create Sponsorship Tiers
    const sponsorshipTiers = [
      {
        _type: 'sponsorshipTiersRegistration',
        tierName: 'Platinum Sponsor',
        tierLevel: 'platinum',
        price: 5000,
        description: 'Premium sponsorship with maximum visibility and benefits',
        benefits: [
          { benefit: 'Logo on all conference materials', description: 'Prominent placement on banners, programs, and digital displays' },
          { benefit: 'Exhibition booth (premium location)', description: '3x3 meter booth in prime location' },
          { benefit: 'Speaking opportunity', description: '20-minute presentation slot' },
          { benefit: 'Welcome reception sponsorship', description: 'Exclusive branding at welcome event' },
        ],
        inclusions: {
          registrationIncluded: true,
          accommodationIncluded: true,
          numberOfRegistrations: 5,
          accommodationNights: 3,
        },
        displayOrder: 1,
        isActive: true,
        highlightColor: 'gold',
      },
      {
        _type: 'sponsorshipTiersRegistration',
        tierName: 'Gold Sponsor',
        tierLevel: 'gold',
        price: 3000,
        description: 'High-visibility sponsorship with excellent benefits',
        benefits: [
          { benefit: 'Logo on conference materials', description: 'Placement on programs and digital displays' },
          { benefit: 'Exhibition booth', description: '3x3 meter booth' },
          { benefit: 'Networking session sponsorship', description: 'Branding at networking events' },
        ],
        inclusions: {
          registrationIncluded: true,
          accommodationIncluded: true,
          numberOfRegistrations: 3,
          accommodationNights: 3,
        },
        displayOrder: 2,
        isActive: true,
        highlightColor: 'gold',
      },
      {
        _type: 'sponsorshipTiersRegistration',
        tierName: 'Silver Sponsor',
        tierLevel: 'silver',
        price: 2000,
        description: 'Great value sponsorship with good visibility',
        benefits: [
          { benefit: 'Logo on conference program', description: 'Listing in printed and digital programs' },
          { benefit: 'Exhibition space', description: '2x2 meter exhibition space' },
        ],
        inclusions: {
          registrationIncluded: true,
          accommodationIncluded: false,
          numberOfRegistrations: 2,
          accommodationNights: 0,
        },
        displayOrder: 3,
        isActive: true,
        highlightColor: 'silver',
      },
    ];

    for (const tier of sponsorshipTiers) {
      const created = await client.create(tier);
      console.log(`✅ Sponsorship Tier created: ${created.tierName} (${created._id})`);
    }

    // 4. Create Accommodation Options
    const accommodationOptions = [
      {
        _type: 'accommodationOptions',
        hotelName: 'Grand Convention Hotel',
        hotelCategory: '5star',
        description: 'Luxury 5-star hotel adjacent to the conference venue with premium amenities.',
        location: {
          address: '123 Conference Boulevard, New York, NY 10001',
          distanceFromVenue: 'Walking distance (2 minutes)',
          transportationIncluded: true,
        },
        roomOptions: [
          {
            roomType: 'single',
            pricePerNight: 180,
            roomDescription: 'Deluxe single room with city view, king bed, and premium amenities',
            maxGuests: 1,
            isAvailable: true,
          },
          {
            roomType: 'double',
            pricePerNight: 250,
            roomDescription: 'Deluxe double room with city view, two queen beds, and premium amenities',
            maxGuests: 2,
            isAvailable: true,
          },
        ],
        packageOptions: [
          {
            packageName: '3-Night Conference Package',
            nights: 3,
            checkInDate: '2025-07-14',
            checkOutDate: '2025-07-17',
            inclusions: ['Daily breakfast', 'WiFi', 'Airport shuttle', 'Conference shuttle'],
            isActive: true,
          },
        ],
        amenities: ['Free WiFi', 'Fitness Center', 'Business Center', 'Restaurant', 'Room Service', 'Concierge'],
        displayOrder: 1,
        isActive: true,
        bookingDeadline: '2025-06-15',
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in. After that, one night charge applies.',
      },
      {
        _type: 'accommodationOptions',
        hotelName: 'Business Inn & Suites',
        hotelCategory: '4star',
        description: 'Comfortable 4-star business hotel with excellent conference facilities.',
        location: {
          address: '456 Business District, New York, NY 10002',
          distanceFromVenue: '5 minutes by shuttle',
          transportationIncluded: true,
        },
        roomOptions: [
          {
            roomType: 'single',
            pricePerNight: 120,
            roomDescription: 'Standard single room with business amenities and comfortable workspace',
            maxGuests: 1,
            isAvailable: true,
          },
          {
            roomType: 'double',
            pricePerNight: 160,
            roomDescription: 'Standard double room with two double beds and business amenities',
            maxGuests: 2,
            isAvailable: true,
          },
        ],
        packageOptions: [
          {
            packageName: '3-Night Business Package',
            nights: 3,
            checkInDate: '2025-07-14',
            checkOutDate: '2025-07-17',
            inclusions: ['Continental breakfast', 'WiFi', 'Conference shuttle'],
            isActive: true,
          },
        ],
        amenities: ['Free WiFi', 'Business Center', 'Restaurant', 'Laundry Service'],
        displayOrder: 2,
        isActive: true,
        bookingDeadline: '2025-06-15',
        cancellationPolicy: 'Free cancellation up to 24 hours before check-in.',
      },
    ];

    for (const hotel of accommodationOptions) {
      const created = await client.create(hotel);
      console.log(`✅ Accommodation Option created: ${created.hotelName} (${created._id})`);
    }

    console.log('🎉 Registration system data populated successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('- Registration Settings: 1 document');
    console.log('- Registration Types: 4 documents');
    console.log('- Sponsorship Tiers: 3 documents');
    console.log('- Accommodation Options: 2 documents');
    console.log('');
    console.log('🔗 You can now access:');
    console.log('- Registration page: http://localhost:3000/registration');
    console.log('- Admin dashboard: http://localhost:3000/admin/registrations');
    console.log('- Sanity Studio: Configure your Sanity Studio URL');

  } catch (error) {
    console.error('❌ Error populating data:', error);
  }
}

// Run the script
populateRegistrationData();
