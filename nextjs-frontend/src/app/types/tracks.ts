export interface TrackName {
  value: string;
  label: string;
}

export interface AbstractSettings {
  _id?: string;
  title?: string;
  subtitle?: string;
  backgroundImage?: {
    asset?: {
      url?: string;
    };
  };
  abstractTemplate?: {
    asset?: {
      url?: string;
    };
  };
  templateDownloadText?: string;
  submissionEnabled?: boolean;
  submissionDeadline?: string;
  contactEmail?: string;
  interestedInOptions?: Array<{
    value: string;
    label: string;
  }>;
  trackNames?: TrackName[];
}

export interface TracksApiResponse {
  success: boolean;
  data: TrackName[];
  count: number;
  error?: string;
}

export interface AbstractSettingsApiResponse {
  success: boolean;
  data: AbstractSettings;
  error?: string;
}
