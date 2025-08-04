export interface VenueAddress {
  streetAddress: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface ContactInformation {
  phone?: string;
  email?: string;
  website?: string;
  organizerNote?: string;
}

export interface CheckInOut {
  checkInTime?: string;
  checkOutTime?: string;
  groupRateNote?: string;
}

export interface VenueImage {
  asset?: {
    url?: string;
    _id?: string;
  };
  alt?: string;
  caption?: string;
}

export interface MapConfiguration {
  latitude: number;
  longitude: number;
  zoomLevel?: number;
  markerTitle?: string;
}

export interface TransportationOption {
  type: 'airport-shuttle' | 'public-transit' | 'taxi-rideshare' | 'car-rental' | 'walking' | 'other';
  title: string;
  description?: string;
  duration?: string;
  cost?: string;
}

export interface Transportation {
  title?: string;
  options?: TransportationOption[];
}

export interface LocalAttraction {
  name: string;
  description?: string;
  distance?: string;
  category: 'restaurant' | 'shopping' | 'cultural' | 'entertainment' | 'nature' | 'historical' | 'other';
}

export interface LocalAttractions {
  title?: string;
  attractions?: LocalAttraction[];
}

export interface VenueSettings {
  _id: string;
  title: string;
  subtitle?: string;
  /** Optional hero background image URL for /venue header (from Sanity venueSettings) */
  heroImageUrl?: string;
  venueName: string;
  venueAddress: VenueAddress;
  contactInformation?: ContactInformation;
  checkInOut?: CheckInOut;
  amenities?: string[];
  venueImages?: VenueImage[];
  locationDescription?: any[]; // Rich text blocks
  mapConfiguration?: MapConfiguration;
  transportation?: Transportation;
  localAttractions?: LocalAttractions;
  additionalInformation?: any[]; // Rich text blocks
  isActive?: boolean;
  lastUpdated?: string;
}

export interface VenueSettingsApiResponse {
  success: boolean;
  data: VenueSettings | null;
  error?: string;
}

export interface PopulateVenueSettingsResponse {
  success: boolean;
  message: string;
  data?: VenueSettings;
  error?: string;
}
