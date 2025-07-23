import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    const query = `
      *[_type == "organizingCommittee" && isActive == true] | order(displayOrder asc) {
        _id,
        name,
        title,
        institution,
        country,
        "profileImageUrl": profileImage.asset->url,
        bio,
        specialization,
        email,
        linkedinUrl,
        orcidId,
        researchGateUrl,
        displayOrder,
        isChairperson,
        isFeatured,
        yearsOfExperience,
        achievements,
        publications
      }
    `;

    const committeeMembers = await client.fetch(query);

    return NextResponse.json({
      success: true,
      data: committeeMembers,
      count: committeeMembers.length
    });
  } catch (error) {
    console.error('Error fetching organizing committee:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch organizing committee data',
        data: []
      },
      { status: 500 }
    );
  }
}

// Optional: Add a route to get a single committee member by ID
export async function POST(request: Request) {
  try {
    const { memberId } = await request.json();
    
    if (!memberId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Member ID is required'
        },
        { status: 400 }
      );
    }

    const query = `
      *[_type == "organizingCommittee" && _id == $memberId && isActive == true][0] {
        _id,
        name,
        title,
        institution,
        country,
        "profileImageUrl": profileImage.asset->url,
        bio,
        specialization,
        email,
        linkedinUrl,
        orcidId,
        researchGateUrl,
        displayOrder,
        isChairperson,
        yearsOfExperience,
        achievements,
        publications
      }
    `;

    const member = await client.fetch(query, { memberId });

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: 'Committee member not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Error fetching committee member:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch committee member data'
      },
      { status: 500 }
    );
  }
}
