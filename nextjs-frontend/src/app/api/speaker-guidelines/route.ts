import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🎤 Fetching speaker guidelines from Sanity...');
    
    // Query for active speaker guidelines
    const query = `
      *[_type == "speakerGuidelines" && isActive == true][0]{
        _id,
        title,
        subtitle,
        introduction,
        speakerRequirements,
        posterGuidelines,
        presentationRequirements,
        virtualGuidelines,
        certificationInfo,
        technicalSpecifications,
        submissionDeadlines,
        contactInformation,
        additionalNotes,
        isActive,
        lastUpdated
      }
    `;

    const guidelines = await client.fetch(query);
    
    if (!guidelines) {
      console.log('⚠️ No active speaker guidelines found');
      return NextResponse.json({
        success: false,
        data: null,
        error: 'No speaker guidelines found'
      });
    }

    console.log(`✅ Found speaker guidelines: ${guidelines.title}`);
    
    return NextResponse.json({
      success: true,
      data: guidelines
    });

  } catch (error) {
    console.error('❌ Error fetching speaker guidelines:', error);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch speaker guidelines'
    }, { status: 500 });
  }
}
