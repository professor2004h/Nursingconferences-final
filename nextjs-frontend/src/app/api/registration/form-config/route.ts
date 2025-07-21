import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Fetching form configuration...');

    // Fetch form configuration from Sanity
    const query = `*[_type == "formConfiguration"][0] {
      _id,
      title,
      countries[] {
        code,
        name,
        isActive
      },
      abstractCategories[] {
        value,
        label,
        description,
        isActive,
        displayOrder
      },
      titleOptions[] {
        value,
        label,
        isActive
      },
      accommodationNightOptions[] {
        nights,
        label,
        isActive
      },
      lastUpdated
    }`;

    const config = await client.fetch(query);

    if (!config) {
      // Return default configuration if none exists
      const defaultConfig = {
        countries: [
          { code: 'US', name: 'United States', isActive: true },
          { code: 'IN', name: 'India', isActive: true },
          { code: 'GB', name: 'United Kingdom', isActive: true },
          { code: 'CA', name: 'Canada', isActive: true },
          { code: 'AU', name: 'Australia', isActive: true },
          { code: 'DE', name: 'Germany', isActive: true },
          { code: 'FR', name: 'France', isActive: true },
          { code: 'JP', name: 'Japan', isActive: true },
          { code: 'CN', name: 'China', isActive: true },
          { code: 'BR', name: 'Brazil', isActive: true },
        ],
        abstractCategories: [
          { value: 'poster', label: 'Poster', isActive: true, displayOrder: 1 },
          { value: 'oral', label: 'Oral', isActive: true, displayOrder: 2 },
          { value: 'delegate', label: 'Delegate', isActive: true, displayOrder: 3 },
          { value: 'other', label: 'Other', isActive: true, displayOrder: 4 },
        ],
        titleOptions: [
          { value: 'mr', label: 'Mr.', isActive: true },
          { value: 'mrs', label: 'Mrs.', isActive: true },
          { value: 'ms', label: 'Ms.', isActive: true },
          { value: 'dr', label: 'Dr.', isActive: true },
          { value: 'prof', label: 'Prof.', isActive: true },
          { value: 'assoc_prof', label: 'Assoc Prof', isActive: true },
          { value: 'assist_prof', label: 'Assist Prof', isActive: true },
        ],
        accommodationNightOptions: [
          { nights: 1, label: '1 Night', isActive: true },
          { nights: 2, label: '2 Nights', isActive: true },
          { nights: 3, label: '3 Nights', isActive: true },
          { nights: 4, label: '4 Nights', isActive: true },
          { nights: 5, label: '5 Nights', isActive: true },
        ],
      };

      console.log('⚠️ No form configuration found, returning defaults');
      return NextResponse.json(defaultConfig);
    }

    // Filter active items and sort where applicable
    const processedConfig = {
      countries: config.countries?.filter((c: any) => c.isActive) || [],
      abstractCategories: config.abstractCategories
        ?.filter((c: any) => c.isActive)
        ?.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0)) || [],
      titleOptions: config.titleOptions?.filter((t: any) => t.isActive) || [],
      accommodationNightOptions: config.accommodationNightOptions?.filter((n: any) => n.isActive) || [],
      lastUpdated: config.lastUpdated,
    };

    console.log('✅ Form configuration fetched successfully');
    console.log(`📊 Countries: ${processedConfig.countries.length}, Categories: ${processedConfig.abstractCategories.length}`);

    return NextResponse.json(processedConfig);
  } catch (error) {
    console.error('❌ Error fetching form configuration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form configuration' },
      { status: 500 }
    );
  }
}

// POST endpoint to update form configuration
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Updating form configuration...');

    const updates = await request.json();

    // Find existing configuration or create new one
    const existingConfig = await client.fetch(`*[_type == "formConfiguration"][0]`);

    if (existingConfig) {
      // Update existing configuration
      const result = await client
        .patch(existingConfig._id)
        .set({
          ...updates,
          lastUpdated: new Date().toISOString(),
        })
        .commit();

      console.log('✅ Form configuration updated successfully');
      return NextResponse.json({
        success: true,
        message: 'Form configuration updated',
        data: result,
      });
    } else {
      // Create new configuration
      const result = await client.create({
        _type: 'formConfiguration',
        title: 'Registration Form Configuration',
        ...updates,
        lastUpdated: new Date().toISOString(),
      });

      console.log('✅ Form configuration created successfully');
      return NextResponse.json({
        success: true,
        message: 'Form configuration created',
        data: result,
      });
    }
  } catch (error) {
    console.error('❌ Error updating form configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update form configuration' },
      { status: 500 }
    );
  }
}
