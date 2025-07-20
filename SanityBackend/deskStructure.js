// Custom Sanity Studio structure to include Map Location in the sidebar
import {DocumentIcon, DownloadIcon, PinIcon} from '@sanity/icons'
import BrochureTableView from './components/BrochureTableView'

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
              S.listItem().title('⚙️ Registration Settings').schemaType('registrationSettings').child(S.documentTypeList('registrationSettings')),
              S.listItem().title('🎫 Registration Types').schemaType('registrationTypes').child(S.documentTypeList('registrationTypes')),
              S.listItem().title('🏆 Sponsorship Tiers').schemaType('sponsorshipTiersRegistration').child(S.documentTypeList('sponsorshipTiersRegistration')),
              S.listItem().title('🏨 Accommodation Options').schemaType('accommodationOptions').child(S.documentTypeList('accommodationOptions')),
              S.listItem().title('📋 Conference Registrations').schemaType('conferenceRegistration').child(S.documentTypeList('conferenceRegistration')),
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
      // Add Map Location with icon
      S.listItem()
        .title('Map Locations')
        .id('mapLocations')
        .icon(PinIcon)
        .schemaType('mapLocation')
        .child(S.documentTypeList('mapLocation').title('Map Locations'))
    ])
