import { NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('📋 Populating cancellation policy with default data...');
    
    // Check if cancellation policy already exists
    const existingPolicy = await writeClient.fetch(`
      *[_type == "cancellationPolicy"][0]{
        _id,
        title
      }
    `);

    const defaultData = {
      title: 'Cancellation Policy',
      subtitle: 'Registration cancellation, refund policies, and important terms',
      introduction: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Please review our cancellation and refund policies carefully before registering for the conference. These policies are designed to be fair to both attendees and organizers while ensuring the successful execution of the event.'
            }
          ]
        }
      ],
      nameChangePolicy: {
        title: 'Name Changes',
        content: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'You are allowed to change the name on the registration without penalty at any time prior to 45 days before the conference. No further changes will be allowed after that deadline.'
              }
            ]
          }
        ],
        deadline: 45
      },
      refundPolicy: {
        title: 'Refund Policy',
        generalPolicy: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Refund requests must be made in writing or via email to the respective conference secretariat. All refunds are subject to the timeline and percentage structure outlined below.'
              }
            ]
          }
        ],
        refundTiers: [
          {
            daysBeforeConference: 90,
            refundPercentage: 75,
            description: '75% of the registration fee will be refunded prior to 90 days before the conference'
          },
          {
            daysBeforeConference: 45,
            refundPercentage: 50,
            description: '50% of the registration fee will be refunded prior to 45 days before the conference'
          },
          {
            daysBeforeConference: 0,
            refundPercentage: 0,
            description: 'No refunds will be granted between 45 days and the conference date'
          }
        ],
        additionalTerms: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Refund fees will be processed after the conference. All bank service charges, including transitional bank commission for cancellation refunds, must be covered by the participants/applicants. If you are unable to attend, you may transfer your registration fee to another individual by notifying the conference secretariat.'
              }
            ]
          }
        ]
      },
      naturalDisasterPolicy: {
        title: 'Natural Disasters/Calamities Policy',
        content: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Conference organizers cannot accept refund requests from conference delegates/attendees that result from cancelled flights and/or natural disasters/calamities.'
              }
            ]
          }
        ],
        organizerRights: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'The organizers will have the right to cancel/postpone the conference during natural disasters/calamities. In this case, the scientific conferences will provide opportunity for the registered delegates/attendees to transfer their registration fee to any future/related scientific conferences.'
              }
            ]
          }
        ],
        liabilityDisclaimer: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'The organizers will not accept any liability for personal injuries or for loss or damage to property belonging to the delegates/attendees, either during, or after the conference.'
              }
            ]
          }
        ]
      },
      postponementPolicy: {
        title: 'Postponement Policy',
        content: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'If the conference postpones an event for any reason and you are unable or unwilling to attend on rescheduled dates, you will receive a credit for 100% of the registration fee paid. You may use this credit for another event which must occur within one year from the date of postponement.'
              }
            ]
          }
        ],
        creditValidityPeriod: 12
      },
      transferPolicy: {
        title: 'Transfer of Registration',
        personTransfer: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'All fully paid registrations are transferable to other persons from the same organization, if the registered person is unable to attend the event. Transfers must be made by the registered person in writing to contact@inovineconferences.com. Details must include the full name of replacement person, their title, contact phone number and email address.'
              }
            ]
          }
        ],
        conferenceTransfer: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Registration can be transferred from one conference to another conference if the person is unable to attend one of the conferences. However, registration cannot be transferred if it is intimated within 14 days of the respective conference.'
              }
            ]
          }
        ],
        transferDeadline: 14,
        transferLimitations: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'The transferred registrations will not be eligible for refund. All other registration details will be assigned to the new person unless otherwise specified.'
              }
            ]
          }
        ]
      },
      visaPolicy: {
        title: 'Visa Information',
        generalAdvice: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Keeping in view of increased security measures, we would like to request all participants to apply for visa as soon as possible. Please allow sufficient time for visa processing.'
              }
            ]
          }
        ],
        failedVisaPolicy: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Important note for failed visa applications: Visa issues cannot come under the consideration of cancellation policy, including the inability to obtain a visa. Participants are responsible for ensuring they have proper documentation for travel.'
              }
            ]
          }
        ]
      },
      contactInformation: {
        title: 'Contact Information',
        primaryEmail: 'contact@inovineconferences.com',
        phone: '+1(408)-933-9154',
        instructions: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'For all cancellation requests, refund inquiries, and registration transfers, please contact us in writing via email or phone. Include your registration details and reason for cancellation in your communication.'
              }
            ]
          }
        ]
      },
      importantNotes: [
        {
          title: 'Processing Time',
          content: [
            {
              _type: 'block',
              children: [
                {
                  _type: 'span',
                  text: 'All refund processing will be completed after the conference date. Please allow 4-6 weeks for refund processing.'
                }
              ]
            }
          ],
          priority: 'high'
        },
        {
          title: 'Bank Charges',
          content: [
            {
              _type: 'block',
              children: [
                {
                  _type: 'span',
                  text: 'All bank service charges and transaction fees for refunds must be covered by the participant.'
                }
              ]
            }
          ],
          priority: 'medium'
        },
        {
          title: 'Written Requests',
          content: [
            {
              _type: 'block',
              children: [
                {
                  _type: 'span',
                  text: 'All cancellation and transfer requests must be submitted in writing via email for proper documentation.'
                }
              ]
            }
          ],
          priority: 'medium'
        }
      ],
      isActive: true,
      effectiveDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString(),
      seoTitle: 'Cancellation Policy - 15th Global Summit on Nursing Education & Health Care',
      seoDescription: 'Review our comprehensive cancellation and refund policies for the nursing conference, including deadlines, refund percentages, and transfer options.'
    };

    let result;
    if (existingPolicy) {
      console.log('📝 Updating existing cancellation policy...');
      result = await writeClient
        .patch(existingPolicy._id)
        .set(defaultData)
        .commit();
      console.log('✅ Successfully updated existing cancellation policy');
    } else {
      console.log('📄 Creating new cancellation policy...');
      result = await writeClient.create({
        _type: 'cancellationPolicy',
        ...defaultData
      });
      console.log('✅ Successfully created new cancellation policy');
    }

    return NextResponse.json({
      success: true,
      message: existingPolicy ? 'Cancellation policy updated successfully' : 'Cancellation policy created successfully',
      data: result
    });

  } catch (error) {
    console.error('❌ Error populating cancellation policy:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to populate cancellation policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
