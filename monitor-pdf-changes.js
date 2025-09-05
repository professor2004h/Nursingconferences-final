const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'n3no08m3',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c'
});

async function monitorPDFChanges() {
  console.log('🔄 Monitoring PDF changes...');
  console.log('Upload a new PDF in Sanity Studio and watch for changes here.\n');
  
  let lastUpdate = null;
  let lastFilename = null;
  let lastURL = null;
  
  const checkForChanges = async () => {
    try {
      const doc = await client.fetch(`*[_type == "brochureSettings" && _id == "brochureSettings"][0] {
        pdfFile {
          asset-> {
            originalFilename,
            url
          }
        },
        _updatedAt
      }`);
      
      if (doc) {
        const currentUpdate = doc._updatedAt;
        const currentFilename = doc.pdfFile?.asset?.originalFilename;
        const currentURL = doc.pdfFile?.asset?.url;
        
        if (lastUpdate === null) {
          // First check
          lastUpdate = currentUpdate;
          lastFilename = currentFilename;
          lastURL = currentURL;
          console.log(`📋 Initial state:`);
          console.log(`  PDF: ${currentFilename || 'No PDF'}`);
          console.log(`  Updated: ${currentUpdate}`);
          console.log(`  URL: ${currentURL || 'No URL'}`);
          console.log('\n⏳ Waiting for changes...\n');
        } else if (currentUpdate !== lastUpdate || currentFilename !== lastFilename || currentURL !== lastURL) {
          // Change detected!
          console.log(`🎉 CHANGE DETECTED! ${new Date().toLocaleTimeString()}`);
          console.log(`📄 Old PDF: ${lastFilename || 'No PDF'}`);
          console.log(`📄 New PDF: ${currentFilename || 'No PDF'}`);
          console.log(`🔗 Old URL: ${lastURL || 'No URL'}`);
          console.log(`🔗 New URL: ${currentURL || 'No URL'}`);
          console.log(`⏰ Updated: ${currentUpdate}`);
          
          // Update tracking variables
          lastUpdate = currentUpdate;
          lastFilename = currentFilename;
          lastURL = currentURL;
          
          console.log('\n✅ Change successfully detected in Sanity!');
          console.log('Now test the frontend to see if it reflects the change.\n');
          console.log('⏳ Continuing to monitor for more changes...\n');
        }
      }
    } catch (error) {
      console.error('❌ Error checking for changes:', error.message);
    }
  };
  
  // Check immediately
  await checkForChanges();
  
  // Then check every 2 seconds
  const interval = setInterval(checkForChanges, 2000);
  
  // Stop after 5 minutes
  setTimeout(() => {
    clearInterval(interval);
    console.log('\n⏹️ Monitoring stopped after 5 minutes.');
    console.log('Run the script again if you want to continue monitoring.');
  }, 5 * 60 * 1000);
  
  console.log('Press Ctrl+C to stop monitoring early.');
}

monitorPDFChanges();
