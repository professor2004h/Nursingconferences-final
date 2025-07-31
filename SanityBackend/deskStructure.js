// Custom Sanity Studio structure to include Map Location in the sidebar
import {DocumentIcon, DownloadIcon, PinIcon, UserIcon, EditIcon, UsersIcon} from '@sanity/icons'
import BrochureTableView from './components/BrochureTableView'
import RegistrationTableView from './components/RegistrationTableView'
import AbstractTableView from './components/AbstractTableView.jsx'

export default (S) =>
  S.list()
    .title('Content')
    .items([
      // Main Content
      // Unified Conferences Management Section
      S.listItem()
        .title('🎯 Conferences')
        .id('conferencesManagement')
        .icon(() => '🎯')
        .child(
          S.list()
            .title('Conferences Management')
            .items([
              // Master Conference Settings (Singleton)
              S.listItem()
                .title('⚙️ Conference Section Settings')
                .id('conferencesSectionSettings')
                .child(
                  S.document()
                    .schemaType('conferencesSectionSettings')
                    .documentId('conferencesSectionSettings')
                    .title('Conference Section Settings')
                ),
              // Individual Conference Events
              S.listItem()
                .title('📅 Conference Events')
                .id('conferenceEvents')
                .child(
                  S.documentTypeList('conferenceEvent')
                    .title('Conference Events')
                    .defaultOrdering([{field: 'date', direction: 'desc'}])
                ),
              // Legacy Conferences Section (for backward compatibility)
              S.listItem()
                .title('📝 Legacy Conference Content')
                .id('legacyConferences')
                .child(
                  S.documentTypeList('conferences')
                    .title('Legacy Conference Section Content')
                ),
            ])
        ),
      S.listItem().title('Past Conference').schemaType('pastConference').child(S.documentTypeList('pastConference')),
      S.listItem().title('About Us').schemaType('about').child(S.documentTypeList('about')),
      S.listItem().title('Hero Section').schemaType('heroSection').child(S.documentTypeList('heroSection')),
      S.listItem().title('Site Settings').schemaType('siteSettings').child(S.documentTypeList('siteSettings')),

      // Registration System
      S.divider(),
      S.listItem()
        .title('📝 Registration System')
        .child(
          S.list()
            .title('Registration Management')
            .items([
              S.listItem().title('Registration Settings').schemaType('registrationSettings').child(S.documentTypeList('registrationSettings')),
              S.listItem().title('Registration Types').schemaType('registrationTypes').child(S.documentTypeList('registrationTypes')),
              // Sponsorship Tiers moved to main section to avoid duplication
              S.listItem().title('Accommodation Options').schemaType('accommodationOptions').child(S.documentTypeList('accommodationOptions')),
              S.listItem().title('Conference Registrations').schemaType('conferenceRegistration').child(S.documentTypeList('conferenceRegistration')),
            ])
        ),
      S.listItem().title('Image Section').schemaType('imageSection').child(S.documentTypeList('imageSection')),
      S.listItem().title('Sponsorship Tiers').schemaType('sponsorshipTiers').child(S.documentTypeList('sponsorshipTiers')),
      S.listItem().title('Sponsor Registration').schemaType('sponsorRegistration').child(S.documentTypeList('sponsorRegistration')),
      S.listItem().title('Payment Transaction').schemaType('paymentTransaction').child(S.documentTypeList('paymentTransaction')),
      S.listItem().title('Past Conferences Section Styling').schemaType('pastConferencesSection').child(S.documentTypeList('pastConferencesSection')),
      S.listItem().title('Journal Section Styling').schemaType('journalSection').child(S.documentTypeList('journalSection')),
      // Custom Content Section Settings (Singleton)
      S.listItem()
        .title('⚙️ Custom Content Section')
        .id('customContentSection')
        .child(
          S.document()
            .schemaType('customContentSection')
            .documentId('customContentSection')
            .title('Custom Content Section Settings')
        ),
      // Add Brochure Settings
      S.listItem()
        .title('Brochure Settings')
        .id('brochureSettings')
        .icon(DocumentIcon)
        .schemaType('brochureSettings')
        .child(S.documentTypeList('brochureSettings').title('Brochure Settings')),
      // Add Brochure Downloads with Table View
      S.listItem()
        .title('Brochure Downloads')
        .id('brochureDownloads')
        .icon(DownloadIcon)
        .child(
          S.list()
            .title('Brochure Download Management')
            .items([
              // Custom Interactive Table View with Export
              S.listItem()
                .title('📊 Downloads Table')
                .id('brochureDownloadsTable')
                .child(
                  S.component(BrochureTableView)
                    .title('Brochure Download Submissions - Table View')
                ),
              // Traditional Document List View
              S.listItem()
                .title('📄 Downloads List')
                .id('brochureDownloadsList')
                .child(
                  S.documentTypeList('brochureDownload')
                    .title('Brochure Download Submissions - List View')
                    .defaultOrdering([{field: 'downloadTimestamp', direction: 'desc'}])
                )
            ])
        ),
      // Add Conference Registrations with Table View
      S.listItem()
        .title('Conference Registrations')
        .id('conferenceRegistrations')
        .icon(UserIcon)
        .child(
          S.list()
            .title('Registration Management')
            .items([
              // Custom Interactive Table View with Export
              S.listItem()
                .title('📊 Registrations Table')
                .id('registrationsTable')
                .child(
                  S.component(RegistrationTableView)
                    .title('Conference Registrations - Table View')
                ),
              // Traditional Document List View
              S.listItem()
                .title('📄 Registrations List')
                .id('registrationsList')
                .child(
                  S.documentTypeList('conferenceRegistration')
                    .title('Conference Registrations - List View')
                    .defaultOrdering([{field: 'registrationDate', direction: 'desc'}])
                )
            ])
        ),
      // Add Abstract Submission System
      S.listItem()
        .title('📝 Abstract')
        .id('abstractSubmissionSystem')
        .icon(EditIcon)
        .child(
          S.list()
            .title('Abstract Management')
            .items([
              // Abstract Settings
              S.listItem()
                .title('⚙️ Abstract Settings')
                .id('abstractSettings')
                .child(
                  S.documentTypeList('abstractSettings')
                    .title('Abstract Settings')
                ),
              // Abstract Submissions Table View
              S.listItem()
                .title('📊 Abstract Submissions')
                .id('abstractSubmissionsTable')
                .child(
                  S.component(AbstractTableView)
                    .title('Abstract Submissions - Table View')
                ),
              // Traditional Document List View
              S.listItem()
                .title('📄 Abstract List')
                .id('abstractSubmissionsList')
                .child(
                  S.documentTypeList('abstractSubmission')
                    .title('Abstract Submissions - List View')
                    .defaultOrdering([{field: 'submissionDate', direction: 'desc'}])
                )
            ])
        ),
      // Add Organizing Committee
      S.listItem()
        .title('Organizing Committee')
        .id('organizingCommittee')
        .icon(UsersIcon)
        .schemaType('organizingCommittee')
        .child(
          S.documentTypeList('organizingCommittee')
            .title('Organizing Committee Members')
            .defaultOrdering([{field: 'displayOrder', direction: 'asc'}])
        ),
      // Add Poster Presenters
      S.listItem()
        .title('Poster Presenters')
        .id('posterPresenters')
        .icon(() => '📋')
        .schemaType('posterPresenters')
        .child(
          S.documentTypeList('posterPresenters')
            .title('Poster Presenters')
            .defaultOrdering([{field: 'displayOrder', direction: 'asc'}])
        ),
      // Add Past Conference Gallery
      S.listItem()
        .title('Conference Gallery')
        .id('pastConferenceGallery')
        .icon(() => '📸')
        .schemaType('pastConferenceGallery')
        .child(
          S.documentTypeList('pastConferenceGallery')
            .title('Past Conference Gallery')
            .defaultOrdering([{field: 'conferenceDate', direction: 'desc'}])
        ),
      // Add Media Partners
      S.listItem()
        .title('Media Partners')
        .id('mediaPartners')
        .icon(() => '🤝')
        .schemaType('mediaPartners')
        .child(
          S.documentTypeList('mediaPartners')
            .title('Media Partners')
            .defaultOrdering([{field: 'companyName', direction: 'asc'}])
        ),
      // Add Speakers
      S.listItem()
        .title('Conference Speakers')
        .id('speakers')
        .icon(() => '🎤')
        .schemaType('speakers')
        .child(
          S.documentTypeList('speakers')
            .title('Conference Speakers')
            .defaultOrdering([{field: 'displayOrder', direction: 'asc'}])
        ),
      // Add Speaker Guidelines
      S.listItem()
        .title('Speaker Guidelines')
        .id('speakerGuidelines')
        .icon(() => '🎤')
        .schemaType('speakerGuidelines')
        .child(
          S.documentTypeList('speakerGuidelines')
            .title('Speaker Guidelines')
        ),
      // Add Venue Settings
      S.listItem()
        .title('Venue Settings')
        .id('venueSettings')
        .icon(() => '🏨')
        .schemaType('venueSettings')
        .child(
          S.documentTypeList('venueSettings')
            .title('Venue Settings')
        ),
      // Add Cancellation Policy
      S.listItem()
        .title('Cancellation Policy')
        .id('cancellationPolicy')
        .icon(() => '📋')
        .schemaType('cancellationPolicy')
        .child(
          S.documentTypeList('cancellationPolicy')
            .title('Cancellation Policy')
        ),
      // Add Event Schedule
      S.listItem()
        .title('Event Schedule')
        .id('eventSchedule')
        .icon(() => '📅')
        .schemaType('eventSchedule')
        .child(
          S.documentTypeList('eventSchedule')
            .title('Event Schedule')
            .defaultOrdering([{field: 'displayOrder', direction: 'asc'}])
        ),
      // Add Participation Benefits
      S.listItem()
        .title('Participation Benefits')
        .id('participationBenefits')
        .icon(() => '🎯')
        .schemaType('participationBenefits')
        .child(
          S.documentTypeList('participationBenefits')
            .title('Participation Benefits')
            .defaultOrdering([{field: 'displayOrder', direction: 'asc'}])
        ),
      // Add Map Location with icon
      S.listItem()
        .title('Map Locations')
        .id('mapLocations')
        .icon(PinIcon)
        .schemaType('mapLocation')
        .child(S.documentTypeList('mapLocation').title('Map Locations'))
    ])
