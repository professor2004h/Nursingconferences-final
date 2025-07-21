import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET(request: NextRequest) {
  try {
    console.log('📅 Fetching pricing periods...');

    // Fetch pricing periods from Sanity
    const query = `*[_type == "pricingPeriods"] | order(displayOrder asc) {
      _id,
      periodId,
      title,
      startDate,
      endDate,
      isActive,
      displayOrder,
      description,
      highlightColor,
      isCurrentPeriod
    }`;

    const periods = await client.fetch(query);

    // Determine current active period based on current date
    const now = new Date();
    const periodsWithCurrentStatus = periods.map((period: any) => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      const isCurrent = now >= startDate && now <= endDate && period.isActive;
      
      return {
        ...period,
        isCurrentPeriod: isCurrent,
      };
    });

    // Find the active period
    const activePeriod = periodsWithCurrentStatus.find((p: any) => p.isCurrentPeriod);
    
    console.log('✅ Pricing periods fetched successfully:', periodsWithCurrentStatus.length);
    console.log('🎯 Current active period:', activePeriod?.periodId || 'None');

    return NextResponse.json({
      periods: periodsWithCurrentStatus,
      activePeriod: activePeriod || null,
      currentDate: now.toISOString(),
    });
  } catch (error) {
    console.error('❌ Error fetching pricing periods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing periods' },
      { status: 500 }
    );
  }
}

// POST endpoint to update current period status (for admin use)
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Updating pricing periods current status...');

    const { forceUpdate } = await request.json();

    // Fetch all periods
    const query = `*[_type == "pricingPeriods"] {
      _id,
      periodId,
      startDate,
      endDate,
      isActive
    }`;

    const periods = await client.fetch(query);
    const now = new Date();

    // Update each period's current status
    const updatePromises = periods.map(async (period: any) => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      const isCurrent = now >= startDate && now <= endDate && period.isActive;

      if (forceUpdate || period.isCurrentPeriod !== isCurrent) {
        return client
          .patch(period._id)
          .set({ isCurrentPeriod: isCurrent })
          .commit();
      }
      return null;
    });

    await Promise.all(updatePromises.filter(Boolean));

    console.log('✅ Pricing periods updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Pricing periods updated',
      updatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('❌ Error updating pricing periods:', error);
    return NextResponse.json(
      { error: 'Failed to update pricing periods' },
      { status: 500 }
    );
  }
}
