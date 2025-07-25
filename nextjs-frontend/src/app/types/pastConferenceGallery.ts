export interface GalleryImage {
  asset?: {
    url: string;
    _id: string;
  };
  alt?: string;
  caption?: string;
  category?: string;
  photographer?: string;
  isFeatured?: boolean;
}

export interface SocialMediaLink {
  platform: string;
  url: string;
}

export interface SocialMedia {
  hashtags?: string[];
  socialLinks?: SocialMediaLink[];
}

export interface DownloadableContent {
  allowDownload: boolean;
  downloadMessage?: string;
  galleryZipUrl?: string;
}

export interface PastConferenceGallery {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  conferenceDate: string;
  location: string;
  venue: string;
  coverImage: {
    asset?: {
      url: string;
      _id: string;
    };
    alt?: string;
    caption?: string;
  };
  galleryImages: GalleryImage[];
  attendeeCount?: number;
  speakerCount?: number;
  countryCount?: number;
  highlights?: string[];
  tags?: string[];
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  downloadableContent?: DownloadableContent;
  socialMedia?: SocialMedia;
}

export interface PastConferenceGalleryApiResponse {
  success: boolean;
  data: PastConferenceGallery[];
  count: number;
  error?: string;
}

export interface SinglePastConferenceGalleryApiResponse {
  success: boolean;
  data: PastConferenceGallery;
  error?: string;
}

export interface GalleryFilters {
  year?: string;
  location?: string;
  category?: string;
  isFeatured?: boolean;
  searchQuery?: string;
}

export interface GalleryStats {
  totalGalleries: number;
  totalImages: number;
  featuredGalleries: number;
  years: string[];
  locations: string[];
  categories: string[];
}

export interface ImageModalData {
  image: GalleryImage;
  index: number;
  totalImages: number;
  galleryTitle: string;
}
