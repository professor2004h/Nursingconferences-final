import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test config API called');

    // Return a simple test response
    const testData = {
      pricingPeriods: [
        {
          _id: "test1",
          periodId: "earlyBird",
          title: "Early Bird Registration",
          startDate: "2025-01-01T00:00:00Z",
          endDate: "2025-04-26T23:59:59Z",
          isActive: false,
          displayOrder: 1,
          description: "Special early bird pricing",
          highlightColor: { hex: "#10b981" }
        },
        {
          _id: "test2", 
          periodId: "nextRound",
          title: "Mid Term Registration",
          startDate: "2025-04-27T00:00:00Z",
          endDate: "2025-07-22T23:59:59Z",
          isActive: true,
          displayOrder: 2,
          description: "Standard pricing",
          highlightColor: { hex: "#f59e0b" }
        },
        {
          _id: "test3",
          periodId: "spotRegistration", 
          title: "Onspot Registration",
          startDate: "2025-07-23T00:00:00Z",
          endDate: "2025-12-31T23:59:59Z",
          isActive: false,
          displayOrder: 3,
          description: "Last minute pricing",
          highlightColor: { hex: "#ef4444" }
        }
      ],
      activePeriod: {
        _id: "test2",
        periodId: "nextRound",
        title: "Mid Term Registration",
        startDate: "2025-04-27T00:00:00Z",
        endDate: "2025-07-22T23:59:59Z",
        isActive: true,
        displayOrder: 2,
        description: "Standard pricing",
        highlightColor: { hex: "#f59e0b" }
      },
      registrationTypes: [
        {
          _id: "type1",
          name: "Speaker Registration",
          category: "speaker",
          description: "For conference speakers and presenters",
          displayOrder: 1,
          isActive: true,
          pricingByPeriod: {
            earlyBird: {
              academiaPrice: 799,
              businessPrice: 999,
              period: { _id: "test1", periodId: "earlyBird", title: "Early Bird Registration" }
            },
            nextRound: {
              academiaPrice: 899,
              businessPrice: 1099,
              period: { _id: "test2", periodId: "nextRound", title: "Mid Term Registration" }
            },
            spotRegistration: {
              academiaPrice: 999,
              businessPrice: 1199,
              period: { _id: "test3", periodId: "spotRegistration", title: "Onspot Registration" }
            }
          }
        },
        {
          _id: "type2",
          name: "Delegate",
          category: "delegate",
          description: "For conference attendees and delegates",
          displayOrder: 2,
          isActive: true,
          pricingByPeriod: {
            earlyBird: {
              academiaPrice: 699,
              businessPrice: 799,
              period: { _id: "test1", periodId: "earlyBird", title: "Early Bird Registration" }
            },
            nextRound: {
              academiaPrice: 799,
              businessPrice: 899,
              period: { _id: "test2", periodId: "nextRound", title: "Mid Term Registration" }
            },
            spotRegistration: {
              academiaPrice: 899,
              businessPrice: 999,
              period: { _id: "test3", periodId: "spotRegistration", title: "Onspot Registration" }
            }
          }
        },
        {
          _id: "type3",
          name: "Student",
          category: "student",
          description: "For students with valid student ID",
          displayOrder: 3,
          isActive: true,
          pricingByPeriod: {
            earlyBird: {
              academiaPrice: 399,
              businessPrice: 399,
              period: { _id: "test1", periodId: "earlyBird", title: "Early Bird Registration" }
            },
            nextRound: {
              academiaPrice: 499,
              businessPrice: 499,
              period: { _id: "test2", periodId: "nextRound", title: "Mid Term Registration" }
            },
            spotRegistration: {
              academiaPrice: 599,
              businessPrice: 599,
              period: { _id: "test3", periodId: "spotRegistration", title: "Onspot Registration" }
            }
          }
        },
        {
          _id: "type4",
          name: "Poster Presentation",
          category: "poster",
          description: "For poster presentation participants",
          displayOrder: 4,
          isActive: true,
          pricingByPeriod: {
            earlyBird: {
              academiaPrice: 499,
              businessPrice: 599,
              period: { _id: "test1", periodId: "earlyBird", title: "Early Bird Registration" }
            },
            nextRound: {
              academiaPrice: 599,
              businessPrice: 699,
              period: { _id: "test2", periodId: "nextRound", title: "Mid Term Registration" }
            },
            spotRegistration: {
              academiaPrice: 699,
              businessPrice: 799,
              period: { _id: "test3", periodId: "spotRegistration", title: "Onspot Registration" }
            }
          }
        },
        {
          _id: "type5",
          name: "Online",
          category: "online",
          description: "For virtual conference attendance",
          displayOrder: 5,
          isActive: true,
          pricingByPeriod: {
            earlyBird: {
              academiaPrice: 200,
              businessPrice: 300,
              period: { _id: "test1", periodId: "earlyBird", title: "Early Bird Registration" }
            },
            nextRound: {
              academiaPrice: 300,
              businessPrice: 400,
              period: { _id: "test2", periodId: "nextRound", title: "Mid Term Registration" }
            },
            spotRegistration: {
              academiaPrice: 400,
              businessPrice: 500,
              period: { _id: "test3", periodId: "spotRegistration", title: "Onspot Registration" }
            }
          }
        },
        {
          _id: "type6",
          name: "Accompanying Person",
          category: "accompanying",
          description: "For accompanying persons/guests",
          displayOrder: 6,
          isActive: true,
          pricingByPeriod: {
            earlyBird: {
              academiaPrice: 250,
              businessPrice: 250,
              period: { _id: "test1", periodId: "earlyBird", title: "Early Bird Registration" }
            },
            nextRound: {
              academiaPrice: 300,
              businessPrice: 300,
              period: { _id: "test2", periodId: "nextRound", title: "Mid Term Registration" }
            },
            spotRegistration: {
              academiaPrice: 350,
              businessPrice: 350,
              period: { _id: "test3", periodId: "spotRegistration", title: "Onspot Registration" }
            }
          }
        }
      ],
      sponsorshipTiers: [],
      accommodationOptions: [
        {
          _id: "hotel1",
          hotelName: "Grand Convention Hotel",
          hotelCategory: "5star",
          description: "Luxury 5-star hotel adjacent to the conference venue with premium amenities.",
          location: {
            address: "123 Conference Boulevard, New York, NY 10001",
            distanceFromVenue: "Walking distance (2 minutes)",
            transportationIncluded: true
          },
          roomOptions: [
            {
              roomType: "single",
              pricePerNight: 180,
              roomDescription: "Deluxe single room with city view, king bed, and premium amenities",
              maxGuests: 1,
              isAvailable: true
            },
            {
              roomType: "double",
              pricePerNight: 250,
              roomDescription: "Deluxe double room with city view, two queen beds, and premium amenities",
              maxGuests: 2,
              isAvailable: true
            }
          ],
          amenities: [
            "Free WiFi",
            "24/7 Room Service",
            "Fitness Center",
            "Business Center",
            "Concierge Service",
            "Valet Parking"
          ],
          isActive: true,
          displayOrder: 1,
          maxRooms: 100,
          currentBookings: 15
        },
        {
          _id: "hotel2",
          hotelName: "Business Plaza Hotel",
          hotelCategory: "4star",
          description: "Modern 4-star business hotel with excellent conference facilities.",
          location: {
            address: "456 Business District, New York, NY 10002",
            distanceFromVenue: "5 minutes by shuttle",
            transportationIncluded: true
          },
          roomOptions: [
            {
              roomType: "single",
              pricePerNight: 120,
              roomDescription: "Comfortable single room with work desk and business amenities",
              maxGuests: 1,
              isAvailable: true
            },
            {
              roomType: "double",
              pricePerNight: 180,
              roomDescription: "Spacious double room with two beds and business amenities",
              maxGuests: 2,
              isAvailable: true
            }
          ],
          amenities: [
            "Free WiFi",
            "Business Center",
            "Shuttle Service",
            "Meeting Rooms",
            "Restaurant"
          ],
          isActive: true,
          displayOrder: 2,
          maxRooms: 80,
          currentBookings: 25
        }
      ],
      formConfig: {
        countries: [
          { code: "US", name: "United States", isActive: true },
          { code: "CA", name: "Canada", isActive: true },
          { code: "GB", name: "United Kingdom", isActive: true }
        ],
        abstractCategories: [
          { value: "poster", label: "Poster", isActive: true },
          { value: "oral", label: "Oral", isActive: true },
          { value: "delegate", label: "Delegate", isActive: true }
        ],
        titleOptions: [
          { value: "mr", label: "Mr.", isActive: true },
          { value: "mrs", label: "Mrs.", isActive: true },
          { value: "dr", label: "Dr.", isActive: true }
        ],
        accommodationNightOptions: [
          { nights: 2, label: "2 Nights", isActive: true },
          { nights: 3, label: "3 Nights", isActive: true },
          { nights: 5, label: "5 Nights", isActive: true }
        ]
      },
      registrationSettings: {
        registrationStatus: { isOpen: true }
      },
      currentDate: new Date().toISOString(),
      lastFetched: new Date().toISOString()
    };

    console.log('✅ Test config returning data');
    return NextResponse.json(testData);

  } catch (error) {
    console.error('❌ Test config error:', error);
    return NextResponse.json(
      { error: 'Test config failed' },
      { status: 500 }
    );
  }
}
