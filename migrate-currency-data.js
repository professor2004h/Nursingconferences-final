// Migration script to populate EUR and GBP pricing based on existing USD prices
// Run this script to add multi-currency support to existing data

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './nextjs-frontend/.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

// Conversion rates (approximate - should be updated with current rates)
const CONVERSION_RATES = {
  USD_TO_EUR: 0.85,
  USD_TO_GBP: 0.75,
};

async function migrateRegistrationTypes() {
  console.log('🔄 Migrating registration types...');
  
  try {
    // Fetch all registration types
    const registrationTypes = await client.fetch(`
      *[_type == "registrationTypes"] {
        _id,
        name,
        earlyBirdPrice,
        nextRoundPrice,
        onSpotPrice,
        earlyBirdPriceEUR,
        nextRoundPriceEUR,
        onSpotPriceEUR,
        earlyBirdPriceGBP,
        nextRoundPriceGBP,
        onSpotPriceGBP
      }
    `);

    console.log(`Found ${registrationTypes.length} registration types`);

    for (const regType of registrationTypes) {
      const updates = {};
      let needsUpdate = false;

      // Calculate EUR prices if not set
      if (!regType.earlyBirdPriceEUR && regType.earlyBirdPrice) {
        updates.earlyBirdPriceEUR = Math.round(regType.earlyBirdPrice * CONVERSION_RATES.USD_TO_EUR);
        needsUpdate = true;
      }
      if (!regType.nextRoundPriceEUR && regType.nextRoundPrice) {
        updates.nextRoundPriceEUR = Math.round(regType.nextRoundPrice * CONVERSION_RATES.USD_TO_EUR);
        needsUpdate = true;
      }
      if (!regType.onSpotPriceEUR && regType.onSpotPrice) {
        updates.onSpotPriceEUR = Math.round(regType.onSpotPrice * CONVERSION_RATES.USD_TO_EUR);
        needsUpdate = true;
      }

      // Calculate GBP prices if not set
      if (!regType.earlyBirdPriceGBP && regType.earlyBirdPrice) {
        updates.earlyBirdPriceGBP = Math.round(regType.earlyBirdPrice * CONVERSION_RATES.USD_TO_GBP);
        needsUpdate = true;
      }
      if (!regType.nextRoundPriceGBP && regType.nextRoundPrice) {
        updates.nextRoundPriceGBP = Math.round(regType.nextRoundPrice * CONVERSION_RATES.USD_TO_GBP);
        needsUpdate = true;
      }
      if (!regType.onSpotPriceGBP && regType.onSpotPrice) {
        updates.onSpotPriceGBP = Math.round(regType.onSpotPrice * CONVERSION_RATES.USD_TO_GBP);
        needsUpdate = true;
      }

      if (needsUpdate) {
        await client.patch(regType._id).set(updates).commit();
        console.log(`✅ Updated ${regType.name}:`, updates);
      } else {
        console.log(`⏭️  Skipped ${regType.name} (already has multi-currency prices)`);
      }
    }

    console.log('✅ Registration types migration completed');
  } catch (error) {
    console.error('❌ Error migrating registration types:', error);
  }
}

async function migrateSponsorshipTiers() {
  console.log('🔄 Migrating sponsorship tiers...');
  
  try {
    // Fetch all sponsorship tiers
    const sponsorshipTiers = await client.fetch(`
      *[_type == "sponsorshipTiers"] {
        _id,
        name,
        price,
        priceEUR,
        priceGBP
      }
    `);

    console.log(`Found ${sponsorshipTiers.length} sponsorship tiers`);

    for (const tier of sponsorshipTiers) {
      const updates = {};
      let needsUpdate = false;

      // Calculate EUR price if not set
      if (!tier.priceEUR && tier.price) {
        updates.priceEUR = Math.round(tier.price * CONVERSION_RATES.USD_TO_EUR);
        needsUpdate = true;
      }

      // Calculate GBP price if not set
      if (!tier.priceGBP && tier.price) {
        updates.priceGBP = Math.round(tier.price * CONVERSION_RATES.USD_TO_GBP);
        needsUpdate = true;
      }

      if (needsUpdate) {
        await client.patch(tier._id).set(updates).commit();
        console.log(`✅ Updated ${tier.name}:`, updates);
      } else {
        console.log(`⏭️  Skipped ${tier.name} (already has multi-currency prices)`);
      }
    }

    console.log('✅ Sponsorship tiers migration completed');
  } catch (error) {
    console.error('❌ Error migrating sponsorship tiers:', error);
  }
}

async function migrateAccommodationOptions() {
  console.log('🔄 Migrating accommodation options...');
  
  try {
    // Fetch all accommodation options
    const accommodationOptions = await client.fetch(`
      *[_type == "accommodationOptions"] {
        _id,
        hotelName,
        roomOptions[] {
          roomType,
          pricePerNight,
          pricePerNightEUR,
          pricePerNightGBP
        }
      }
    `);

    console.log(`Found ${accommodationOptions.length} accommodation options`);

    for (const accommodation of accommodationOptions) {
      let needsUpdate = false;
      const updatedRoomOptions = accommodation.roomOptions?.map(room => {
        const updatedRoom = { ...room };

        // Calculate EUR price if not set
        if (!room.pricePerNightEUR && room.pricePerNight) {
          updatedRoom.pricePerNightEUR = Math.round(room.pricePerNight * CONVERSION_RATES.USD_TO_EUR);
          needsUpdate = true;
        }

        // Calculate GBP price if not set
        if (!room.pricePerNightGBP && room.pricePerNight) {
          updatedRoom.pricePerNightGBP = Math.round(room.pricePerNight * CONVERSION_RATES.USD_TO_GBP);
          needsUpdate = true;
        }

        return updatedRoom;
      });

      if (needsUpdate) {
        await client.patch(accommodation._id).set({ roomOptions: updatedRoomOptions }).commit();
        console.log(`✅ Updated ${accommodation.hotelName} room options`);
      } else {
        console.log(`⏭️  Skipped ${accommodation.hotelName} (already has multi-currency prices)`);
      }
    }

    console.log('✅ Accommodation options migration completed');
  } catch (error) {
    console.error('❌ Error migrating accommodation options:', error);
  }
}

async function runMigration() {
  console.log('🚀 Starting multi-currency data migration...');
  console.log(`Using conversion rates: USD to EUR = ${CONVERSION_RATES.USD_TO_EUR}, USD to GBP = ${CONVERSION_RATES.USD_TO_GBP}`);
  
  try {
    await migrateRegistrationTypes();
    await migrateSponsorshipTiers();
    await migrateAccommodationOptions();
    
    console.log('🎉 Migration completed successfully!');
    console.log('📝 Note: You can now edit EUR and GBP prices independently in Sanity Studio');
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
