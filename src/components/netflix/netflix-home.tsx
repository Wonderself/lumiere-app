'use client'

import { HeroBanner } from './hero-banner'
import { FilmRow } from './film-row'
import { TopTenRow } from './top-ten-row'
import { CreatorBar } from './creator-bar'
import { ScreenwriterCTA } from './screenwriter-cta'
import { NetflixHeader } from './netflix-header'
import { Footer } from '@/components/layout/footer'

interface FilmCard {
  id: string
  title: string
  slug: string
  genre: string | null
  coverImageUrl: string | null
  status: string
  progressPct: number
  type: 'film' | 'catalog'
}

interface HeroFilm {
  id: string
  title: string
  slug: string
  synopsis: string | null
  genre: string | null
  coverImageUrl: string | null
  status: string
  type: 'film' | 'catalog'
}

interface HomeData {
  heroFilms: HeroFilm[]
  allFilms: FilmCard[]
  catalogFilms: FilmCard[]
  genres: Record<string, FilmCard[]>
  inProduction: FilmCard[]
  inDevelopment: FilmCard[]
  released: FilmCard[]
}

// Fallback data when DB is not available
const FALLBACK_HERO: HeroFilm[] = [
  {
    id: 'fallback-1',
    title: 'KETER — The Singularity Point',
    slug: 'keter-the-singularity-point',
    synopsis: "Christopher Nolan meets the Zohar. Un physicien decouvre que le point de singularite quantique correspond a la Keter de la Kabbale. Course contre la montre avant qu'une IA ne l'utilise pour recrire la realite.",
    genre: 'Science-Fiction',
    coverImageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&h=1080&fit=crop',
    status: 'PRE_PRODUCTION',
    type: 'film',
  },
  {
    id: 'fallback-2',
    title: 'MERCI... (The Miracle Protocol)',
    slug: 'merci-the-miracle-protocol',
    synopsis: "Docu-serie sur les miracles du 7 octobre. Temoignages de survivants, reconstitutions cinematiques, dimension spirituelle.",
    genre: 'Documentaire',
    coverImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop',
    status: 'IN_PRODUCTION',
    type: 'film',
  },
  {
    id: 'fallback-3',
    title: 'Exodus — La Traversee',
    slug: 'exodus-la-traversee',
    synopsis: "L'histoire epique de la liberation du peuple hebreu d'Egypte, reimaginee avec l'intelligence artificielle. Un film spectaculaire sur la liberte, la foi et le sacrifice.",
    genre: 'Historique',
    coverImageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920&h=1080&fit=crop',
    status: 'IN_PRODUCTION',
    type: 'film',
  },
]

const FALLBACK_FILMS: FilmCard[] = [
  { id: 'f1', title: 'KETER', slug: 'keter-the-singularity-point', genre: 'Science-Fiction', coverImageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop', status: 'PRE_PRODUCTION', progressPct: 10, type: 'film' },
  { id: 'f2', title: 'MERCI...', slug: 'merci-the-miracle-protocol', genre: 'Documentaire', coverImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200&fit=crop', status: 'IN_PRODUCTION', progressPct: 35, type: 'film' },
  { id: 'f3', title: 'Exodus', slug: 'exodus-la-traversee', genre: 'Historique', coverImageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&h=1200&fit=crop', status: 'IN_PRODUCTION', progressPct: 22, type: 'film' },
  { id: 'f4', title: "Code d'Esther", slug: 'le-code-desther', genre: 'Documentaire', coverImageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=1200&fit=crop', status: 'PRE_PRODUCTION', progressPct: 8, type: 'film' },
  { id: 'f5', title: 'Le Dernier Convoi', slug: 'le-dernier-convoi', genre: 'Drame', coverImageUrl: 'https://images.unsplash.com/photo-1527684651103-9a66277a1e40?w=800&h=1200&fit=crop', status: 'DRAFT', progressPct: 0, type: 'film' },
  { id: 'f6', title: 'Carnaval', slug: 'carnaval-bad-trip', genre: 'Horreur', coverImageUrl: 'https://images.unsplash.com/photo-1533709752211-118fcaf03312?w=800&h=1200&fit=crop', status: 'PRE_PRODUCTION', progressPct: 15, type: 'film' },
  { id: 'f7', title: 'Zion of Africa', slug: 'zion-of-africa', genre: 'Feature', coverImageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=1200&fit=crop', status: 'PRE_PRODUCTION', progressPct: 5, type: 'film' },
  { id: 'f8', title: 'Ortistes', slug: 'ortistes-the-gift', genre: 'Animation', coverImageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=1200&fit=crop', status: 'DRAFT', progressPct: 0, type: 'film' },
  { id: 'f9', title: 'Super-Heros', slug: 'super-heros', genre: 'Action', coverImageUrl: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=800&h=1200&fit=crop', status: 'DRAFT', progressPct: 0, type: 'film' },
  { id: 'f10', title: 'Na Nah Nahma', slug: 'na-nah-nahma-the-breslov-light', genre: 'Feature', coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=1200&fit=crop', status: 'PRE_PRODUCTION', progressPct: 12, type: 'film' },
]

export function NetflixHome({ data }: { data: HomeData }) {
  const heroFilms = data.heroFilms.length > 0 ? data.heroFilms : FALLBACK_HERO
  const hasDbData = data.allFilms.length > 0

  // Build rows
  const topFilms = hasDbData ? data.allFilms.slice(0, 10) : FALLBACK_FILMS
  const inProd = hasDbData ? data.inProduction : FALLBACK_FILMS.filter(f => f.status === 'IN_PRODUCTION')
  const inDev = hasDbData ? data.inDevelopment : FALLBACK_FILMS.filter(f => f.status === 'DRAFT' || f.status === 'PRE_PRODUCTION')

  // Genre rows
  const genreRows = Object.entries(data.genres)
    .filter(([, films]) => films.length >= 2)
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <NetflixHeader />

      {/* Hero Banner */}
      <HeroBanner films={heroFilms} />

      {/* Film Rows — overlapping hero bottom for seamless transition */}
      <div className="-mt-24 relative z-10 pb-20">
        {/* Top 10 */}
        <TopTenRow films={topFilms} />

        {/* Creator bar */}
        <CreatorBar />

        {/* Full selection */}
        <FilmRow title="Notre Selection" films={topFilms} href="/films" />

        {/* Screenwriter recruitment CTA */}
        <ScreenwriterCTA />

        {/* In production */}
        {inProd.length > 0 && (
          <FilmRow title="En Production" films={inProd} href="/films" />
        )}

        {/* Streaming catalog */}
        {data.catalogFilms.length > 0 && (
          <FilmRow title="Disponible en Streaming" films={data.catalogFilms} href="/streaming" />
        )}

        {/* Genre rows */}
        {genreRows.map(([genre, films]) => (
          <FilmRow key={genre} title={genre} films={films} />
        ))}

        {/* In development */}
        {inDev.length > 0 && (
          <FilmRow title="En Developpement" films={inDev} href="/films" />
        )}

        {/* Released */}
        {data.released.length > 0 && (
          <FilmRow title="Films Termines" films={data.released} href="/streaming" />
        )}
      </div>

      <Footer />
    </div>
  )
}
