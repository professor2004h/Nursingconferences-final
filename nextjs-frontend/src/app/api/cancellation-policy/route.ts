import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';
import { CancellationPolicy } from '@/app/types/cancellationPolicy';

export async function GET() {
  try {
    console.log('📋 Fetching cancellation policy from Sanity...');
    
    const query = `
      *[_type == "cancellationPolicy" && isActive == true][0]{
        _id,
        title,
        subtitle,
        introduction,
        nameChangePolicy{
          title,
          content,
          deadline
        },
        refundPolicy{
          title,
          generalPolicy,
          refundTiers[]{
            daysBeforeConference,
            refundPercentage,
            description
          },
          additionalTerms
        },
        naturalDisasterPolicy{
          title,
          content,
          organizerRights,
          liabilityDisclaimer
        },
        postponementPolicy{
          title,
          content,
          creditValidityPeriod
        },
        transferPolicy{
          title,
          personTransfer,
          conferenceTransfer,
          transferDeadline,
          transferLimitations
        },
        visaPolicy{
          title,
          generalAdvice,
          failedVisaPolicy
        },
        contactInformation{
          title,
          primaryEmail,
          phone,
          instructions
        },
        importantNotes[]{
          title,
          content,
          priority
        },
        lastUpdated,
        isActive,
        effectiveDate,
        seoTitle,
        seoDescription
      }
    `;

    const cancellationPolicy: CancellationPolicy | null = await client.fetch(query);
    
    if (!cancellationPolicy) {
      console.log('⚠️ No active cancellation policy found');
      return NextResponse.json({
        success: false,
        error: 'No active cancellation policy found'
      }, { status: 404 });
    }

    console.log('✅ Successfully fetched cancellation policy:', cancellationPolicy.title);
    
    return NextResponse.json({
      success: true,
      data: cancellationPolicy
    });

  } catch (error) {
    console.error('❌ Error fetching cancellation policy:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch cancellation policy'
    }, { status: 500 });
  }
}
