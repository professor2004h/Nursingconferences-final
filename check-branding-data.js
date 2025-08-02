const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'n3no08m3',
  dataset: 'production',
  useCdn: false,
  token: 'skjc5mkFKiTdcpHQsCWU8p2mUXSlrlvzMpb9TiyRBOoKWOwVjGHLcVaD7cdkCopUZK767GIyCj26Qo4nfnout8TpPgACQdKxvsfetjD1RBbpwQJUmcBXMvXtdGDbXze4YTkc3D8uLLJQBYBy920sd2RNQy1TTwTbbyGxzeyDnTyqVkaMLNgC',
  apiVersion: '2023-05-03'
});

async function checkBrandingData() {
  try {
    console.log('Checking all document types...');
    
    // Check all documents
    const allDocs = await client.fetch(`*[]{_type, _id, title}`);
    console.log('All documents:', allDocs);
    
    // Check specifically for aboutOrganization
    const aboutOrg = await client.fetch(`*[_type == "aboutOrganization"]`);
    console.log('About Organization documents:', aboutOrg);
    
    // Check for any document with branding fields
    const brandingDocs = await client.fetch(`*[defined(primaryBrandName) || defined(secondaryBrandText)]`);
    console.log('Documents with branding fields:', brandingDocs);
    
  } catch (error) {
    console.error('Error checking branding data:', error);
  }
}

checkBrandingData();
