import { NextResponse } from 'next/server';
import { getSanityClient } from '@/app/lib/sanityClient';

type Exhibitor = {
  _id: string;
  companyName: string;
  description?: string;
  website?: string;
  logo?: {
    alt?: string;
    asset?: {
      url?: string;
    };
  };
};

type ExhibitorsApiResponse = {
  success: boolean;
  data?: Exhibitor[];
  error?: string;
};

export async function GET() {
  try {
    // GROQ mirrors media partners, but for type == "exhibitors"
    const query = `
      *[_type == "exhibitors"]|order(order asc){
        _id,
        companyName,
        description,
        website,
        "logo": {
          "alt": coalesce(logo.alt, companyName),
          "asset": {
            "url": logo.asset->url
          }
        }
      }
    `;

    const client = getSanityClient();
    const data = await client.fetch<Exhibitor[]>(query);

    return NextResponse.json<ExhibitorsApiResponse>({
      success: true,
      data: data ?? [],
    });
  } catch (error: any) {
    console.error('Error fetching exhibitors from Sanity:', error);
    return NextResponse.json<ExhibitorsApiResponse>({
      success: false,
      error: 'Failed to fetch exhibitors',
    }, { status: 500 });
  }
}
