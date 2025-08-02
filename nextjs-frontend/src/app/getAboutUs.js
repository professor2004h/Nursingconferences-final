// lib/getAboutUs.js

// src/app/sanity/getAboutUs.js
// ✅ RIGHT: named import
import { client } from './sanity/client';



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
    _createdAt,
    _updatedAt
  }`;
  const about = await client.fetch(query);
  return about;
}
