const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'n3no08m3',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c'
});

async function checkBrochureSettings() {
  try {
    const query = `*[_type == "brochureSettings"] {
      _id,
      title,
      description,
      pdfFile {
        asset-> {
          _id,
          url,
          originalFilename,
          size,
          mimeType
        }
      },
      active,
      downloadCount,
      lastUpdated
    }`;
    
    const settings = await client.fetch(query);
    console.log('📄 Current Brochure Settings:');
    console.log(JSON.stringify(settings, null, 2));
    
    if (settings.length === 0) {
      console.log('❌ No brochure settings found!');
    } else {
      settings.forEach((setting, index) => {
        console.log(`\n📋 Setting ${index + 1}:`);
        console.log(`  Title: ${setting.title}`);
        console.log(`  Active: ${setting.active}`);
        console.log(`  PDF URL: ${setting.pdfFile?.asset?.url || 'No PDF'}`);
        console.log(`  PDF Filename: ${setting.pdfFile?.asset?.originalFilename || 'N/A'}`);
        console.log(`  Downloads: ${setting.downloadCount || 0}`);
      });
    }
  } catch (error) {
    console.error('❌ Error fetching brochure settings:', error);
  }
}

checkBrochureSettings();
