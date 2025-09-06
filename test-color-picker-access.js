const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function testColorPickerAccess() {
  try {
    console.log('🔍 Testing color picker field access...');
    
    // First, try to read the document
    const readQuery = '*[_type == "pastConferencesSection"][0]{ _id, title, overlayColor, overlayOpacity, isActive }';
    const document = await client.fetch(readQuery);
    
    if (!document) {
      console.log('❌ No pastConferencesSection document found');
      return;
    }
    
    console.log('✅ Document found:', {
      id: document._id,
      title: document.title,
      overlayColor: document.overlayColor,
      overlayOpacity: document.overlayOpacity,
      isActive: document.isActive
    });
    
    // Test write access by attempting to update the document
    console.log('🔧 Testing write access...');
    
    const updateResult = await client
      .patch(document._id)
      .set({
        overlayColor: {
          _type: 'color',
          hex: '#ff0000',
          alpha: 0.5
        }
      })
      .commit();
      
    console.log('✅ Write access successful! Updated document:', updateResult._id);
    
    // Revert the change
    await client
      .patch(document._id)
      .set({
        overlayColor: {
          _type: 'color',
          hex: '#1e293b',
          alpha: 0.8
        }
      })
      .commit();
      
    console.log('✅ Reverted color back to default');
    
  } catch (error) {
    console.error('❌ Error testing color picker access:', error.message);
    
    if (error.message.includes('Insufficient permissions')) {
      console.log('🔐 Authentication issue detected - user needs to sign in to Sanity Studio');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('🔌 Connection issue - Sanity backend may not be running');
    } else {
      console.log('🐛 Other error:', error);
    }
  }
}

testColorPickerAccess();
