export interface MediaPartner {
  _id: string;
  companyName: string;
  logo: {
    asset?: {
      url: string;
      _id: string;
    };
    alt?: string;
  };
  website?: string;
  description?: string;
  isActive: boolean;
}

export interface MediaPartnersApiResponse {
  success: boolean;
  data: MediaPartner[];
  count: number;
  error?: string;
}
