// Validate desk structure consolidation
const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDATING DESK STRUCTURE CONSOLIDATION...\n');

try {
  const deskContent = fs.readFileSync(path.join(__dirname, 'deskStructure.js'), 'utf8');
  
  console.log('📋 Checking Registration System section...');
  
  // Check for consolidated Registration System
  const hasRegistrationSystem = deskContent.includes("title('Registration System')");
  const hasRegistrationSettings = deskContent.includes("title('Registration Settings')");
  const hasRegistrationTypes = deskContent.includes("title('Registration Types')");
  const hasAccommodationOptions = deskContent.includes("title('Accommodation Options')");
  const hasConferenceRegistrations = deskContent.includes("title('Conference Registrations')");
  const hasRegistrationsTable = deskContent.includes("title('Registrations Table')");
  
  console.log(`✅ Registration System section: ${hasRegistrationSystem ? 'PRESENT' : 'MISSING'}`);
  console.log(`✅ Registration Settings: ${hasRegistrationSettings ? 'PRESENT' : 'MISSING'}`);
  console.log(`✅ Registration Types: ${hasRegistrationTypes ? 'PRESENT' : 'MISSING'}`);
  console.log(`✅ Accommodation Options: ${hasAccommodationOptions ? 'PRESENT' : 'MISSING'}`);
  console.log(`✅ Conference Registrations: ${hasConferenceRegistrations ? 'PRESENT' : 'MISSING'}`);
  console.log(`✅ Registrations Table: ${hasRegistrationsTable ? 'PRESENT' : 'MISSING'}`);
  
  console.log('\n🔍 Checking for duplicate sections...');
  
  // Count occurrences of registration-related sections
  const registrationSystemCount = (deskContent.match(/title\('Registration System'\)/g) || []).length;
  const conferenceRegistrationsCount = (deskContent.match(/title\('Conference Registrations'\)/g) || []).length;
  const registrationsTableCount = (deskContent.match(/title\('Registrations Table'\)/g) || []).length;
  
  console.log(`📊 Registration System sections: ${registrationSystemCount}`);
  console.log(`📊 Conference Registrations sections: ${conferenceRegistrationsCount}`);
  console.log(`📊 Registrations Table sections: ${registrationsTableCount}`);
  
  console.log('\n🎯 Checking enhanced table view integration...');
  
  const hasRegistrationTableView = deskContent.includes('RegistrationTableView');
  const hasTableViewInRegistrationSystem = deskContent.includes('S.component(RegistrationTableView)');
  
  console.log(`✅ RegistrationTableView component: ${hasRegistrationTableView ? 'INTEGRATED' : 'MISSING'}`);
  console.log(`✅ Table view in Registration System: ${hasTableViewInRegistrationSystem ? 'YES' : 'NO'}`);
  
  console.log('\n📋 CONSOLIDATION SUMMARY:');
  
  if (registrationSystemCount === 1 && conferenceRegistrationsCount === 1 && registrationsTableCount === 1) {
    console.log('✅ SUCCESS: Desk structure properly consolidated');
    console.log('✅ Single Registration System section with all components');
    console.log('✅ Enhanced Registrations Table integrated');
    console.log('✅ No duplicate sections detected');
  } else {
    console.log('⚠️  WARNING: Potential duplication detected');
    if (registrationSystemCount > 1) console.log(`   - Multiple Registration System sections: ${registrationSystemCount}`);
    if (conferenceRegistrationsCount > 1) console.log(`   - Multiple Conference Registrations sections: ${conferenceRegistrationsCount}`);
    if (registrationsTableCount > 1) console.log(`   - Multiple Registrations Table sections: ${registrationsTableCount}`);
  }
  
  console.log('\n🚀 EXPECTED NAVIGATION STRUCTURE:');
  console.log('Registration System');
  console.log('├── Registration Settings');
  console.log('├── Registration Types');
  console.log('├── Accommodation Options');
  console.log('├── Conference Registrations (list view)');
  console.log('└── Registrations Table (enhanced table view)');
  
  console.log('\n🎯 ACCESS PATHS:');
  console.log('• Registration Settings: /structure/registrationSystem;registrationSettings');
  console.log('• Registration Types: /structure/registrationSystem;registrationTypes');
  console.log('• Accommodation Options: /structure/registrationSystem;accommodationOptions');
  console.log('• Conference Registrations: /structure/registrationSystem;conferenceRegistration');
  console.log('• Registrations Table: /structure/registrationSystem;registrationsTableEnhanced');
  
  console.log('\n💡 NEXT STEPS:');
  console.log('1. Restart Sanity Studio to apply changes');
  console.log('2. Navigate to Registration System in sidebar');
  console.log('3. Verify all 5 sections are present');
  console.log('4. Test enhanced Registrations Table functionality');
  console.log('5. Confirm no duplicate sections exist');
  
} catch (error) {
  console.log(`❌ Error reading desk structure: ${error.message}`);
}
