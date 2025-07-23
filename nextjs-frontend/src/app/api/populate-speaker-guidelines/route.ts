import { NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🎤 Populating speaker guidelines with default data...');
    
    // Check if speaker guidelines already exist
    const existingGuidelines = await writeClient.fetch(`
      *[_type == "speakerGuidelines"][0]{
        _id,
        title
      }
    `);

    const defaultData = {
      title: 'Speaker Guidelines',
      subtitle: 'Comprehensive guidelines for conference speakers and presenters',
      introduction: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Welcome to our nursing conference! These guidelines will help ensure your presentation runs smoothly and meets our professional standards. Please review all sections carefully before your presentation.'
            }
          ]
        }
      ],
      speakerRequirements: {
        title: 'For Speakers',
        requirements: [
          'Number of slides should be minimum and presentation time should be strictly followed. Please stop when signalled by the Chair to do so.',
          'Users of Windows / PC should be responsible for the compatibility with Mac system used at the lectern.',
          'Taking the timelines into consideration, using personal laptops are not recommended unless under unavoidable conditions.',
          'No videos will be recorded.',
          'Felicitation for the speakers will be done during the session or after completion of the session, so please make sure to be present until the session ends.'
        ]
      },
      posterGuidelines: {
        title: 'For Posters',
        guidelines: [
          'Poster cards with number will be placed on the poster hall before one hour of the session start.',
          'Each author will be provided with a 1 meter x 1 meter poster presenting area pins / stick-tape. Participants are responsible for mounting their posters during the presentation and in removing them as soon as the session ends. Posters left up past that time will be discarded.',
          'Poster awards will be announced during the end of a day / session which will be informed during the event.'
        ]
      },
      presentationRequirements: {
        title: 'Basic Presentation Requirements',
        formats: ['.ppt', '.pptx', '.doc', '.docx'],
        requirements: [
          'MAC compatible presentation.',
          'Movies: Please take steps to compress your video file',
          'Each slide should be designed to be concise, uncluttered and readable from a distance: include only key words and phrases for visual reinforcement. Avoid lengthy text.'
        ]
      },
      virtualGuidelines: {
        title: 'Virtual Presentation Guidelines',
        guidelines: [
          'Virtual Presentation allows participants to present conveniently from their homes or work without traveling.',
          'Registered participants will receive the meeting invite with a personalized user ID for webinar access a few days before the event.',
          'Please join the meeting 30 minutes early, to minimize last minute technical issues.',
          'Each speaker will have 20-25 minutes for the presentation. Please plan your talk for 17-19 minutes to allow for an introduction and Q&A session at the end of your talk.',
          'If you are a presenter, be ready with your presentation slides open on your device when the meeting starts. You can share that document while sharing your screen.',
          'If you would like to send the recorded presentation instead of attending and presenting online, we recommend you send the recorded files along with PowerPoint presentation 10 days after the event start'
        ]
      },
      certificationInfo: {
        title: 'Certification',
        information: [
          'All the attendees will be provided with delegate certificate signed by the organizing committee members. Name and affiliation on the certificates will be printed on certificates as per our records.',
          'Certificates will be provided during the session or after completion of the session, so please make sure to be present in the hall until the session ends.',
          'E-certificate will be sent through email in 2-3 working days after the completion of the conference.',
          'Co-authors not registered for the conference, will not receive the certificate.'
        ]
      },
      technicalSpecifications: {
        title: 'Technical Specifications',
        audioVisual: [
          'Microphone and sound system provided',
          'LCD projector and screen available',
          'Laptop with presentation software installed',
          'Laser pointer available upon request'
        ],
        equipment: [
          'Mac-compatible presentation system',
          'HDMI and VGA connections available',
          'Internet connectivity for virtual presentations',
          'Technical support staff on-site'
        ]
      },
      submissionDeadlines: {
        title: 'Important Deadlines',
        deadlines: [
          {
            item: 'Abstract Submission',
            date: new Date('2025-07-22T23:59:59.000Z').toISOString(),
            description: 'Final deadline for abstract submissions'
          },
          {
            item: 'Presentation Materials',
            date: new Date('2025-07-30T23:59:59.000Z').toISOString(),
            description: 'Submit final presentation materials'
          },
          {
            item: 'Registration Deadline',
            date: new Date('2025-07-22T23:59:59.000Z').toISOString(),
            description: 'Final registration deadline for speakers'
          }
        ]
      },
      contactInformation: {
        title: 'Contact Information',
        programEnquiry: 'nursingworld@healthcaremeetings.org',
        generalQueries: 'nursingeducation@nursingmeetings.org',
        technicalSupport: 'contact@inovineconferences.com',
        phone: '+1(408)-933-9154'
      },
      additionalNotes: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'For any additional questions or special requirements, please contact our organizing committee at least one week before the conference. We are here to help ensure your presentation is successful.'
            }
          ]
        }
      ],
      isActive: true,
      lastUpdated: new Date().toISOString()
    };

    let result;
    if (existingGuidelines) {
      console.log('📝 Updating existing speaker guidelines...');
      result = await writeClient
        .patch(existingGuidelines._id)
        .set(defaultData)
        .commit();
      console.log('✅ Successfully updated existing speaker guidelines');
    } else {
      console.log('📄 Creating new speaker guidelines...');
      result = await writeClient.create({
        _type: 'speakerGuidelines',
        ...defaultData
      });
      console.log('✅ Successfully created new speaker guidelines');
    }

    return NextResponse.json({
      success: true,
      message: existingGuidelines ? 'Speaker guidelines updated successfully' : 'Speaker guidelines created successfully',
      data: result
    });

  } catch (error) {
    console.error('❌ Error populating speaker guidelines:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to populate speaker guidelines',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
