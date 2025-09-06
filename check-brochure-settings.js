const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skJo4iwMzLtavnRYqibHHTzDqOJc5UJTQE9JCv066MM6vWDFE6XEZBnV2XZTzbxE8BKTawmfQhPE2ZPwrLNP7CokAwUlJN5VeQWLuUiLFeZQfyiXeDdkAShynpyk1v4jWmcNAZDvph2QCuCFcJko5q0XAf123nDHp9VF4oRr7NnJh1NkEa6V'
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
