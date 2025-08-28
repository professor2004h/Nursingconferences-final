import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    // Test direct query by ID
    const directQuery = `*[_id == "Zv40Z5ggwujmDSMbbmCqTW"][0]`;
    const directResult = await client.fetch(directQuery);
    
    // Test query by type
    const typeQuery = `*[_type == "registrationSettings"]`;
    const typeResults = await client.fetch(typeQuery);
    
    // Test first document by type
    const firstQuery = `*[_type == "registrationSettings"][0]`;
    const firstResult = await client.fetch(firstQuery);
    
    return NextResponse.json({
      success: true,
      directResult,
      typeResults,
      firstResult,
      typeResultsCount: typeResults?.length || 0,
      hasDirectResult: !!directResult,
      hasFirstResult: !!firstResult,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
