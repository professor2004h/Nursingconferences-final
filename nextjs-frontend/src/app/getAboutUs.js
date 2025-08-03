// lib/getAboutUs.js

// src/app/sanity/getAboutUs.js
// ✅ RIGHT: named import
import { client } from './sanity/client';

// Force About Us to come ONLY from type "about" (not aboutUsSection)
export async function getAboutUsContent() {
  const query = `*[_type == "about" && isActive == true][0]{
    _id,
    title,
    description,
    primaryBrandName,
    secondaryBrandText,
    brandTagline,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    isActive,
    // Scientific Program fields (moved to About)
    showScientificProgramButton,
    scientificProgramLabel,
    "scientificProgramPdfUrl": scientificProgramPdf.asset->url,
    _createdAt,
    _updatedAt
  }`;
  return client.fetch(query);
}
