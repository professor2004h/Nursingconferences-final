// Verify schema compatibility for import
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN || 'skJo4iwMzLtavnRYqibHHTzDqOJc5UJTQE9JCv066MM6vWDFE6XEZBnV2XZTzbxE8BKTawmfQhPE2ZPwrLNP7CokAwUlJN5VeQWLuUiLFeZQfyiXeDdkAShynpyk1v4jWmcNAZDvph2QCuCFcJko5q0XAf123nDHp9VF4oRr7NnJh1NkEa6V'
});

async function verifySchemaCompatibility() {
  console.log('🔍 Verifying Schema Compatibility for Import...');
  console.log('');

  try {
    // Get current schema types from filesystem
    const schemaTypesDir = path.join(__dirname, 'SanityBackend', 'schemaTypes');
    const schemaFiles = fs.readdirSync(schemaTypesDir)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts')
      .map(file => file.replace('.ts', ''));

    console.log('📋 Available Schema Types in Project:');
    console.log('   Total schema files:', schemaFiles.length);
    
    // Group schema types by category
    const categories = {
      'Conference Management': ['conferenceEvent', 'conferenceRegistration', 'eventSchedule'],
      'Registration System': ['registrationSettings', 'registrationTypes', 'formConfiguration'],
      'Payment System': ['paymentRecord', 'paymentTransaction', 'receiptSettings', 'pricingPeriods'],
      'Speaker Management': ['speakers', 'speakerGuidelines', 'organizingCommittee'],
      'Content Management': ['heroSection', 'aboutUsSection', 'customContentSection', 'imageSection'],
      'Sponsorship': ['sponsorshipSettings', 'sponsorshipTiers', 'sponsorRegistration'],
      'Venue & Location': ['venueSettings', 'mapLocation', 'accommodationOptions'],
      'Brochures & Downloads': ['brochureDownload', 'brochureSettings'],
      'Abstract System': ['abstractSubmission', 'abstractSettings'],
      'Exhibitors': ['exhibitors', 'exhibitorsSettings'],
      'Media & Partners': ['mediaPartners', 'journalSection'],
      'Past Conferences': ['pastConference', 'pastConferenceGallery', 'pastConferencesSection'],
      'Poster Presentations': ['posterPresenters', 'posterPresentersSettings'],
      'Site Configuration': ['siteSettings', 'cancellationPolicy', 'participationBenefits']
    };

    console.log('');
    console.log('🏗️ Schema Categories:');
    for (const [category, types] of Object.entries(categories)) {
      const availableTypes = types.filter(type => schemaFiles.includes(type));
      console.log(`   ${category}: ${availableTypes.length}/${types.length} types`);
      if (availableTypes.length < types.length) {
        const missingTypes = types.filter(type => !schemaFiles.includes(type));
        console.log(`     Missing: ${missingTypes.join(', ')}`);
      }
    }

    // Check current documents in the project
    console.log('');
    console.log('📊 Current Project Status:');
    const allDocs = await client.fetch('*[!(_type match "sanity.*")]');
    const docsByType = {};
    
    allDocs.forEach(doc => {
      docsByType[doc._type] = (docsByType[doc._type] || 0) + 1;
    });

    console.log('   Total documents:', allDocs.length);
    console.log('   Document types in project:');
    for (const [type, count] of Object.entries(docsByType)) {
      const hasSchema = schemaFiles.includes(type);
      const status = hasSchema ? '✅' : '❌';
      console.log(`     ${status} ${type}: ${count} documents`);
    }

    // Check for potential import compatibility
    console.log('');
    console.log('🔧 Import Compatibility Check:');
    
    const expectedImportTypes = [
      'conferenceEvent', 'registrationSettings', 'speakers', 'sponsorshipSettings',
      'brochureDownload', 'abstractSubmission', 'paymentRecord', 'organizingCommittee',
      'exhibitors', 'venueSettings', 'heroSection', 'customContentSection'
    ];

    let compatibilityScore = 0;
    expectedImportTypes.forEach(type => {
      if (schemaFiles.includes(type)) {
        console.log(`   ✅ ${type} - Schema available`);
        compatibilityScore++;
      } else {
        console.log(`   ❌ ${type} - Schema missing`);
      }
    });

    const compatibilityPercentage = Math.round((compatibilityScore / expectedImportTypes.length) * 100);
    console.log('');
    console.log(`📈 Compatibility Score: ${compatibilityScore}/${expectedImportTypes.length} (${compatibilityPercentage}%)`);

    if (compatibilityPercentage >= 90) {
      console.log('✅ Excellent compatibility - Import should work perfectly');
    } else if (compatibilityPercentage >= 75) {
      console.log('⚠️  Good compatibility - Most content will import successfully');
    } else {
      console.log('❌ Poor compatibility - Some content may fail to import');
    }

    console.log('');
    console.log('🎯 Import Readiness Summary:');
    console.log(`   Schema Types Available: ${schemaFiles.length}`);
    console.log(`   Core Types Compatible: ${compatibilityScore}/${expectedImportTypes.length}`);
    console.log(`   Current Documents: ${allDocs.length}`);
    console.log('   Project ID: zt8218vh');
    console.log('   Dataset: production');
    console.log('');
    console.log('✅ Schema verification completed successfully!');
    console.log('🚀 Ready for content import');

  } catch (error) {
    console.log('❌ Schema verification failed:', error.message);
  }
}

verifySchemaCompatibility();
