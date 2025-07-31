import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

// GROQ query to fetch participation benefits data
const PARTICIPATION_BENEFITS_QUERY = `
  *[_type == "participationBenefits" && isActive == true] | order(displayOrder asc) [0] {
    title,
    isActive,
    subtitle,
    benefits[] {
      title,
      description,
      icon,
      isHighlighted,
      displayOrder
    } | order(displayOrder asc),
    maxHeight,
    backgroundColor,
    displayOrder
  }
`;

export async function GET() {
  try {
    console.log('🎯 Fetching participation benefits from Sanity...');

    // Fetch participation benefits data from Sanity
    const benefitsData = await client.fetch(
      PARTICIPATION_BENEFITS_QUERY,
      {},
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!benefitsData) {
      console.log('🎁 No active participation benefits found');
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No active participation benefits found'
      });
    }

    console.log(`✅ Successfully fetched participation benefits: ${benefitsData.title}`);
    console.log(`📊 Benefits section has ${benefitsData.benefits?.length || 0} benefits`);

    return NextResponse.json({
      success: true,
      data: benefitsData,
      message: 'Participation benefits fetched successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching participation benefits:', error);
    
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: 'Failed to fetch participation benefits',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
