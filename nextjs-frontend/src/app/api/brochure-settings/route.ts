import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2023-10-10';
const useCdn = false;

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token: process.env.SANITY_READ_TOKEN || process.env.SANITY_API_TOKEN
});

export async function GET() {
  try {
    const query = `*[_type == "brochureSettings"] | order(_updatedAt desc)[0]{
      "heroBackgroundImageUrl": coalesce(heroBackgroundImage.asset->url, heroBackgroundImage.url),
      heroOverlayOpacity
    }`;
    const data = await client.fetch(query);

    return NextResponse.json({
      heroBackgroundImageUrl: data?.heroBackgroundImageUrl || null,
      heroOverlayOpacity: typeof data?.heroOverlayOpacity === 'number' ? data.heroOverlayOpacity : 40
    }, { status: 200 });
  } catch (e) {
    console.error('Error fetching brochure settings:', e);
    return NextResponse.json({
      heroBackgroundImageUrl: null,
      heroOverlayOpacity: 40
    }, { status: 200 });
  }
}
