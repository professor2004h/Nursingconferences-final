import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const researchArea = searchParams.get('researchArea');
    const sessionTrack = searchParams.get('sessionTrack');
    const isFeatured = searchParams.get('isFeatured');
    const searchQuery = searchParams.get('search');

    console.log('🔍 Fetching poster presenters with filters:', {
      researchArea,
      sessionTrack,
      isFeatured,
      searchQuery
    });

    // Build dynamic query based on filters
    let query = `*[_type == "posterPresenters" && isActive == true`;
    
    if (researchArea) {
      query += ` && researchArea match "${researchArea}"`;
    }
    
    if (sessionTrack) {
      query += ` && sessionTrack == "${sessionTrack}"`;
    }
    
    if (isFeatured === 'true') {
      query += ` && isFeatured == true`;
    }
    
    if (searchQuery) {
      query += ` && (name match "*${searchQuery}*" || posterTitle match "*${searchQuery}*" || institution match "*${searchQuery}*")`;
    }
    
    query += `] | order(displayOrder asc) {
      _id,
      name,
      title,
      institution,
      country,
      "profileImageUrl": profileImage.asset->url,
      bio,
      posterTitle,
      posterAbstract,
      researchArea,
      keywords,
      email,
      linkedinUrl,
      orcidId,
      researchGateUrl,
      "posterFileUrl": posterFile.asset->url,
      presentationDate,
      sessionTrack,
      displayOrder,
      isFeatured,
      isActive,
      awards,
      publications,
      collaborators
    }`;

    console.log('📋 Executing query:', query);

    const posterPresenters = await client.fetch(query);

    console.log(`✅ Successfully fetched ${posterPresenters.length} poster presenters`);

    return NextResponse.json({
      success: true,
      data: posterPresenters,
      count: posterPresenters.length
    });
  } catch (error) {
    console.error('❌ Error fetching poster presenters:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch poster presenters data',
        data: []
      },
      { status: 500 }
    );
  }
}

// GET stats endpoint for dashboard/analytics
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.action === 'getStats') {
      console.log('📊 Fetching poster presenters statistics...');

      const statsQuery = `{
        "totalPresenters": count(*[_type == "posterPresenters" && isActive == true]),
        "featuredPresenters": count(*[_type == "posterPresenters" && isActive == true && isFeatured == true]),
        "researchAreas": array::unique(*[_type == "posterPresenters" && isActive == true].researchArea),
        "sessionTracks": array::unique(*[_type == "posterPresenters" && isActive == true].sessionTrack)
      }`;

      const stats = await client.fetch(statsQuery);

      console.log('📊 Poster presenters stats:', stats);

      return NextResponse.json({
        success: true,
        data: stats
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action'
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('❌ Error fetching poster presenters stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch poster presenters statistics'
      },
      { status: 500 }
    );
  }
}
