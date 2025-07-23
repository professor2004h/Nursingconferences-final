import { NextResponse } from 'next/server'
import { writeClient, client } from '../../sanity/client'

export async function POST() {
  try {
    console.log('🚀 Starting Sanity population with all frontend options...')
    
    // All the options that are currently hardcoded in the frontend
    const interestedInOptions = [
      { value: 'oral-presentation-in-person', label: 'Oral Presentation (In-Person)' },
      { value: 'poster-presentation-in-person', label: 'Poster Presentation (In-Person)' },
      { value: 'oral-presentation-virtual', label: 'Oral Presentation (Virtual)' },
      { value: 'poster-presentation-virtual', label: 'Poster Presentation (Virtual)' }
    ]

    const trackNames = [
      { value: 'nursing-education', label: 'Nursing Education' },
      { value: 'nursing-informatics', label: 'Nursing Informatics' },
      { value: 'psychiatric-mental-health', label: 'Psychiatric and Mental Health Nursing' },
      { value: 'nursing-research', label: 'Nursing Research' },
      { value: 'public-health-nursing', label: 'Public Health Nursing' },
      { value: 'rehabilitation-nursing', label: 'Rehabilitation Nursing' },
      { value: 'clinical-nursing', label: 'Clinical Nursing' },
      { value: 'cardiac-nursing', label: 'Cardiac Nursing' },
      { value: 'geriatric-nursing', label: 'Geriatric Nursing' },
      { value: 'occupational-health-nursing', label: 'Occupational Health Nursing' },
      { value: 'men-in-nursing', label: 'Men in Nursing' },
      { value: 'mental-nursing', label: 'Mental Nursing' },
      { value: 'nursing-management', label: 'Nursing Management' },
      { value: 'psychological-nursing', label: 'Psychological Nursing' },
      { value: 'medical-surgical-nursing', label: 'Medical Surgical Nursing' },
      { value: 'emergency-nursing', label: 'Emergency Nursing and Ambulatory Care Nursing' },
      { value: 'advances-in-nursing', label: 'Nursing Advances In Nursing' },
      { value: 'transcultural-nursing', label: 'Transcultural Nursing' },
      { value: 'national-health-system', label: 'National Health System' },
      { value: 'family-participatory-care', label: 'Family Participatory Care Nursing' },
      { value: 'nursing-leadership', label: 'Leadership' },
      { value: 'midwifery-womens-health', label: 'Midwifery and Womens Health' },
      { value: 'dental-nursing', label: 'Dental Nursing' },
      { value: 'international-nursing-education', label: 'International nursing Education' },
      { value: 'nurse-practitioner', label: 'Nurse Practitioner' },
      { value: 'veterinary-nursing', label: 'Veterinary Nursing' },
      { value: 'travel-nursing', label: 'Travel Nursing' },
      { value: 'gynecology-nursing', label: 'Gynecology Nursing' },
      { value: 'traditional-medicine-nursing', label: 'Traditional Medicine Nursing' },
      { value: 'diabetic-nursing', label: 'Diabetic Nursing' },
      { value: 'cancer-nursing', label: 'Cancer Nursing' },
      { value: 'orthopeadic-nursing', label: 'Orthopeadic Nursing' },
      { value: 'nephrology-nursing', label: 'Nephrology Nursing' },
      { value: 'patient-care', label: 'Patient care' },
      { value: 'healthcare-global-nursing', label: 'Healthcare Global Nursing' },
      { value: 'adult-health-nursing', label: 'Adult Health nursing' },
      { value: 'risk-factors-nursing', label: 'Risk Factors in Nursing and Healthcare' },
      { value: 'workforce-development', label: 'Professionals Workforce Development and Retention in Nursing' },
      { value: 'obstetrics-gynecology', label: 'Obstetrics and Gynecology Nursing' },
      { value: 'pain-management', label: 'Pain Management & Preventive Medicine' },
      { value: 'nursing-specialties', label: 'Nursing in Different Fields and Specialties' },
      { value: 'nursing-ethics', label: 'Nursing Ethics, Legal Aspects, and Patient Advocacy' },
      { value: 'leadership-development', label: 'Leadership and Professional Development' },
      { value: 'geriatric-pediatric', label: 'Geriatric & Pediatric Nursing' },
      { value: 'environmental-health', label: 'Environmental Health Nursing' },
      { value: 'epidemiology-community', label: 'Epidemiology and Community Health' },
      { value: 'community-home-health', label: 'Community and Home Health Nursing' },
      { value: 'ai-emerging-technologies', label: 'AI and Emerging Technologies in Nursing' },
      { value: 'anesthesia-perianesthesia', label: 'Anesthesia and PeriAnesthesia Nursing' },
      { value: 'burnout-wellbeing', label: 'Burnout, Well-Being, and Resilience in Nursing' },
      { value: 'cancer-therapy', label: 'cancer therapy' },
      { value: 'pediatric-nursing', label: 'pediatric nursing' },
      { value: 'obesity-nursing', label: 'obesity nursing' },
      { value: 'cardiology-nursing', label: 'cardiology nursing' },
      { value: 'others', label: 'Others' }
    ]

    console.log(`📊 Preparing to add ${interestedInOptions.length} interested options and ${trackNames.length} track names`)

    // Check if Abstract Settings document exists
    const existingSettings = await client.fetch(`*[_type == "abstractSettings"][0]`)
    
    let result
    if (existingSettings) {
      console.log('📝 Updating existing Abstract Settings document...')
      // Update existing document
      result = await writeClient
        .patch(existingSettings._id)
        .set({
          interestedInOptions: interestedInOptions,
          trackNames: trackNames,
          title: existingSettings.title || 'Abstract Submission',
          subtitle: existingSettings.subtitle || 'Submit Your Abstract',
          templateDownloadText: existingSettings.templateDownloadText || 'Download Abstract Template Here',
          submissionEnabled: existingSettings.submissionEnabled !== undefined ? existingSettings.submissionEnabled : true
        })
        .commit()
      
      console.log('✅ Successfully updated existing Abstract Settings document')
    } else {
      console.log('📄 Creating new Abstract Settings document...')
      // Create new document
      result = await writeClient.create({
        _type: 'abstractSettings',
        title: 'Abstract Submission',
        subtitle: 'Submit Your Abstract',
        templateDownloadText: 'Download Abstract Template Here',
        submissionEnabled: true,
        interestedInOptions: interestedInOptions,
        trackNames: trackNames
      })
      
      console.log('✅ Successfully created new Abstract Settings document')
    }

    return NextResponse.json({
      success: true,
      message: `Successfully populated Sanity with ${interestedInOptions.length} interested options and ${trackNames.length} track names`,
      documentId: result._id,
      interestedInCount: interestedInOptions.length,
      trackNamesCount: trackNames.length,
      action: existingSettings ? 'updated' : 'created'
    })

  } catch (error) {
    console.error('❌ Error populating Sanity:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error
    }, { status: 500 })
  }
}
