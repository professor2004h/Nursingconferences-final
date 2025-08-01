import { NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

export async function POST() {
  try {
    console.log('🌱 Seeding About Us section data...');
    
    // Check if About Us section already exists
    const existingAboutUs = await writeClient.fetch(`
      *[_type == "aboutUsSection"][0]
    `);

    if (existingAboutUs) {
      console.log('⚠️ About Us section already exists');
      return NextResponse.json({
        success: false,
        message: 'About Us section already exists',
        data: existingAboutUs
      });
    }

    // Create the default About Us content
    const defaultAboutUsData = {
      _type: 'aboutUsSection',
      title: 'About Us',
      content: 'Intelli Global Conferences is dedicated to advancing research by bringing together leading medical professionals, researchers, engineers, and scientists. Through our international conferences, events, and exhibitions, we aim to keep the global community informed about developments in the scientific field. Our goal is to foster collaboration among experienced scholars, early-career researchers, and industry experts by building strong networks across academia and the market. We strive to enhance the quality and impact of scientific exchange through our events.',
      isActive: true
    };

    const createdDocument = await writeClient.create(defaultAboutUsData);
    
    console.log('✅ About Us section created successfully:', createdDocument._id);
    
    return NextResponse.json({
      success: true,
      message: 'About Us section created successfully',
      data: createdDocument
    });
  } catch (error) {
    console.error('❌ Error seeding About Us section:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed About Us section data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
