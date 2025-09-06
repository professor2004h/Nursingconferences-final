// Test script to verify Sanity CMS contact information integration
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false, // Disable CDN to get fresh data
  apiVersion: '2023-05-03',
});

async function testContactInfo() {
  console.log('🧪 Testing Sanity CMS Contact Information Integration');
  console.log('====================================================');
  console.log('');

  try {
    // Test site settings query - exactly as used in frontend
    const query = `*[_type == "siteSettings"][0]{
      _id,
      logo{
        asset->{
          _id,
          url
        },
        alt
      },
      favicon{
        asset->{
          _id,
          url
        }
      },
      siteDescription,
      headerVisibility,
      contactInfo,
      socialMedia,
      seo,
      journal,
      adminSettings
    }`;

    console.log('📡 Fetching site settings from Sanity CMS...');
    const siteSettings = await client.fetch(query);

    console.log('✅ Raw Sanity Response:');
    console.log(JSON.stringify(siteSettings, null, 2));
    console.log('');

    if (siteSettings) {
      console.log('📋 Contact Information Analysis:');
      console.log('================================');

      if (siteSettings.contactInfo) {
        console.log('✅ Contact Info Object Found:');
        console.log('  📧 Email:', siteSettings.contactInfo.email || 'NOT SET');
        console.log('  📞 Phone:', siteSettings.contactInfo.phone || 'NOT SET');
        console.log('  💬 WhatsApp:', siteSettings.contactInfo.whatsapp || 'NOT SET');
        console.log('  📍 Address:', siteSettings.contactInfo.address || 'NOT SET');
        console.log('');

        // Test what the frontend would display
        console.log('🖥️ Frontend Display Values:');
        console.log('============================');
        console.log('  📧 Email Display:', siteSettings.contactInfo.email || "intelliglobalconferences@gmail.com");
        console.log('  📞 Phone Display:', siteSettings.contactInfo.phone || "+442045718752");
        console.log('  💬 WhatsApp Display:', siteSettings.contactInfo.whatsapp || "+44 20 4571 8752");
        console.log('  📍 Address Display:', siteSettings.contactInfo.address || "7 Bell Yard, London, WC2A 2JR, United Kingdom");
        console.log('');

        // Test WhatsApp URL generation
        const whatsappNumber = siteSettings.contactInfo.whatsapp || "442045718752";
        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;
        console.log('💬 WhatsApp URL:', whatsappUrl);
        console.log('');

      } else {
        console.log('❌ Contact Info Object NOT FOUND');
        console.log('   This means the contactInfo field is missing from Sanity CMS');
      }
    } else {
      console.log('❌ No site settings found in Sanity CMS');
      console.log('   Make sure you have created a Site Settings document');
    }

  } catch (error) {
    console.error('❌ Error fetching contact information:', error);
    console.error('Error details:', error.message);
  }
}

// Run the test
testContactInfo();
