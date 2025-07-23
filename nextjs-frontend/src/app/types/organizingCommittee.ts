export interface CommitteeMember {
  _id: string;
  name: string;
  title: string;
  institution: string;
  country: string;
  profileImageUrl?: string;
  bio: string;
  specialization?: string;
  email?: string;
  linkedinUrl?: string;
  orcidId?: string;
  researchGateUrl?: string;
  displayOrder: number;
  isChairperson: boolean;
  isFeatured?: boolean;
  yearsOfExperience?: number;
  achievements?: string[];
  publications?: string[];
}

export interface CommitteeApiResponse {
  success: boolean;
  data: CommitteeMember[];
  count: number;
  error?: string;
}

export interface SingleMemberApiResponse {
  success: boolean;
  data: CommitteeMember;
  error?: string;
}
