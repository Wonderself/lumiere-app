import { prisma } from '@/lib/prisma'
import { NetflixHome } from '@/components/netflix/netflix-home'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Lumiere Cinema — Creez. Votez. Regardez.',
  description:
    'La premiere plateforme de cinema collaboratif propulsee par l\'IA. Micro-taches, streaming, production de films IA. Paris, Tel Aviv, Hollywood.',
}

async function getHomeData() {
  try {
    // Featured films for hero banner (most advanced projects)
    const heroFilms = await prisma.film.findMany({
      where: { isPublic: true, coverImageUrl: { not: null } },
      orderBy: [{ status: 'desc' }, { updatedAt: 'desc' }],
      take: 5,
      select: {
        id: true, title: true, slug: true, synopsis: true,
        genre: true, coverImageUrl: true, status: true,
      },
    })

    // All public films grouped by genre
    const allFilms = await prisma.film.findMany({
      where: { isPublic: true },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true, title: true, slug: true, genre: true,
        coverImageUrl: true, status: true, progressPct: true,
      },
    })

    // Catalog films (streaming)
    const catalogFilms = await prisma.catalogFilm.findMany({
      where: { status: { in: ['LIVE', 'APPROVED'] } },
      orderBy: { viewCount: 'desc' },
      select: {
        id: true, title: true, slug: true, genre: true,
        thumbnailUrl: true, posterUrl: true, status: true, viewCount: true,
      },
    })

    // Group films by genre
    const genres = new Map<string, typeof allFilms>()
    for (const film of allFilms) {
      const genre = film.genre || 'Autre'
      if (!genres.has(genre)) genres.set(genre, [])
      genres.get(genre)!.push(film)
    }

    // Films in production
    const inProduction = allFilms.filter(f =>
      f.status === 'IN_PRODUCTION' || f.status === 'POST_PRODUCTION'
    )

    // Films in development
    const inDevelopment = allFilms.filter(f =>
      f.status === 'DRAFT' || f.status === 'PRE_PRODUCTION'
    )

    // Released films
    const released = allFilms.filter(f => f.status === 'RELEASED')

    return {
      heroFilms: heroFilms.map(f => ({ ...f, type: 'film' as const })),
      allFilms: allFilms.map(f => ({ ...f, type: 'film' as const })),
      catalogFilms: catalogFilms.map(f => ({
        id: f.id,
        title: f.title,
        slug: f.slug,
        genre: f.genre,
        coverImageUrl: f.posterUrl || f.thumbnailUrl,
        status: f.status,
        progressPct: 0,
        type: 'catalog' as const,
      })),
      genres: Object.fromEntries(
        Array.from(genres.entries())
          .filter(([, films]) => films.length > 0)
          .map(([genre, films]) => [genre, films.map(f => ({ ...f, type: 'film' as const }))])
      ),
      inProduction: inProduction.map(f => ({ ...f, type: 'film' as const })),
      inDevelopment: inDevelopment.map(f => ({ ...f, type: 'film' as const })),
      released: released.map(f => ({ ...f, type: 'film' as const })),
    }
  } catch {
    // DB not available — return empty data
    return {
      heroFilms: [],
      allFilms: [],
      catalogFilms: [],
      genres: {},
      inProduction: [],
      inDevelopment: [],
      released: [],
    }
  }
}

export default async function HomePage() {
  const data = await getHomeData()

  return <NetflixHome data={data} />
}
