import { NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

export async function POST() {
  try {
    console.log('🌱 Seeding About Us page data...');

    // Check if About Us page already exists
    const existingAbout = await writeClient.fetch(`
      *[_type == "about"][0]
    `);

    if (existingAbout) {
      console.log('⚠️ About Us page already exists');
      return NextResponse.json({
        success: false,
        message: 'About Us page already exists',
        data: existingAbout
      });
    }

    // Create the default About Us page content
    const defaultAboutData = {
      _type: 'about',
      title: 'About Us',
      description: [
        {
          _type: 'block',
          _key: 'block1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'We are dedicated to advancing research by bringing together leading medical professionals, researchers, engineers, and scientists. Through our international conferences, events, and exhibitions, we aim to keep the global community informed about developments in the scientific field.'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'block2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span2',
              text: 'Our goal is to foster collaboration among experienced scholars, early-career researchers, and industry experts by building strong networks across academia and the market. We strive to enhance the quality and impact of scientific exchange through our events.'
            }
          ]
        }
      ],
      primaryBrandName: 'Nursing',
      secondaryBrandText: 'Conference 2026',
      brandTagline: 'Connecting minds, sharing knowledge',
      isActive: true
    };

    const createdDocument = await writeClient.create(defaultAboutData);

    console.log('✅ About Us page created successfully:', createdDocument._id);

    return NextResponse.json({
      success: true,
      message: 'About Us page created successfully',
      data: createdDocument
    });
  } catch (error) {
    console.error('❌ Error seeding About Us page:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed About Us page data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
