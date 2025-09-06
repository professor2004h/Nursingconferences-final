const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function debugSanity() {
  try {
    console.log('🔍 Checking Sanity connection...');
    
    // Check if we can connect
    const allDocs = await client.fetch('*[_type == "heroSection"]');
    console.log('📄 Hero Section documents found:', allDocs.length);
    
    if (allDocs.length > 0) {
      console.log('📋 First hero section document:', JSON.stringify(allDocs[0], null, 2));
    } else {
      console.log('⚠️ No hero section documents found in Sanity');
      console.log('💡 You need to create a hero section document in Sanity Studio');
    }

    // Check all document types
    const allTypes = await client.fetch('*[]{_type} | order(_type) | {_type}');
    const uniqueTypes = [...new Set(allTypes.map(doc => doc._type))];
    console.log('📚 Available document types:', uniqueTypes);

  } catch (error) {
    console.error('❌ Sanity connection error:', error);
  }
}

debugSanity();
