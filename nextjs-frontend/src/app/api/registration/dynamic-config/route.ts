import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🚀 Fetching registration configuration...');

    // Fetch all required data for registration
    const [registrationSettings, registrationTypes, sponsorshipTiers, accommodationOptions] = await Promise.all([
      // Registration Settings - get the actual dates from here
      client.fetch(`*[_type == "registrationSettings"][0] {
        _id,
        pricingDates {
          earlyBirdEnd,
          nextRoundStart,
          nextRoundEnd,
          spotRegistrationStart,
          registrationCloseDate
        }
      }`),

      // Registration Types - with multi-currency support
      client.fetch(`*[_type == "registrationTypes" && isActive == true && category in ["speaker-inperson", "speaker-virtual", "listener-inperson", "listener-virtual", "student-inperson", "student-virtual", "eposter-virtual", "exhibitor"]] | order(displayOrder asc) {
        _id,
        name,
        category,
        description,
        earlyBirdPrice,
        earlyBirdPriceEUR,
        earlyBirdPriceGBP,
        earlyBirdPriceINR,
        nextRoundPrice,
        nextRoundPriceEUR,
        nextRoundPriceGBP,
        nextRoundPriceINR,
        onSpotPrice,
        onSpotPriceEUR,
        onSpotPriceGBP,
        onSpotPriceINR,
        benefits,
        isActive,
        displayOrder
      }`),

      // Sponsorship Tiers (with multi-currency support)
      client.fetch(`*[_type == "sponsorshipTiers" && active == true] | order(order asc) {
        _id,
        name,
        price,
        priceEUR,
        priceGBP,
        description,
        benefits,
        color,
        active,
        order,
        featured,
        slug
      }`),

      // Accommodation Options
      client.fetch(`*[_type == "accommodationOptions" && isActive == true] | order(displayOrder asc) {
        _id,
        hotelName,
        hotelCategory,
        description,
        roomOptions[] {
          roomType,
          pricePerNight,
          pricePerNightEUR,
          pricePerNightGBP,
          roomDescription,
          maxGuests,
          isAvailable
        },
        packageOptions[] {
          packageName,
          nights,
          checkInDate,
          checkOutDate,
          inclusions,
          isActive
        },
        location,
        amenities,
        isActive,
        displayOrder,
        maxRooms,
        currentBookings,
        availableFrom,
        availableUntil,
        images
      }`),
    ]);

    // Create pricing periods from registration settings
    const pricingDates = registrationSettings?.pricingDates;
    const pricingPeriods = [];

    if (pricingDates) {
      // Early Bird Period
      pricingPeriods.push({
        _id: 'earlyBird',
        periodId: 'earlyBird',
        title: 'Early Bird Registration',
        startDate: '2025-01-01T00:00:00Z', // Start of year
        endDate: pricingDates.earlyBirdEnd,
        isActive: true,
        displayOrder: 1
      });

      // Mid Term Period
      pricingPeriods.push({
        _id: 'nextRound',
        periodId: 'nextRound',
        title: 'Mid Term Registration',
        startDate: pricingDates.nextRoundStart,
        endDate: pricingDates.nextRoundEnd,
        isActive: true,
        displayOrder: 2
      });

      // Onspot Period
      pricingPeriods.push({
        _id: 'spotRegistration',
        periodId: 'spotRegistration',
        title: 'Onspot Registration',
        startDate: pricingDates.spotRegistrationStart,
        endDate: pricingDates.registrationCloseDate,
        isActive: true,
        displayOrder: 3
      });
    }

    console.log(`✅ Found ${registrationTypes.length} registration types, ${pricingPeriods.length} pricing periods, ${sponsorshipTiers.length} sponsorship tiers, ${accommodationOptions.length} accommodation options`);

    // Determine current active pricing period
    const now = new Date();
    const activePeriod = pricingPeriods.find((period: any) => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      return now >= startDate && now <= endDate && period.isActive;
    });

    // Process registration types with period-specific pricing
    const processedRegistrationTypes = registrationTypes.map((type: any) => {
      // Create pricing by period using the period-specific prices
      const pricingByPeriod: any = {};

      // Map period IDs to price fields
      const periodPriceMap: { [key: string]: string } = {
        'earlyBird': 'earlyBirdPrice',
        'nextRound': 'nextRoundPrice',
        'spotRegistration': 'onSpotPrice'
      };

      // Apply the appropriate price to each active pricing period
      pricingPeriods.forEach((period: any) => {
        if (period.isActive) {
          const priceField = periodPriceMap[period.periodId] || 'earlyBirdPrice';
          pricingByPeriod[period.periodId] = {
            price: type[priceField] || 0,
            period: period,
          };
        }
      });

      return {
        ...type,
        pricingByPeriod
      };
    });

    const response = {
      registrationTypes: processedRegistrationTypes,
      pricingPeriods,
      activePeriod,
      sponsorshipTiers,
      accommodationOptions,
      currentDate: now.toISOString(),
      lastFetched: new Date().toISOString()
    };

    console.log('✅ Registration configuration fetched successfully');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error fetching registration configuration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration configuration' },
      { status: 500 }
    );
  }
}
