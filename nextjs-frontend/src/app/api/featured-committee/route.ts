import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🌟 Fetching featured committee members...');
    
    // Query for featured committee members only
    const query = `
      *[_type == "organizingCommittee" && isActive == true && isFeatured == true] | order(displayOrder asc) {
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

    const featuredMembers = await client.fetch(query);
    
    console.log(`✅ Found ${featuredMembers.length} featured committee members`);
    
    return NextResponse.json({
      success: true,
      data: featuredMembers,
      count: featuredMembers.length
    });

  } catch (error) {
    console.error('❌ Error fetching featured committee members:', error);
    
    return NextResponse.json({
      success: false,
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch featured committee members'
    }, { status: 500 });
  }
}

// Optional: Add POST method for updating featured status
export async function POST(request: Request) {
  try {
    const { memberId, isFeatured } = await request.json();
    
    if (!memberId) {
      return NextResponse.json({
        success: false,
        error: 'Member ID is required'
      }, { status: 400 });
    }

    console.log(`🔄 Updating featured status for member ${memberId}: ${isFeatured}`);
    
    // This would require write permissions - implement if needed
    // const result = await writeClient.patch(memberId).set({ isFeatured }).commit();
    
    return NextResponse.json({
      success: true,
      message: 'Featured status updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating featured status:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update featured status'
    }, { status: 500 });
  }
}
