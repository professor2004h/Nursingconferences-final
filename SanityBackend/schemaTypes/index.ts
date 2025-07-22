import conferenceEvent from "./conferenceEvent";
import pastConference from "./pastConference";
import about from './about';
import heroSection from './heroSection';
import conferences from "./conferences";
import siteSettings from './siteSettings';
import statistics from './statistics';
import sponsorshipTiers from './sponsorshipTiers';
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

export const schemaTypes = [
  conferenceEvent,
  pastConference,
  about,
  heroSection,
  conferences,
  siteSettings,
  statistics,
  sponsorshipTiers,
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
  paymentRecord
]
