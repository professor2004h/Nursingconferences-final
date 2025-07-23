import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '../../sanity/client'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting abstract submission...')
    const formData = await request.formData()

    // Extract form fields
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phoneNumber = formData.get('phoneNumber') as string
    const country = formData.get('country') as string
    const interestedIn = formData.get('interestedIn') as string
    const trackName = formData.get('trackName') as string
    const abstractTitle = formData.get('abstractTitle') as string
    const abstractContent = formData.get('abstractContent') as string
    const abstractFile = formData.get('abstractFile') as File

    console.log('📝 Form data extracted:', {
      firstName, lastName, email, country, interestedIn, trackName, abstractTitle,
      fileSize: abstractFile?.size,
      fileType: abstractFile?.type
    })

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !country ||
        !interestedIn || !trackName || !abstractTitle || !abstractContent || !abstractFile) {
      console.log('❌ Validation failed: Missing required fields')
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!abstractFile.type.includes('pdf') && !abstractFile.type.includes('doc') && !abstractFile.type.includes('docx')) {
      console.log('❌ Validation failed: Invalid file type:', abstractFile.type)
      return NextResponse.json(
        { error: 'Only PDF, DOC, and DOCX files are allowed' },
        { status: 400 }
      )
    }

    console.log('💾 Creating submission document...')
    // Create abstract submission document first (without file for now)
    const submission = await writeClient.create({
      _type: 'abstractSubmission',
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      interestedIn,
      trackName,
      abstractTitle,
      abstractContent,
      submissionDate: new Date().toISOString(),
      status: 'pending'
    })
    console.log('✅ Basic submission created successfully:', submission._id)

    // Try to upload file and update document
    try {
      console.log('📤 Uploading file to Sanity...')
      const fileAsset = await writeClient.assets.upload('file', abstractFile, {
        filename: `${firstName}_${lastName}_abstract.pdf`
      })
      console.log('✅ File uploaded successfully:', fileAsset._id)

      // Update the submission with the file
      await writeClient.patch(submission._id).set({
        abstractFile: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: fileAsset._id
          }
        }
      }).commit()
      console.log('✅ Submission updated with file')
    } catch (fileError) {
      console.error('⚠️ File upload failed, but submission was saved:', fileError)
      // Continue without file - submission is still valid
    }
    console.log('✅ Submission created successfully:', submission._id)

    return NextResponse.json({
      success: true,
      message: 'Abstract submitted successfully',
      submissionId: submission._id
    })

  } catch (error) {
    console.error('❌ Error submitting abstract:', error)
    return NextResponse.json(
      { error: `Failed to submit abstract: ${error.message}` },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const submissions = await client.fetch(`
      *[_type == "abstractSubmission"] | order(submissionDate desc) {
        _id,
        firstName,
        lastName,
        email,
        phoneNumber,
        country,
        interestedIn,
        trackName,
        abstractTitle,
        abstractContent,
        abstractFile{
          asset->{
            url,
            originalFilename
          }
        },
        submissionDate,
        status,
        reviewNotes
      }
    `)

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching abstract submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
