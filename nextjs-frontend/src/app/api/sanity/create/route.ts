import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Creating Sanity document...');

    const document = await request.json();

    if (!document._type) {
      return NextResponse.json(
        { error: 'Document must have a _type field' },
        { status: 400 }
      );
    }

    console.log('📄 Document type:', document._type);

    // Create the document in Sanity
    const result = await client.create(document);

    console.log('✅ Document created successfully:', result._id);

    return NextResponse.json({
      success: true,
      message: 'Document created successfully',
      data: result,
    });
  } catch (error) {
    console.error('❌ Error creating Sanity document:', error);
    
    // Handle specific Sanity errors
    if (error instanceof Error) {
      if (error.message.includes('Insufficient permissions')) {
        return NextResponse.json(
          { error: 'Insufficient permissions to create document' },
          { status: 403 }
        );
      }
      
      if (error.message.includes('Invalid document')) {
        return NextResponse.json(
          { error: 'Invalid document structure' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json(
        { error: 'Type parameter is required' },
        { status: 400 }
      );
    }

    console.log('📋 Fetching documents of type:', type);

    // Fetch documents of the specified type
    const query = `*[_type == $type] | order(_createdAt desc)`;
    const documents = await client.fetch(query, { type });

    console.log('✅ Documents fetched successfully:', documents.length);

    return NextResponse.json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error('❌ Error fetching Sanity documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
