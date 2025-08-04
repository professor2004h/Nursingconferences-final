import { NextResponse } from 'next/server';
import { getSanityClient } from '@/app/lib/sanityClient';

// Read config from env, but do NOT assert non-null at module scope.
// Fall back to safe defaults so that importing this file during build does not throw.
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  '';
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  '2023-10-10';

// At module scope, always construct a READ-ONLY client (no token) to avoid
// build-time token requirements if the module gets imported.

// Lazily create an authenticated client only inside the request handler if a token exists.
// This avoids referencing write credentials during build.

export async function GET() {
  try {
    // If projectId is missing (e.g., build environment), return safe defaults instead of throwing.
    if (!projectId) {
      return NextResponse.json(
        {
          heroBackgroundImageUrl: null,
          heroOverlayOpacity: 40,
        },
        { status: 200 }
      );
    }

    const client = getSanityClient();

    const query = `*[_type == "brochureSettings"] | order(_updatedAt desc)[0]{
      "heroBackgroundImageUrl": coalesce(heroBackgroundImage.asset->url, heroBackgroundImage.url),
      heroOverlayOpacity
    }`;

    const data = await client.fetch(query);

    return NextResponse.json(
      {
        heroBackgroundImageUrl: data?.heroBackgroundImageUrl || null,
        heroOverlayOpacity:
          typeof data?.heroOverlayOpacity === 'number' ? data.heroOverlayOpacity : 40,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Error fetching brochure settings:', e);
    // Return safe defaults to prevent build-time failures
    return NextResponse.json(
      {
        heroBackgroundImageUrl: null,
        heroOverlayOpacity: 40,
      },
      { status: 200 }
    );
  }
}
