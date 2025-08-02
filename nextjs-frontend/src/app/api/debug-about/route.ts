import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🔍 Debug: Fetching all About Us data...');
    
    // Query for all aboutUsSection documents
    const aboutUsSections = await client.fetch(`
      *[_type == "aboutUsSection"]{
        _id,
        title,
        content,
        organizationName,
        organizationBrandName,
        primaryBrandName,
        secondaryBrandText,
        brandTagline,
        isActive,
        _createdAt,
        _updatedAt
      }
    `);
    
    // Query for all about documents
    const aboutDocs = await client.fetch(`
      *[_type == "about"]{
        _id,
        title,
        description,
        organizationName,
        organizationBrandName,
        primaryBrandName,
        secondaryBrandText,
        brandTagline,
        isActive,
        _createdAt,
        _updatedAt
      }
    `);
    
    console.log('📊 Debug results:', {
      aboutUsSections: aboutUsSections.length,
      aboutDocs: aboutDocs.length
    });
    
    return NextResponse.json({
      success: true,
      data: {
        aboutUsSections,
        aboutDocs,
        counts: {
          aboutUsSections: aboutUsSections.length,
          aboutDocs: aboutDocs.length
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Debug failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
