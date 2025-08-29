import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '../../sanity/client'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing simple abstract submission without file...')
    
    const body = await request.json()
    const { firstName, lastName, email } = body
    
    // Create abstract submission document without file
    const submission = await writeClient.create({
      _type: 'abstractSubmission',
      title: 'Dr',
      firstName: firstName || 'Test',
      lastName: lastName || 'User',
      email: email || 'test@example.com',
      phoneNumber: '1234567890',
      country: 'Test Country',
      organization: 'Test University',
      interestedIn: 'oral-presentation-in-person',
      trackName: 'nursing-education',
      abstractTitle: 'Test Abstract Without File',
      submissionDate: new Date().toISOString(),
      status: 'pending'
    })
    
    console.log('✅ Simple submission created:', submission._id)
    
    return NextResponse.json({
      success: true,
      message: 'Simple abstract submitted successfully',
      submissionId: submission._id
    })
    
  } catch (error) {
    console.error('❌ Error in simple submission:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}
