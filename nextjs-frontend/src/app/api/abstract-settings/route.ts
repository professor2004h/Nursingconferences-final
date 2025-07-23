import { NextResponse } from 'next/server'
import { client, writeClient } from '../../sanity/client'

export async function GET() {
  try {
    console.log('🔍 Fetching abstract settings from Sanity...')

    const settings = await client.fetch(`
      *[_type == "abstractSettings"][0]{
        title,
        subtitle,
        backgroundImage{
          asset->{
            url
          }
        },
        abstractTemplate{
          asset->{
            url
          }
        },
        templateDownloadText,
        submissionEnabled,
        submissionDeadline,
        contactEmail,
        interestedInOptions,
        trackNames
      }
    `)

    console.log('📄 Settings fetched:', settings ? 'Found' : 'Not found')

    // Check if settings exist and have the required arrays populated
    if (settings && settings.interestedInOptions && settings.interestedInOptions.length > 0 &&
        settings.trackNames && settings.trackNames.length > 0) {
      console.log('✅ Settings found with populated data')
      return NextResponse.json(settings)
    }

    // If no settings found or arrays are empty, create/update with default data
    console.log('⚠️ Settings not found or arrays empty, populating with defaults...')

    const defaultData = {
      title: 'Abstract Submission',
      subtitle: 'Submit Your Abstract',
      templateDownloadText: 'Download Abstract Template Here',
      submissionEnabled: true,
      interestedInOptions: [
        { value: 'oral-presentation-in-person', label: 'Oral Presentation (In-Person)' },
        { value: 'poster-presentation-in-person', label: 'Poster Presentation (In-Person)' },
        { value: 'oral-presentation-virtual', label: 'Oral Presentation (Virtual)' },
        { value: 'poster-presentation-virtual', label: 'Poster Presentation (Virtual)' }
      ],
      trackNames: [
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
    }

    try {
      let result
      if (settings) {
        // Update existing document
        result = await writeClient.patch(settings._id).set({
          interestedInOptions: defaultData.interestedInOptions,
          trackNames: defaultData.trackNames
        }).commit()
        console.log('✅ Updated existing settings with default arrays')
      } else {
        // Create new document
        result = await writeClient.create({
          _type: 'abstractSettings',
          ...defaultData
        })
        console.log('✅ Created new settings with default data')
      }

      return NextResponse.json(defaultData)
    } catch (writeError) {
      console.error('❌ Error writing to Sanity:', writeError)
      // Return default data even if write fails
      console.log('⚠️ Returning default data due to write error')
    }

    // Fallback: return default data if everything fails
    return NextResponse.json(defaultData)

  } catch (error) {
    console.error('Error fetching abstract settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch abstract settings' },
      { status: 500 }
    )
  }
}
