export type Exhibitor = {
  _id: string;
  companyName: string;
  description?: string;
  website?: string;
  logo?: {
    alt?: string;
    asset?: {
      url?: string;
    };
  };
};

export type ExhibitorsApiResponse = {
  success: boolean;
  data?: Exhibitor[];
  error?: string;
};
