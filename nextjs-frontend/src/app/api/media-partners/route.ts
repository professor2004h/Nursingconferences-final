import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🤝 Fetching media partners...');

    const query = `*[_type == "mediaPartners" && isActive == true] | order(companyName asc) {
      _id,
      companyName,
      logo{
        asset->{
          url,
          _id
        },
        alt
      },
      website,
      description,
      isActive
    }`;

    const partners = await client.fetch(query);

    console.log(`✅ Successfully fetched ${partners.length} media partners`);

    return NextResponse.json({
      success: true,
      data: partners,
      count: partners.length
    });
  } catch (error) {
    console.error('❌ Error fetching media partners:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch media partners',
        data: []
      },
      { status: 500 }
    );
  }
}
