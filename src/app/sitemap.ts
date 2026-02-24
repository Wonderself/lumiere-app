import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://cinema.lumiere.film'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/films`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/streaming`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/invest`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/roadmap`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/login`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/register`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/legal/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/legal/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Dynamic film pages (lazy import to avoid build-time DB connection)
  let filmPages: MetadataRoute.Sitemap = []
  try {
    const { prisma } = await import('@/lib/prisma')
    const films = await prisma.film.findMany({
      where: { isPublic: true },
      select: { slug: true, updatedAt: true },
    })
    filmPages = films.map((film) => ({
      url: `${baseUrl}/films/${film.slug}`,
      lastModified: film.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // DB not available — return static pages only
  }

  return [...staticPages, ...filmPages]
}
