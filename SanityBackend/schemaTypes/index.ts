import conferenceEvent from "./conferenceEvent";
import pastConference from "./pastConference";
import about from './about';
import aboutUsSection from './aboutUsSection';
import heroSection from './heroSection';

import siteSettings from './siteSettings';
import imageSection from './imageSection';
import sponsorshipTiers from './sponsorshipTiers';
import sponsorshipSettings from './sponsorshipSettings';
import sponsorRegistration from './sponsorRegistration';
import paymentTransaction from './paymentTransaction';
import pastConferencesSection from './pastConferencesSection';
import journalSection from './journalSection';
import customContentSection from './customContentSection';
import brochureSettings from './brochureSettings';
import brochureDownload from './brochureDownload';

import mapLocation from './mapLocation';

// Registration system schemas
import { registrationSettings } from './registrationSettings';
import { registrationTypes } from './registrationTypes';
// import { sponsorshipTiersRegistration } from './sponsorshipTiersRegistration'; // Using existing sponsorshipTiers instead
import { accommodationOptions } from './accommodationOptions';
import { conferenceRegistration } from './conferenceRegistration';

import { pricingPeriods } from './pricingPeriods';
import { formConfiguration } from './formConfiguration';
import { paymentRecord } from './paymentRecord';

// Abstract submission system schemas
import abstractSubmission from './abstractSubmission';
import abstractSettings from './abstractSettings';

// Organizing committee schema
import organizingCommittee from './organizingCommittee';

// Poster presenters schema
import posterPresenters from './posterPresenters';
import posterPresentersSettings from './posterPresentersSettings';

// Past conference gallery schema
import pastConferenceGallery from './pastConferenceGallery';
import gallerySettings from './gallerySettings';

 // Media partners schema
import mediaPartners from './mediaPartners';
// Exhibitors schema
import exhibitors from './exhibitors';
import exhibitorsSettings from './exhibitorsSettings';

// Speakers schema
import speakers from './speakers';

// Speaker guidelines schema
import speakerGuidelines from './speakerGuidelines';

// Receipt settings schema
import receiptSettings from './receiptSettings';

// Venue settings schema
import venueSettings from './venueSettings';

// Cancellation policy schema
import cancellationPolicy from './cancellationPolicy';

// Event schedule and participation benefits schemas
import eventSchedule from './eventSchedule';
import participationBenefits from './participationBenefits';

export const schemaTypes = [
  conferenceEvent,
  pastConference,
  about,
  aboutUsSection,
  heroSection,

  siteSettings,
  imageSection,
  sponsorshipTiers,
  sponsorshipSettings,
  sponsorRegistration,
  paymentTransaction,
  pastConferencesSection,
  journalSection,
  customContentSection,
  brochureSettings,
  brochureDownload,
  mapLocation,
  // Registration system schemas
  registrationSettings,
  registrationTypes,
  // sponsorshipTiersRegistration, // Using existing sponsorshipTiers instead
  accommodationOptions,
  conferenceRegistration,

  pricingPeriods,
  formConfiguration,
  paymentRecord,
  // Abstract submission system schemas
  abstractSubmission,
  abstractSettings,
  // Organizing committee schema
  organizingCommittee,
  // Poster presenters schema
  posterPresenters,
  posterPresentersSettings,
  // Past conference gallery schema
  pastConferenceGallery,
  gallerySettings,
  // Media partners schema
  mediaPartners,
  // Exhibitors schema
  exhibitors,
  exhibitorsSettings,
  // Speakers schema
  speakers,
  // Speaker guidelines schema
  speakerGuidelines,
  // Receipt settings schema
  receiptSettings,
  // Venue settings schema
  venueSettings,
  // Cancellation policy schema
  cancellationPolicy,
  // Event schedule and participation benefits schemas
  eventSchedule,
  participationBenefits
]
