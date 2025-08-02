import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('📖 Fetching About Us section data from Sanity...');
    
    // Query for active About Us section (fetch both old and new fields for compatibility)
    const query = `
      *[_type == "aboutUsSection" && isActive == true][0]{
        _id,
        title,
        content,
        primaryBrandName,
        secondaryBrandText,
        brandTagline,
        organizationName,
        organizationBrandName,
        isActive,
        _createdAt,
        _updatedAt
      }
    `;

    const aboutUsData = await client.fetch(query);
    
    if (!aboutUsData) {
      console.log('⚠️ No active About Us section found');
      return NextResponse.json({
        success: false,
        data: null,
        error: 'No About Us section found'
      });
    }

    console.log('✅ About Us section data fetched successfully');
    
    const response = NextResponse.json({
      success: true,
      data: aboutUsData
    });

    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('❌ Error fetching About Us section:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch About Us section data',
        data: null
      },
      { status: 500 }
    );
  }
}
