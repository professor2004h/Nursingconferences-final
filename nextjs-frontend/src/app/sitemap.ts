import { MetadataRoute } from 'next'
import { getPastConferences } from './getPastConferences'
import { getConferenceEvents } from './getconferences'
import { getSiteSettings, getWebsiteUrl } from './getSiteSettings'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let siteSettings = null;

  try {
    siteSettings = await getSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings for sitemap:', error);
  }

  const baseUrl = getWebsiteUrl(siteSettings);
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/conferences`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/brochure`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/poster-presenters`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/past-conference-gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/media-partners`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/structure/organizingCommittee`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  try {
    // Past conferences routes removed - now redirects to external URL

    // Get upcoming conferences for sitemap
    const upcomingConferences = await getConferenceEvents()
    const upcomingConferencePages: MetadataRoute.Sitemap = upcomingConferences.map((conference) => ({
      url: `${baseUrl}/events/${conference.slug.current}`,
      lastModified: new Date(conference.date),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [
      ...staticPages,
      ...upcomingConferencePages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if there's an error fetching dynamic content
    return staticPages
  }
}
