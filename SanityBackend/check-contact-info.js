const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'n3no08m3',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c'
});

async function checkContactInfo() {
  try {
    console.log('🔍 Checking current contact information in Sanity...\n');

    // Get site settings
    const siteSettings = await client.fetch(`*[_type == "siteSettings"][0]{
      _id,
      contactInfo{
        email,
        phone,
        whatsapp,
        address
      }
    }`);

    if (siteSettings) {
      console.log('📊 CURRENT CONTACT INFORMATION IN SANITY:');
      console.log('=====================================');
      console.log(`📧 Email: ${siteSettings.contactInfo?.email || 'NOT SET'}`);
      console.log(`📱 Phone: ${siteSettings.contactInfo?.phone || 'NOT SET'}`);
      console.log(`💬 WhatsApp: ${siteSettings.contactInfo?.whatsapp || 'NOT SET'}`);
      console.log(`📍 Address: ${siteSettings.contactInfo?.address || 'NOT SET'}`);
      console.log('=====================================\n');

      // Check if contact info exists
      if (!siteSettings.contactInfo) {
        console.log('❌ No contact information found in site settings!');
        console.log('🔧 You need to add contact information in Sanity Studio.');
      } else {
        console.log('✅ Contact information found in Sanity');
        
        // Show what needs to be updated in frontend
        console.log('🔧 FRONTEND HARDCODED VALUES TO UPDATE:');
        console.log('=====================================');
        console.log('Current hardcoded fallbacks in ContactAndAboutSection.tsx:');
        console.log('- Email: intelliglobalconferences@gmail.com');
        console.log('- Phone: +1 (470)-916-6880');
        console.log('- WhatsApp: +1 (470)-916-6880');
        console.log('- Address: NewYork');
        console.log('');
        console.log('Should be updated to match Sanity values above ☝️');
      }
    } else {
      console.log('❌ No site settings found!');
    }

  } catch (error) {
    console.error('❌ Error checking contact info:', error);
  }
}

checkContactInfo();
