/**
 * Migration Script: Add Organization Field to Abstract Submissions
 * 
 * This script adds the "organization" field to all existing abstractSubmission documents
 * that don't already have this field, setting the default value to "ABC".
 * 
 * Usage:
 * 1. Run this script in Sanity Studio Vision tool
 * 2. Or execute via Sanity CLI: sanity exec migrations/add-organization-field.js --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function addOrganizationField() {
  console.log('🔄 Starting migration: Add organization field to abstract submissions...')
  
  try {
    // Fetch all abstract submissions that don't have organization field
    const query = `*[_type == "abstractSubmission" && !defined(organization)] {
      _id,
      _rev,
      firstName,
      lastName,
      email
    }`
    
    const documentsToUpdate = await client.fetch(query)
    console.log(`📊 Found ${documentsToUpdate.length} documents to update`)
    
    if (documentsToUpdate.length === 0) {
      console.log('✅ No documents need updating. Migration complete!')
      return
    }
    
    // Create transaction to update all documents
    const transaction = client.transaction()
    
    documentsToUpdate.forEach((doc) => {
      console.log(`📝 Adding organization field to: ${doc.firstName} ${doc.lastName} (${doc.email})`)
      
      transaction.patch(doc._id, {
        set: {
          organization: 'ABC'
        }
      })
    })
    
    // Execute the transaction
    console.log('💾 Executing migration transaction...')
    const result = await transaction.commit()
    
    console.log('✅ Migration completed successfully!')
    console.log(`📊 Updated ${documentsToUpdate.length} documents`)
    console.log('🎯 All existing abstract submissions now have organization field set to "ABC"')
    
    return result
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Execute migration if run directly
if (require.main === module) {
  addOrganizationField()
    .then(() => {
      console.log('🎉 Migration script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error)
      process.exit(1)
    })
}

export default addOrganizationField
