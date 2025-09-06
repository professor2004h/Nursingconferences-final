const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function testColorControls() {
  try {
    console.log('🔍 Testing Past Conferences Section Color Controls...\n');
    
    // Check if the document exists
    const query = `*[_type == "pastConferencesSection"]{
      _id,
      title,
      isActive,
      overlayColor,
      overlayOpacity,
      backgroundImage,
      backgroundPosition,
      backgroundSize
    }`;
    
    const documents = await client.fetch(query);
    console.log(`📊 Found ${documents.length} pastConferencesSection document(s)\n`);
    
    if (documents.length === 0) {
      console.log('❌ No pastConferencesSection documents found!');
      console.log('🔧 Creating a default document...\n');
      
      // Create a default document
      const newDoc = await client.create({
        _type: 'pastConferencesSection',
        title: 'Past Conferences Section Styling',
        isActive: true,
        overlayColor: {
          hex: '#1e293b',
          alpha: 0.8
        },
        overlayOpacity: 80,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      });
      
      console.log('✅ Created new document:', newDoc._id);
      console.log('📋 Document details:', JSON.stringify(newDoc, null, 2));
      
    } else {
      documents.forEach((doc, index) => {
        console.log(`📋 Document ${index + 1}:`);
        console.log('  ID:', doc._id);
        console.log('  Title:', doc.title);
        console.log('  Active:', doc.isActive);
        console.log('  Overlay Color:', doc.overlayColor);
        console.log('  Overlay Opacity:', doc.overlayOpacity);
        console.log('  Background Position:', doc.backgroundPosition);
        console.log('  Background Size:', doc.backgroundSize);
        console.log('  Has Background Image:', !!doc.backgroundImage);
        console.log('');
      });
    }
    
    // Test updating the color controls
    if (documents.length > 0) {
      const docId = documents[0]._id;
      console.log(`🔧 Testing color control updates on document: ${docId}\n`);
      
      // Test updating overlay color
      const updatedDoc = await client
        .patch(docId)
        .set({
          overlayColor: {
            hex: '#dc2626', // red-600
            alpha: 0.7
          },
          overlayOpacity: 70,
          isActive: true
        })
        .commit();
      
      console.log('✅ Successfully updated color controls!');
      console.log('📋 Updated document:', JSON.stringify(updatedDoc, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error testing color controls:', error);
  }
}

testColorControls();
