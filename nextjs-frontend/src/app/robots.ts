import { MetadataRoute } from 'next'
import { getSiteSettings, getWebsiteUrl } from './getSiteSettings'

export default async function robots(): Promise<MetadataRoute.Robots> {
  let siteSettings = null;

  try {
    siteSettings = await getSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings for robots:', error);
  }

  const baseUrl = getWebsiteUrl(siteSettings);
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/debug/',
        '/test/',
        '/_next/',
        '/admin/',
        '/studio/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
