/**
 * Migration Script: Add Country Field to Brochure Downloads
 * 
 * This script adds the "country" field to all existing brochureDownload documents
 * that don't already have this field, setting the default value to "India".
 * 
 * Usage:
 * 1. Run this script in Sanity Studio Vision tool
 * 2. Or execute via Sanity CLI: sanity exec migrations/add-country-to-brochure-downloads.js --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function addCountryFieldToBrochureDownloads() {
  console.log('🔄 Starting migration: Add country field to brochure downloads...')
  
  try {
    // Fetch all brochure downloads that don't have country field
    const query = `*[_type == "brochureDownload" && !defined(country)] {
      _id,
      _rev,
      fullName,
      email,
      organization
    }`
    
    const documentsToUpdate = await client.fetch(query)
    console.log(`📊 Found ${documentsToUpdate.length} brochure download records to update`)
    
    if (documentsToUpdate.length === 0) {
      console.log('✅ No brochure download records need updating. Migration complete!')
      return
    }
    
    // Create transaction to update all documents
    const transaction = client.transaction()
    
    documentsToUpdate.forEach((doc) => {
      console.log(`📝 Adding country field to brochure download: ${doc.fullName} (${doc.email})`)
      
      transaction.patch(doc._id, {
        set: {
          country: 'India'
        }
      })
    })
    
    // Execute the transaction
    console.log('💾 Executing migration transaction...')
    const result = await transaction.commit()
    
    console.log('✅ Migration completed successfully!')
    console.log(`📊 Updated ${documentsToUpdate.length} brochure download records`)
    console.log('🎯 All existing brochure downloads now have country field set to "India"')
    
    return result
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Execute migration if run directly
if (require.main === module) {
  addCountryFieldToBrochureDownloads()
    .then(() => {
      console.log('🎉 Brochure downloads migration script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Brochure downloads migration script failed:', error)
      process.exit(1)
    })
}

export default addCountryFieldToBrochureDownloads
