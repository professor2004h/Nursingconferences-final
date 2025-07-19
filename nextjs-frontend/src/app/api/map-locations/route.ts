import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

// Define the map location type (simplified for decimal coordinates only)
export interface MapLocation {
  _id: string;
  title: string;
  category?: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  isActive: boolean;
  priority?: number;
  markerColor?: string;
}

// GROQ query to fetch active map locations (decimal coordinates only)
const MAP_LOCATIONS_QUERY = `
  *[_type == "mapLocation" && isActive == true] | order(priority desc, title asc) {
    _id,
    title,
    category,
    address,
    latitude,
    longitude,
    description,
    isActive,
    priority,
    markerColor
  }
`;

// No test data - only use Sanity CMS data

export async function GET(_request: NextRequest) {
  try {
    console.log('🗺️ Fetching map locations from Sanity...');

    let locations: MapLocation[] = [];
    const dataSource: 'sanity' | 'test' = 'sanity';

    // Fetch map locations from Sanity CMS only
    locations = await client.fetch(
      MAP_LOCATIONS_QUERY,
      {},
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    console.log(`✅ Successfully fetched ${locations.length} active map locations from Sanity`);

    // Validate location data (only decimal coordinates)
    const validLocations = locations.filter(location => {
      // Basic validation
      if (!location.title || !location.address) {
        console.warn(`⚠️ Missing required fields for: ${location.title || 'Unknown'}`);
        return false;
      }

      // Validate decimal coordinates
      if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
        console.warn(`⚠️ Missing or invalid coordinates for: ${location.title}`);
        return false;
      }

      // Validate coordinate ranges
      if (location.latitude < -90 || location.latitude > 90) {
        console.warn(`⚠️ Invalid latitude for: ${location.title}`);
        return false;
      }

      if (location.longitude < -180 || location.longitude > 180) {
        console.warn(`⚠️ Invalid longitude for: ${location.title}`);
        return false;
      }

      return true;
    });

    console.log(`✅ ${validLocations.length} valid locations after validation`);

    // Return the locations with proper headers
    return NextResponse.json(
      {
        success: true,
        data: validLocations,
        count: validLocations.length,
        dataSource: dataSource,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );

  } catch (error) {
    console.error('❌ Error fetching map locations:', error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch map locations',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
