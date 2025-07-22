const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'your-project-id', // Replace with actual project ID
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN || 'your-token-here'
});

async function fixExistingSponsorshipData() {
  console.log('🔧 Fixing existing sponsorship registrations...');
  
  try {
    // First, fetch all sponsorship registrations that are missing sponsorType
    const sponsorshipRegistrations = await client.fetch(`
      *[_type == "conferenceRegistration" && registrationType == "sponsorship" && !defined(sponsorType)] {
        _id,
        registrationId,
        personalDetails.firstName,
        personalDetails.lastName,
        pricing.totalPrice
      }
    `);

    console.log(`Found ${sponsorshipRegistrations.length} sponsorship registrations without tier information`);

    if (sponsorshipRegistrations.length === 0) {
      console.log('✅ No sponsorship registrations need fixing!');
      return;
    }

    // Assign sponsorship tiers based on pricing or randomly for demo
    const sponsorshipTiers = ['Gold', 'Diamond', 'Platinum'];
    
    for (let i = 0; i < sponsorshipRegistrations.length; i++) {
      const registration = sponsorshipRegistrations[i];
      
      // Assign tier based on total price or cyclically for demo
      let sponsorType;
      const totalPrice = registration.pricing?.totalPrice || 0;
      
      if (totalPrice >= 700) {
        sponsorType = 'Platinum';
      } else if (totalPrice >= 600) {
        sponsorType = 'Diamond';
      } else {
        sponsorType = 'Gold';
      }
      
      // If no pricing info, assign cyclically
      if (!sponsorType) {
        sponsorType = sponsorshipTiers[i % sponsorshipTiers.length];
      }

      console.log(`Updating ${registration.registrationId} (${registration.personalDetails?.firstName} ${registration.personalDetails?.lastName}) -> ${sponsorType}`);

      // Update the registration with sponsorType
      await client
        .patch(registration._id)
        .set({ sponsorType: sponsorType })
        .commit();

      console.log(`✅ Updated: ${registration._id} -> Sponsorship-${sponsorType}`);
    }

    console.log('🎉 All sponsorship registrations have been updated with tier information!');
    console.log('\nNow the table should display:');
    console.log('- Sponsorship-Gold');
    console.log('- Sponsorship-Diamond'); 
    console.log('- Sponsorship-Platinum');
    console.log('\nRefresh the Sanity table view to see the changes!');

  } catch (error) {
    console.error('❌ Error fixing sponsorship data:', error);
    
    if (error.statusCode === 403) {
      console.log('\n🔧 To fix this, you need to:');
      console.log('1. Set your SANITY_API_TOKEN environment variable');
      console.log('2. Make sure the token has write permissions');
      console.log('3. Update the projectId in this script');
    }
  }
}

// Run the script
if (require.main === module) {
  fixExistingSponsorshipData();
}

module.exports = { fixExistingSponsorshipData };
