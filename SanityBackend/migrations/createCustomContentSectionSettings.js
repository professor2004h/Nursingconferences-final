/**
 * Migration script to create the Custom Content Section Settings document
 * This ensures the singleton document exists with default values and toggle functionality
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

const migration = async () => {
  console.log('🚀 Starting Custom Content Section Settings migration...');

  try {
    // Check if the document already exists
    const existingDoc = await client.fetch(
      `*[_type == "customContentSection" && _id == "customContentSection"][0]`
    );

    if (existingDoc) {
      console.log('✅ Custom Content Section Settings document already exists');
      
      // Check if it has the new showOnHomepage field
      if (existingDoc.showOnHomepage === undefined) {
        console.log('🔄 Adding showOnHomepage field to existing document...');
        
        await client
          .patch('customContentSection')
          .set({ showOnHomepage: true })
          .commit();
          
        console.log('✅ Added showOnHomepage field to existing document');
      }
      
      return;
    }

    // Create the singleton document with default values
    const customContentDoc = {
      _id: 'customContentSection',
      _type: 'customContentSection',
      title: 'Custom Content Section',
      showOnHomepage: true,
      primaryText: 'INSIGHTS',
      insights: 'Being part of a Scientific Seminar is a professionally very rewarding and enriching experience. Apart from socializing with the greatest kinds from across the Globe, we get the insights to the realm of new global trends, the talking shapes in the Global research laboratories. These sessions inspire many a practitioner minds for new beginnings that have the potential to transform the way we live today. As individuals we constantly seeking to advance our careers, these knowledge sharing sessions function as gateways to a new realm of opportunities unseen before.',
      targets: 'We are the pioneers in connecting people – bringing in the best minds to the table to resolve complex global human concerns to deliver simple usable solutions. We are in the critical path of bringing scientific innovations to the masses by enabling an ecosystem to key stake holders to express themselves their research findings. These research findings are the Critical links to shaping our future living – seen or unseen.',
    };

    console.log('📝 Creating Custom Content Section Settings document...');
    
    const result = await client.createOrReplace(customContentDoc);
    
    console.log('✅ Custom Content Section Settings document created successfully!');
    console.log('📄 Document ID:', result._id);
    console.log('🎯 Show on Homepage:', result.showOnHomepage);
    console.log('📝 Primary Text:', result.primaryText);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Run the migration
migration()
  .then(() => {
    console.log('🎉 Custom Content Section Settings migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
