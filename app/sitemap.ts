import { MetadataRoute } from 'next'
import { HOST_CITIES, FAN_HUB_CITIES } from '@/lib/cities'
import { getAllPosts } from '@/lib/blog'

const BASE = 'https://fanforged.fans'

export default function sitemap(): MetadataRoute.Sitemap {
  // Host city guide pages (full content, high value)
  const hostCityUrls = HOST_CITIES.flatMap((city) => [
    {
      url: `${BASE}/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE}/${city.slug}/watch-parties`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ])

  // Fan hub watch-party pages — only index if there's meaningful potential
  // These will naturally accumulate listings over time; the route resolves server-side.
  const fanHubUrls = FAN_HUB_CITIES.map((city) => ({
    url: `${BASE}/cities/${city.slug}/watch-parties`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // Blog posts
  const posts = getAllPosts()
  const blogUrls = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE}/matches`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE}/watch-parties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE}/list-your-venue`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...hostCityUrls,
    ...fanHubUrls,
    ...blogUrls,
    // Admin and dashboard are NOT indexed (robots.ts blocks them)
  ]
}
