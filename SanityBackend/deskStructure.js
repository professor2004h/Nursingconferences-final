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
        .title('Conferences')
        .id('conferencesManagement')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Conferences Management')
            .items([
              // Conferences Redirect Configuration (Singleton)
              S.listItem()
                .title('Conferences Redirect')
                .id('conferencesRedirect')
                .child(
                  S.document()
                    .schemaType('conferenceEvent')
                    .documentId('conferenceEvent')
                    .title('Conferences Redirect Configuration')
                ),
            ])
        ),
      S.listItem().title('Past Conference').schemaType('pastConference').child(S.documentTypeList('pastConference')),
      S.listItem().title('About Us Section').schemaType('about').child(S.documentTypeList('about')),
      S.listItem().title('About Organisation').schemaType('aboutUsSection').child(S.documentTypeList('aboutUsSection')),
      S.listItem().title('Hero Section').schemaType('heroSection').child(S.documentTypeList('heroSection')),
      S.listItem().title('Site Settings').schemaType('siteSettings').child(S.documentTypeList('siteSettings')),

      // Registration System - Consolidated
      S.divider(),
      S.listItem()
        .title('Registration System')
        .child(
          S.list()
            .title('Registration Management')
            .items([
              S.listItem().title('Registration Settings').schemaType('registrationSettings').child(S.documentTypeList('registrationSettings')),
              S.listItem().title('Registration Types').schemaType('registrationTypes').child(S.documentTypeList('registrationTypes')),
              S.listItem().title('Accommodation Options').schemaType('accommodationOptions').child(S.documentTypeList('accommodationOptions')),

              // Enhanced Registration Table View
              S.listItem()
                .title('Registrations Table')
                .id('registrationsTableEnhanced')
                .icon(UserIcon)
                .child(
                  S.component(RegistrationTableView)
                    .title('Conference Registrations - Enhanced Table View')
                ),
            ])
        ),
      S.listItem().title('Image Section').schemaType('imageSection').child(S.documentTypeList('imageSection')),
      // Sponsorship Management Section
      S.listItem()
        .title('Sponsorship Management')
        .id('sponsorshipManagement')
        .child(
          S.list()
            .title('Sponsorship Management')
            .items([
              // Sponsorship Settings (Singleton)
              S.listItem()
                .title('Sponsorship Settings')
                .id('sponsorshipSettings')
                .child(
                  S.document()
                    .schemaType('sponsorshipSettings')
                    .documentId('sponsorshipSettings')
                    .title('Sponsorship Settings')
                ),
              // Sponsorship Tiers
              S.listItem()
                .title('Sponsorship Tiers')
                .id('sponsorshipTiers')
                .child(
                  S.documentTypeList('sponsorshipTiers')
                    .title('Sponsorship Tiers')
                    .defaultOrdering([{field: 'price', direction: 'asc'}])
                ),
              // Sponsor Registrations
              S.listItem()
                .title('Sponsor Registrations')
                .id('sponsorRegistration')
                .child(
                  S.documentTypeList('sponsorRegistration')
                    .title('Sponsor Registrations')
                    .defaultOrdering([{field: 'submissionDate', direction: 'desc'}])
                ),
            ])
        ),
      S.listItem().title('Payment Transaction').schemaType('paymentTransaction').child(S.documentTypeList('paymentTransaction')),

      S.listItem().title('Journal Section Styling').schemaType('journalSection').child(S.documentTypeList('journalSection')),
      // Custom Content Section Settings (Singleton)
      S.listItem()
        .title('Custom Content Section')
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
                .title('Downloads Table')
                .id('brochureDownloadsTable')
                .child(
                  S.component(BrochureTableView)
                    .title('Brochure Download Submissions - Table View')
                ),
              // Traditional Document List View
              S.listItem()
                .title('Downloads List')
                .id('brochureDownloadsList')
                .child(
                  S.documentTypeList('brochureDownload')
                    .title('Brochure Download Submissions - List View')
                    .defaultOrdering([{field: 'downloadTimestamp', direction: 'desc'}])
                )
            ])
        ),
      // Removed duplicate Conference Registrations section - now consolidated in Registration System
      // Add Abstract Submission System
      S.listItem()
        .title('Abstract')
        .id('abstractSubmissionSystem')
        .icon(EditIcon)
        .child(
          S.list()
            .title('Abstract Management')
            .items([
              // Abstract Settings
              S.listItem()
                .title('Abstract Settings')
                .id('abstractSettings')
                .child(
                  S.documentTypeList('abstractSettings')
                    .title('Abstract Settings')
                ),
              // Abstract Submissions Table View
              S.listItem()
                .title('Abstract Submissions')
                .id('abstractSubmissionsTable')
                .child(
                  S.component(AbstractTableView)
                    .title('Abstract Submissions - Table View')
                ),
              // Traditional Document List View
              S.listItem()
                .title('Abstract List')
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
      // Poster Presenters Management Section
      S.listItem()
        .title('Poster Presenters')
        .id('posterPresentersManagement')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Poster Presenters Management')
            .items([
              // Poster Presenters Settings (Singleton)
              S.listItem()
                .title('Poster Presenters Settings')
                .id('posterPresentersSettings')
                .child(
                  S.document()
                    .schemaType('posterPresentersSettings')
                    .documentId('posterPresentersSettings')
                    .title('Poster Presenters Settings')
                ),
              // Individual Poster Presenters
              S.listItem()
                .title('Poster Presenters')
                .id('posterPresenters')
                .child(
                  S.documentTypeList('posterPresenters')
                    .title('Poster Presenters')
                    .defaultOrdering([{field: 'displayOrder', direction: 'asc'}])
                ),
            ])
        ),
      // Add Past Conference Gallery
      S.listItem()
        .title('Conference Gallery')
        .id('pastConferenceGallery')
        .icon(DocumentIcon)
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
        .icon(DocumentIcon)
        .schemaType('mediaPartners')
        .child(
          S.documentTypeList('mediaPartners')
            .title('Media Partners')
            .defaultOrdering([{field: 'companyName', direction: 'asc'}])
        ),
      // Exhibitors Management Section
      S.listItem()
        .title('Exhibitors')
        .id('exhibitorsManagement')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Exhibitors Management')
            .items([
              // Exhibitors Settings (Singleton)
              S.listItem()
                .title('Exhibitors Settings')
                .id('exhibitorsSettings')
                .child(
                  S.document()
                    .schemaType('exhibitorsSettings')
                    .documentId('exhibitorsSettings')
                    .title('Exhibitors Settings')
                ),
              // Individual Exhibitors
              S.listItem()
                .title('Exhibitors')
                .id('exhibitors')
                .child(
                  S.documentTypeList('exhibitors')
                    .title('Exhibitors')
                    .defaultOrdering([{field: 'companyName', direction: 'asc'}])
                ),
            ])
        ),
      // Add Speakers
      S.listItem()
        .title('Conference Speakers')
        .id('speakers')
        .icon(UserIcon)
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
        .icon(UserIcon)
        .schemaType('speakerGuidelines')
        .child(
          S.documentTypeList('speakerGuidelines')
            .title('Speaker Guidelines')
        ),
      // Add Venue Settings
      S.listItem()
        .title('Venue Settings')
        .id('venueSettings')
        .icon(PinIcon)
        .schemaType('venueSettings')
        .child(
          S.documentTypeList('venueSettings')
            .title('Venue Settings')
        ),
      // Add Cancellation Policy
      S.listItem()
        .title('Cancellation Policy')
        .id('cancellationPolicy')
        .icon(DocumentIcon)
        .schemaType('cancellationPolicy')
        .child(
          S.documentTypeList('cancellationPolicy')
            .title('Cancellation Policy')
        ),
      // Add Event Schedule
      S.listItem()
        .title('Event Schedule')
        .id('eventSchedule')
        .icon(DownloadIcon) // Changed to a more relevant icon for schedule/details
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
        .icon(DocumentIcon)
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
