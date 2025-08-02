import { NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

export async function POST() {
  try {
    console.log('🔄 Force updating branding data...');
    
    // Get all aboutUsSection documents
    const documents = await writeClient.fetch(`*[_type == "aboutUsSection"]`);
    console.log('Found documents:', documents.length);
    
    if (documents.length === 0) {
      // Create a new document if none exists
      const newDoc = await writeClient.create({
        _type: 'aboutUsSection',
        title: 'About Us',
        content: 'Nursing Conference 2026 is dedicated to advancing research by bringing together leading medical professionals, researchers, engineers, and scientists. Through our international conferences, events, and exhibitions, we aim to keep the global community informed about developments in the scientific field. Our goal is to foster collaboration among experienced scholars, early-career researchers, and industry experts by building strong networks across academia and the market. We strive to enhance the quality and impact of scientific exchange through our events.',
        primaryBrandName: 'Nursing',
        secondaryBrandText: 'Conference 2026',
        brandTagline: 'Connecting minds, sharing knowledge',
        isActive: true
      });
      
      console.log('Created new document:', newDoc._id);
      
      return NextResponse.json({
        success: true,
        message: 'Created new aboutUsSection document',
        data: newDoc
      });
    }
    
    // Update all existing documents
    const updates = [];
    for (const doc of documents) {
      console.log('Updating document:', doc._id);
      
      const updated = await writeClient
        .patch(doc._id)
        .set({
          primaryBrandName: 'Nursing',
          secondaryBrandText: 'Conference 2026',
          brandTagline: 'Connecting minds, sharing knowledge',
          content: 'Nursing Conference 2026 is dedicated to advancing research by bringing together leading medical professionals, researchers, engineers, and scientists. Through our international conferences, events, and exhibitions, we aim to keep the global community informed about developments in the scientific field. Our goal is to foster collaboration among experienced scholars, early-career researchers, and industry experts by building strong networks across academia and the market. We strive to enhance the quality and impact of scientific exchange through our events.',
          isActive: true
        })
        .commit();
        
      updates.push(updated);
      console.log('Updated:', updated._id);
    }
    
    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} documents`,
      data: updates
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update branding data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Just return current data for debugging
    const documents = await writeClient.fetch(`*[_type == "aboutUsSection"]{
      _id,
      title,
      content,
      primaryBrandName,
      secondaryBrandText,
      brandTagline,
      organizationName,
      organizationBrandName,
      isActive,
      _updatedAt
    }`);
    
    return NextResponse.json({
      success: true,
      data: documents
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
