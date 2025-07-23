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
      S.listItem().title('Conference Event').schemaType('conferenceEvent').child(S.documentTypeList('conferenceEvent')),
      S.listItem().title('Past Conference').schemaType('pastConference').child(S.documentTypeList('pastConference')),
      S.listItem().title('About Us').schemaType('about').child(S.documentTypeList('about')),
      S.listItem().title('Hero Section').schemaType('heroSection').child(S.documentTypeList('heroSection')),
      S.listItem().title('Conferences Section').schemaType('conferences').child(S.documentTypeList('conferences')),
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
      S.listItem().title('Statistics Section').schemaType('statistics').child(S.documentTypeList('statistics')),
      S.listItem().title('Sponsorship Tiers').schemaType('sponsorshipTiers').child(S.documentTypeList('sponsorshipTiers')),
      S.listItem().title('Sponsor Registration').schemaType('sponsorRegistration').child(S.documentTypeList('sponsorRegistration')),
      S.listItem().title('Payment Transaction').schemaType('paymentTransaction').child(S.documentTypeList('paymentTransaction')),
      S.listItem().title('Past Conferences Section Styling').schemaType('pastConferencesSection').child(S.documentTypeList('pastConferencesSection')),
      S.listItem().title('Journal Section Styling').schemaType('journalSection').child(S.documentTypeList('journalSection')),
      S.listItem().title('Custom Content Section').schemaType('customContentSection').child(S.documentTypeList('customContentSection')),
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
      // Add Map Location with icon
      S.listItem()
        .title('Map Locations')
        .id('mapLocations')
        .icon(PinIcon)
        .schemaType('mapLocation')
        .child(S.documentTypeList('mapLocation').title('Map Locations'))
    ])
