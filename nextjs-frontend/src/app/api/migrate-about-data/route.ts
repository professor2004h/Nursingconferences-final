import { NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

export async function POST() {
  try {
    console.log('🔄 Migrating organization branding data from aboutUsSection to about...');
    
    // Get data from aboutUsSection
    const aboutUsSection = await writeClient.fetch(`
      *[_type == "aboutUsSection"][0]{
        primaryBrandName,
        secondaryBrandText,
        brandTagline,
        title,
        content
      }
    `);

    if (!aboutUsSection) {
      console.log('⚠️ No aboutUsSection found to migrate from');
      return NextResponse.json({
        success: false,
        message: 'No aboutUsSection found to migrate from'
      });
    }

    // Check if about document already exists
    const existingAbout = await writeClient.fetch(`
      *[_type == "about"][0]
    `);

    if (existingAbout) {
      // Update existing about document with organization branding fields
      const updatedDocument = await writeClient
        .patch(existingAbout._id)
        .set({
          primaryBrandName: aboutUsSection.primaryBrandName || 'Nursing',
          secondaryBrandText: aboutUsSection.secondaryBrandText || 'Conference 2026',
          brandTagline: aboutUsSection.brandTagline || 'Connecting minds, sharing knowledge',
          isActive: true
        })
        .commit();

      console.log('✅ About document updated with organization branding:', updatedDocument._id);
      
      return NextResponse.json({
        success: true,
        message: 'About document updated with organization branding',
        data: updatedDocument
      });
    } else {
      // Create new about document with migrated data
      const newAboutData = {
        _type: 'about',
        title: 'About Us',
        description: [
          {
            _type: 'block',
            _key: 'migrated-block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'migrated-span',
                text: aboutUsSection.content || 'We are dedicated to advancing research by bringing together leading medical professionals, researchers, engineers, and scientists.'
              }
            ]
          }
        ],
        primaryBrandName: aboutUsSection.primaryBrandName || 'Nursing',
        secondaryBrandText: aboutUsSection.secondaryBrandText || 'Conference 2026',
        brandTagline: aboutUsSection.brandTagline || 'Connecting minds, sharing knowledge',
        isActive: true
      };

      const createdDocument = await writeClient.create(newAboutData);
      
      console.log('✅ About document created with migrated data:', createdDocument._id);
      
      return NextResponse.json({
        success: true,
        message: 'About document created with migrated organization branding',
        data: createdDocument
      });
    }
  } catch (error) {
    console.error('❌ Error migrating organization branding data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to migrate organization branding data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
