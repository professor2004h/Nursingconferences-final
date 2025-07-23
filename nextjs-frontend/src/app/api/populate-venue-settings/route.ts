import { NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🏨 Populating venue settings with default data...');
    
    // Check if venue settings already exist
    const existingSettings = await writeClient.fetch(`
      *[_type == "venueSettings"][0]{
        _id,
        venueName
      }
    `);

    const defaultData = {
      title: 'Venue & Hospitality',
      subtitle: 'Conference venue and accommodation information',
      venueName: 'ANA Crowne Plaza Hotel Narita',
      venueAddress: {
        streetAddress: '68 Horinouchi',
        city: 'Narita',
        state: 'Chiba',
        postalCode: '286-0107',
        country: 'Japan'
      },
      contactInformation: {
        phone: '+81 (0) 476 33 1354',
        email: 'contact@inovineconferences.com',
        organizerNote: 'While you are calling to hotel reception please mention name of the organizer INOVINE CONFERENCES'
      },
      checkInOut: {
        checkInTime: '2:00 PM',
        checkOutTime: '11:00 AM',
        groupRateNote: 'Group rate will be honored 3 days pre and post event days.'
      },
      amenities: [
        'Complimentary Breakfast',
        'Complimentary Wi-Fi',
        'Free On Site Parking',
        'In House Restaurant',
        'Gym'
      ],
      // Note: Venue images will be uploaded manually to Sanity Studio
      // The following are placeholder references that would be replaced with actual uploaded images
      venueImages: [
        {
          _type: 'image',
          alt: 'Mount Fuji with Chureito Pagoda and cherry blossoms',
          caption: 'Iconic view of Mount Fuji with traditional Japanese pagoda during cherry blossom season'
        },
        {
          _type: 'image',
          alt: 'Tokyo Tower illuminated at night',
          caption: 'Tokyo Tower glowing against the city skyline at sunset'
        },
        {
          _type: 'image',
          alt: 'Shinjuku Gyoen National Garden with cherry blossoms',
          caption: 'Beautiful cherry blossoms in Shinjuku Gyoen with Tokyo skyline in background'
        },
        {
          _type: 'image',
          alt: 'Sensoji Temple in Asakusa at night',
          caption: 'Historic Sensoji Temple beautifully illuminated in the evening'
        },
        {
          _type: 'image',
          alt: 'Tokyo cityscape with Mount Fuji and Tokyo Tower',
          caption: 'Stunning panoramic view of Tokyo with Mount Fuji and Tokyo Tower'
        }
      ],
      locationDescription: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Tokyo, the capital city of Japan, is a vibrant and bustling metropolis that is home to over 13 million people. Known for its cutting-edge technology, rich culture, and stunning architecture, Tokyo is a city like no other.'
            }
          ]
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Explore the city\'s many neighborhoods, from the bustling streets of Shibuya and Shinjuku to the serene gardens of Chiyoda and the historic temples of Asakusa. Indulge in the city\'s famous cuisine, from the freshest sushi and sashimi to hearty ramen and savory yakitori.'
            }
          ]
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'With its efficient transportation system, including the iconic Shinkansen bullet train, Tokyo is the perfect gateway to the rest of Japan. Whether you\'re interested in exploring the natural beauty of Mount Fuji, the ancient city of Kyoto, or the ski slopes of Hokkaido, Tokyo is the ideal starting point for your Japanese adventure.'
            }
          ]
        }
      ],
      mapConfiguration: {
        latitude: 35.7647,
        longitude: 140.3864,
        zoomLevel: 15,
        markerTitle: 'ANA Crowne Plaza Hotel Narita'
      },
      transportation: {
        title: 'Transportation',
        options: [
          {
            type: 'airport-shuttle',
            title: 'Airport Shuttle',
            description: 'Complimentary shuttle service from Narita International Airport',
            duration: '15 minutes',
            cost: 'Free'
          },
          {
            type: 'public-transit',
            title: 'Train Service',
            description: 'JR Narita Line and Keisei Main Line access',
            duration: '10-15 minutes to Narita Station',
            cost: '¥200-400'
          },
          {
            type: 'taxi-rideshare',
            title: 'Taxi Service',
            description: 'Direct taxi service from airport and city center',
            duration: '10-20 minutes',
            cost: '¥2,000-4,000'
          }
        ]
      },
      localAttractions: {
        title: 'Local Attractions',
        attractions: [
          {
            name: 'Naritasan Shinshoji Temple',
            description: 'Historic Buddhist temple complex with beautiful gardens',
            distance: '5 km',
            category: 'cultural'
          },
          {
            name: 'Narita Omotesando',
            description: 'Traditional shopping street with local crafts and cuisine',
            distance: '4 km',
            category: 'shopping'
          },
          {
            name: 'Shisui Premium Outlets',
            description: 'Large outlet mall with international and Japanese brands',
            distance: '8 km',
            category: 'shopping'
          },
          {
            name: 'Tokyo Disneyland',
            description: 'World-famous theme park and entertainment destination',
            distance: '45 km',
            category: 'entertainment'
          },
          {
            name: 'Tokyo Skytree',
            description: 'Iconic tower with observation decks and city views',
            distance: '60 km',
            category: 'cultural'
          },
          {
            name: 'Sensoji Temple',
            description: 'Ancient Buddhist temple in historic Asakusa district',
            distance: '65 km',
            category: 'historical'
          }
        ]
      },
      additionalInformation: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'If you have any queries or you need any assistance please mail to contact@inovineconferences.com or whatsapp at +1(408)-933-9154'
            }
          ]
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Tokyo offers a fascinating blend of traditional and modern culture. From ancient temples to futuristic streets, visitors can explore diverse cultural experiences, traditional Japanese arts and crafts, museums, galleries, and cultural centers to learn more about Japan\'s rich heritage.'
            }
          ]
        }
      ],
      isActive: true,
      lastUpdated: new Date().toISOString()
    };

    let result;
    if (existingSettings) {
      console.log('📝 Updating existing venue settings...');
      result = await writeClient
        .patch(existingSettings._id)
        .set(defaultData)
        .commit();
      console.log('✅ Successfully updated existing venue settings');
    } else {
      console.log('📄 Creating new venue settings...');
      result = await writeClient.create({
        _type: 'venueSettings',
        ...defaultData
      });
      console.log('✅ Successfully created new venue settings');
    }

    return NextResponse.json({
      success: true,
      message: existingSettings ? 'Venue settings updated successfully' : 'Venue settings created successfully',
      data: result
    });

  } catch (error) {
    console.error('❌ Error populating venue settings:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to populate venue settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
