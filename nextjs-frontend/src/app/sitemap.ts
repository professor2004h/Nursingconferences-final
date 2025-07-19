import { MetadataRoute } from 'next'
import { getPastConferences } from './getPastConferences'
import { getConferenceEvents } from './getconferences'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://intelliglobalconferences.com'
  
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
      url: `${baseUrl}/past-conferences`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
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
  ]

  try {
    // Get past conferences for sitemap
    const pastConferences = await getPastConferences()
    const pastConferencePages: MetadataRoute.Sitemap = pastConferences.map((conference) => ({
      url: `${baseUrl}/past-conferences/${conference.slug.current}`,
      lastModified: new Date(conference.date),
      changeFrequency: 'monthly' as const,
      priority: conference.featured ? 0.7 : 0.6,
    }))

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
      ...pastConferencePages,
      ...upcomingConferencePages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if there's an error fetching dynamic content
    return staticPages
  }
}
