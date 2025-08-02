// TypeScript interfaces for About Us data

export interface AboutUsData {
  _id: string;
  title: string;
  content: string;
  primaryBrandName?: string;
  secondaryBrandText?: string;
  brandTagline?: string;
  isActive: boolean;
  _createdAt: string;
  _updatedAt: string;
}

export interface AboutPageData {
  _id: string;
  title: string;
  description: any[]; // Portable Text blocks
  primaryBrandName?: string;
  secondaryBrandText?: string;
  brandTagline?: string;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  _createdAt: string;
  _updatedAt: string;
}

export interface AboutUsResponse {
  success: boolean;
  data: AboutUsData | null;
  error?: string;
}

export interface AboutPageResponse {
  success: boolean;
  data: AboutPageData | null;
  error?: string;
}

export interface OrganizationBranding {
  primaryBrandName: string;
  secondaryBrandText: string;
  brandTagline?: string;
}

export interface MigrationResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}
