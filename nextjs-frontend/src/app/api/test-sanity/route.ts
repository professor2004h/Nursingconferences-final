import { NextResponse } from 'next/server'
import { writeClient, client } from '../../sanity/client'

export async function GET() {
  try {
    console.log('🧪 Testing Sanity connection...')
    
    // Test read client
    const readTest = await client.fetch('*[_type == "abstractSubmission"][0..2]')
    console.log('📖 Read test result:', readTest?.length || 0, 'submissions found')
    
    // Test write client by creating a test document
    const testDoc = await writeClient.create({
      _type: 'abstractSubmission',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      country: 'Test Country',
      interestedIn: 'oral-presentation-in-person',
      trackName: 'nursing-education',
      abstractTitle: 'Test Abstract',
      abstractContent: 'This is a test abstract submission.',
      submissionDate: new Date().toISOString(),
      status: 'pending'
    })
    
    console.log('✅ Write test successful:', testDoc._id)
    
    // Clean up test document
    await writeClient.delete(testDoc._id)
    console.log('🗑️ Test document cleaned up')
    
    return NextResponse.json({
      success: true,
      message: 'Sanity connection test successful',
      readCount: readTest?.length || 0,
      testDocId: testDoc._id
    })
    
  } catch (error) {
    console.error('❌ Sanity test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}
