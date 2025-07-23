import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    const query = `
      *[_type == "speakers" && isActive == true] | order(displayOrder asc) {
        _id,
        name,
        title,
        institution,
        country,
        "profileImageUrl": profileImage.asset->url,
        bio,
        specialization,
        speakerCategory,
        sessionTitle,
        sessionAbstract,
        email,
        linkedinUrl,
        orcidId,
        researchGateUrl,
        websiteUrl,
        displayOrder,
        isKeynote,
        isFeatured,
        yearsOfExperience,
        achievements,
        publications,
        sessionDate,
        sessionLocation
      }
    `;

    const speakers = await client.fetch(query);

    return NextResponse.json({
      success: true,
      data: speakers,
      count: speakers.length
    });
  } catch (error) {
    console.error('Error fetching speakers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch speakers data',
        data: []
      },
      { status: 500 }
    );
  }
}

// Optional: Add a route to get a single speaker by ID
export async function POST(request: Request) {
  try {
    const { speakerId } = await request.json();
    
    if (!speakerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Speaker ID is required'
        },
        { status: 400 }
      );
    }

    const query = `
      *[_type == "speakers" && _id == $speakerId && isActive == true][0] {
        _id,
        name,
        title,
        institution,
        country,
        "profileImageUrl": profileImage.asset->url,
        bio,
        specialization,
        speakerCategory,
        sessionTitle,
        sessionAbstract,
        email,
        linkedinUrl,
        orcidId,
        researchGateUrl,
        websiteUrl,
        displayOrder,
        isKeynote,
        yearsOfExperience,
        achievements,
        publications,
        sessionDate,
        sessionLocation
      }
    `;

    const speaker = await client.fetch(query, { speakerId });

    if (!speaker) {
      return NextResponse.json(
        {
          success: false,
          error: 'Speaker not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: speaker
    });
  } catch (error) {
    console.error('Error fetching speaker:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch speaker data'
      },
      { status: 500 }
    );
  }
}
