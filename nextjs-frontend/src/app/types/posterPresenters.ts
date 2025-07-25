export interface PosterPresenter {
  _id: string;
  name: string;
  title: string;
  institution: string;
  country: string;
  profileImageUrl?: string;
  bio: string;
  posterTitle: string;
  posterAbstract: string;
  researchArea: string;
  keywords?: string[];
  email?: string;
  linkedinUrl?: string;
  orcidId?: string;
  researchGateUrl?: string;
  posterFileUrl?: string;
  presentationDate?: string;
  sessionTrack?: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  awards?: string[];
  publications?: string[];
  collaborators?: string[];
}

export interface PosterPresentersApiResponse {
  success: boolean;
  data: PosterPresenter[];
  count: number;
  error?: string;
}

export interface SinglePosterPresenterApiResponse {
  success: boolean;
  data: PosterPresenter;
  error?: string;
}

export interface PosterPresenterFilters {
  researchArea?: string;
  sessionTrack?: string;
  isFeatured?: boolean;
  searchQuery?: string;
}

export interface PosterPresenterStats {
  totalPresenters: number;
  featuredPresenters: number;
  researchAreas: string[];
  sessionTracks: string[];
}
