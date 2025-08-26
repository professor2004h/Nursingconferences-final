import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🚀 Fetching quick registration configuration...');

    // Simplified query - just get the essential data
    const [registrationTypes, pricingPeriods] = await Promise.all([
      // Get registration types with multi-currency pricing
      client.fetch(`*[_type == "registrationTypes" && category in ["speaker-inperson", "speaker-virtual", "listener-inperson", "listener-virtual", "student-inperson", "student-virtual", "eposter-virtual", "exhibitor"] && isActive == true] | order(displayOrder asc) {
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

      // Get pricing periods
      client.fetch(`*[_type == "pricingPeriods" && isActive == true] | order(displayOrder asc) {
        _id,
        periodId,
        title,
        startDate,
        endDate,
        isActive,
        displayOrder
      }`)
    ]);

    console.log(`✅ Found ${registrationTypes.length} registration types and ${pricingPeriods.length} pricing periods`);

    // Determine current active pricing period
    const now = new Date();
    const activePeriod = pricingPeriods.find((period: any) => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      return now >= startDate && now <= endDate && period.isActive;
    });

    // Process registration types with current pricing
    const processedRegistrationTypes = registrationTypes.map((type: any) => {
      let currentPrice = type.earlyBirdPrice; // Default to early bird

      // Determine current price based on active period
      if (activePeriod) {
        switch (activePeriod.periodId) {
          case 'earlyBird':
            currentPrice = type.earlyBirdPrice;
            break;
          case 'nextRound':
            currentPrice = type.nextRoundPrice;
            break;
          case 'spotRegistration':
            currentPrice = type.onSpotPrice;
            break;
          default:
            currentPrice = type.earlyBirdPrice;
        }
      }

      return {
        ...type,
        currentPrice,
        allPrices: {
          earlyBird: type.earlyBirdPrice,
          nextRound: type.nextRoundPrice,
          onSpot: type.onSpotPrice
        }
      };
    });

    const response = {
      registrationTypes: processedRegistrationTypes,
      pricingPeriods,
      activePeriod,
      currentDate: now.toISOString(),
      lastFetched: new Date().toISOString()
    };

    console.log('✅ Quick config fetched successfully');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error fetching quick registration config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration configuration' },
      { status: 500 }
    );
  }
}
