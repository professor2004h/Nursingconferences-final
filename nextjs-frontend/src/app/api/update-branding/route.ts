import { NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

export async function POST() {
  try {
    console.log('🔄 Updating branding data in Sanity...');

    // First, let's see what data currently exists
    const aboutUsSections = await writeClient.fetch(`*[_type == "aboutUsSection"]{
      _id,
      title,
      content,
      organizationName,
      organizationBrandName,
      primaryBrandName,
      secondaryBrandText,
      brandTagline,
      isActive
    }`);

    console.log(`Found ${aboutUsSections.length} aboutUsSection documents:`, aboutUsSections);

    for (const section of aboutUsSections) {
      console.log(`Updating aboutUsSection: ${section._id}`);
      console.log('Current data:', section);

      // Force update with new branding values
      const updatedSection = await writeClient
        .patch(section._id)
        .set({
          primaryBrandName: 'Nursing',
          secondaryBrandText: 'Conference 2026',
          brandTagline: 'Connecting minds, sharing knowledge',
          isActive: true
        })
        .unset(['organizationName', 'organizationBrandName']) // Remove old fields
        .commit();

      console.log(`✅ Updated aboutUsSection: ${updatedSection._id}`);
    }
    
    // Update about documents
    const aboutDocs = await writeClient.fetch(`*[_type == "about"]`);
    
    console.log(`Found ${aboutDocs.length} about documents`);
    
    for (const doc of aboutDocs) {
      console.log(`Updating about document: ${doc._id}`);
      
      const updatedDoc = await writeClient
        .patch(doc._id)
        .set({
          primaryBrandName: 'Nursing',
          secondaryBrandText: 'Conference 2026',
          brandTagline: 'Connecting minds, sharing knowledge',
          isActive: true
        })
        .commit();
        
      console.log(`✅ Updated about document: ${updatedDoc._id}`);
    }
    
    console.log('✅ All branding data updated successfully!');
    
    return NextResponse.json({
      success: true,
      message: 'Branding data updated successfully',
      updated: {
        aboutUsSection: aboutUsSections.length,
        about: aboutDocs.length
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating branding data:', error);
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
