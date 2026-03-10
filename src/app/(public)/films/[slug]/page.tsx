import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'
import Image from 'next/image'
import { Film, ArrowRight, Coins, Crown, Vote, TrendingUp, Bell, Clock, Users, Star, Calendar, Tag } from 'lucide-react'
import { FILM_STATUS_LABELS } from '@/lib/constants'
import { FilmTimeline } from '@/components/film-timeline'
import { SocialShare } from '@/components/social-share'
import { FilmReviews } from '@/components/film-reviews'
import { FILMS_BY_SLUG, FILMS_BY_GENRE } from '@/data/films'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const film = await prisma.film.findUnique({ where: { slug } })
  if (film) {
    return {
      title: `${film.title} — CINEGEN`,
      description: film.description || film.synopsis || `${film.title} on CINEGEN`,
      openGraph: {
        title: `${film.title} — CINEGEN`,
        description: film.description || film.synopsis || undefined,
        images: film.coverImageUrl ? [film.coverImageUrl] : undefined,
      },
    }
  }
  // Fallback to shared data
  const fake = FILMS_BY_SLUG[slug]
  if (fake) {
    return {
      title: `${fake.title} — CINEGEN`,
      description: fake.synopsis || `${fake.title} on CINEGEN`,
      openGraph: {
        title: `${fake.title} — CINEGEN`,
        description: fake.synopsis || undefined,
      },
    }
  }
  return { title: 'Film Not Found — CINEGEN' }
}

export default async function FilmDetailPage({ params }: Props) {
  const { slug } = await params

  const film = await prisma.film.findUnique({
    where: { slug, isPublic: true },
    include: {
      phases: {
        orderBy: { phaseOrder: 'asc' },
        include: {
          tasks: {
            where: { status: { in: ['AVAILABLE', 'CLAIMED', 'VALIDATED'] } },
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
          _count: { select: { tasks: true } },
        },
      },
      tokenOffering: true,
      _count: { select: { tasks: true, votes: true, backers: true } },
    },
  })

  // If DB has the film, render the full DB-driven page
  if (film) {
    return <DbFilmPage film={film} />
  }

  // Fallback: check shared catalog data
  const fakeFilm = FILMS_BY_SLUG[slug]
  if (!fakeFilm) notFound()

  return <CatalogFilmPage film={fakeFilm} />
}

/* ─────────────────────────────────────────────
   DB Film Page (full features)
   ───────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DbFilmPage({ film }: { film: any }) {
  const availableTasks = 0 // Already counted in the main function for DB films

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: film.title,
    description: film.synopsis || film.description || undefined,
    genre: film.genre || undefined,
    image: film.coverImageUrl || undefined,
    url: `https://cinegen.studio/films/${film.slug}`,
    productionCompany: {
      '@type': 'Organization',
      name: 'CINEGEN Studio',
      url: 'https://cinegen.studio',
    },
    dateCreated: film.createdAt.toISOString(),
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Banner */}
      <div className="relative h-72 md:h-96">
        {film.coverImageUrl ? (
          <Image src={film.coverImageUrl} alt={film.title} fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#E50914]/10 via-purple-900/20 to-black flex items-center justify-center">
            <Film className="h-24 w-24 text-[#E50914]/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

        <div className="absolute bottom-8 left-4 right-4 container mx-auto max-w-5xl">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="default">{film.genre || 'Film IA'}</Badge>
                <Badge variant="secondary">{FILM_STATUS_LABELS[film.status as keyof typeof FILM_STATUS_LABELS] || film.status}</Badge>
                {availableTasks > 0 && (
                  <Badge variant="success">{availableTasks} tâches disponibles</Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-playfair">
                {film.title}
              </h1>
              <div className="mt-3">
                <SocialShare
                  url={`https://cinegen.studio/films/${film.slug}`}
                  title={`${film.title} — Film en Production | CINEGEN`}
                  description={film.synopsis || film.description || undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 sm:px-10 md:px-16 py-16 md:py-20 space-y-14 md:space-y-16">
        {/* Synopsis + Stats */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          <div className="md:col-span-2 space-y-4">
            {film.synopsis && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-[#E50914]">Synopsis</h2>
                <p className="text-white/60 leading-relaxed">{film.synopsis}</p>
              </div>
            )}
            {film.description && !film.synopsis && (
              <p className="text-white/60 leading-relaxed">{film.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {/* Progress card */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8">
              <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Progression globale</h3>
              <div className="text-5xl font-bold text-[#E50914] mb-3 font-playfair">
                {Math.round(film.progressPct)}%
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full transition-all duration-1000"
                  style={{ width: `${film.progressPct}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-5 text-center">
                <div>
                  <div className="text-xl font-bold">{film.completedTasks}</div>
                  <div className="text-xs text-white/30">Validées</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{film.totalTasks}</div>
                  <div className="text-xs text-white/30">Total</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Tâches dispo', value: availableTasks },
                { label: 'Votes', value: film._count.votes },
                { label: 'Backers', value: film._count.backers },
                { label: 'Phases', value: film.phases.length },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/30 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <Link href={`/tasks?film=${film.id}`}>
              <Button className="w-full" size="lg">
                Voir les Tâches Disponibles
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Production Timeline */}
        <FilmTimeline phases={film.phases as never} />

        {/* Co-Producer Section */}
        <CoProducerSection film={film} />

        {/* Community Reviews */}
        <FilmReviews filmId={film.id} />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Catalog Film Page (fake film from shared data)
   ───────────────────────────────────────────── */

import type { FilmData } from '@/data/films'

const GENRE_COLORS: Record<string, string> = {
  'Action': '#E50914',
  'Comedy': '#F59E0B',
  'Drama': '#8B5CF6',
  'Sci-Fi': '#3B82F6',
  'Documentary': '#10B981',
  'Thriller': '#6366F1',
  'Animation': '#EC4899',
  'Historical': '#D97706',
  'Romance': '#F43F5E',
  'Fantasy': '#A855F7',
}

function CatalogFilmPage({ film }: { film: FilmData }) {
  const accentColor = GENRE_COLORS[film.genre] || '#E50914'
  const statusLabel = FILM_STATUS_LABELS[film.status as keyof typeof FILM_STATUS_LABELS] || film.status
  const similarFilms = Object.values(FILMS_BY_GENRE[film.genre] || []).filter(f => f.slug !== film.slug).slice(0, 5)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: film.title,
    description: film.synopsis,
    genre: film.genre,
    image: film.coverImageUrl || undefined,
    url: `https://cinegen.studio/films/${film.slug}`,
    director: { '@type': 'Person', name: film.director },
    duration: film.duration,
    dateCreated: `${film.year}-01-01`,
    productionCompany: {
      '@type': 'Organization',
      name: 'CINEGEN Studio',
      url: 'https://cinegen.studio',
    },
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Banner */}
      <div className="relative h-72 md:h-96">
        {film.coverImageUrl ? (
          <Image src={film.coverImageUrl} alt={film.title} fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accentColor}15, #0A0A0A 50%, ${accentColor}08)` }}>
            <Film className="h-24 w-24" style={{ color: `${accentColor}30` }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

        <div className="absolute bottom-8 left-4 right-4 container mx-auto max-w-5xl">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="default" style={{ backgroundColor: accentColor }}>{film.genre}</Badge>
                <Badge variant="secondary">{statusLabel}</Badge>
                <Badge variant="outline" className="text-white/50 border-white/10">{film.rating}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-playfair section-title-flash">
                {film.title}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-white/40">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {film.year}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {film.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {film.director}</span>
              </div>
              <div className="mt-3">
                <SocialShare
                  url={`https://cinegen.studio/films/${film.slug}`}
                  title={`${film.title} — ${film.genre} | CINEGEN`}
                  description={film.synopsis}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 sm:px-10 md:px-16 py-16 md:py-20 space-y-14 md:space-y-16">
        {/* Synopsis + Stats */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: accentColor }}>Synopsis</h2>
              <p className="text-white/60 leading-relaxed text-base">{film.synopsis}</p>
            </div>

            {/* Cast & Crew */}
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: accentColor }}>Cast & Crew</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xs text-white/30 uppercase tracking-wider w-20 shrink-0 pt-0.5">Director</span>
                  <span className="text-white/70">{film.director}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs text-white/30 uppercase tracking-wider w-20 shrink-0 pt-0.5">Cast</span>
                  <span className="text-white/70">{film.cast.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {film.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-3.5 w-3.5 text-white/30" />
                {film.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Status-specific section */}
            {film.status === 'DRAFT' && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-6">
                <h3 className="text-base font-bold text-amber-400 mb-2 flex items-center gap-2">
                  <Vote className="h-4 w-4" /> En phase de developpement
                </h3>
                <p className="text-white/50 text-sm mb-4">Ce film est en cours de developpement. La communaute peut voter pour qu&apos;il passe en production.</p>
                <Link href="/community/scenarios" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-colors">
                  <Vote className="h-3.5 w-3.5" /> Voter pour ce film
                </Link>
              </div>
            )}

            {film.status === 'PRE_PRODUCTION' && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-6">
                <h3 className="text-base font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Pre-production
                </h3>
                <p className="text-white/50 text-sm mb-4">Ce film entre en phase de pre-production. L&apos;equipe prepare le storyboard, le casting et la planification.</p>
                <div className="flex flex-wrap gap-2">
                  {['Script', 'Storyboard', 'Casting', 'Previz', 'Design'].map((phase, i) => (
                    <span key={phase} className={`text-xs px-3 py-1.5 rounded-full border ${i < 2 ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-white/[0.06] bg-white/[0.02] text-white/30'}`}>
                      {i < 2 ? '✓ ' : ''}{phase}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {film.status === 'IN_PRODUCTION' && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">
                <h3 className="text-base font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <Film className="h-4 w-4" /> En production
                </h3>
                <p className="text-white/50 text-sm mb-4">Ce film est en cours de production ! Rejoignez l&apos;equipe en contribuant aux micro-taches.</p>
                <Link href="/tasks" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                  <ArrowRight className="h-3.5 w-3.5" /> Contribuer aux taches
                </Link>
              </div>
            )}

            {film.status === 'POST_PRODUCTION' && (
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.04] p-6">
                <h3 className="text-base font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Film className="h-4 w-4" /> Post-production
                </h3>
                <p className="text-white/50 text-sm mb-4">La bande-annonce est en preparation. Le montage final et les effets visuels sont en cours.</p>
                <div className="aspect-video rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <div className="text-center">
                    <Film className="h-8 w-8 text-purple-400/40 mx-auto mb-2" />
                    <p className="text-xs text-white/30">Bande-annonce a venir</p>
                  </div>
                </div>
              </div>
            )}

            {film.status === 'RELEASED' && (
              <div className="rounded-xl border border-[#E50914]/20 bg-[#E50914]/[0.04] p-6">
                <h3 className="text-base font-bold text-[#E50914] mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4" /> Film sorti
                </h3>
                <p className="text-white/50 text-sm mb-4">Ce film est disponible au visionnage. Laissez votre avis !</p>
                <Link href="/streaming" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914]/20 text-[#E50914] text-sm font-medium hover:bg-[#E50914]/30 transition-colors">
                  <ArrowRight className="h-3.5 w-3.5" /> Regarder
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Progress card */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8">
              <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Production Progress</h3>
              <div className="text-5xl font-bold mb-3 font-playfair" style={{ color: accentColor }}>
                {film.progressPct}%
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${film.progressPct}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}CC)` }}
                />
              </div>
            </div>

            {/* Funding card */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8">
              <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Funding</h3>
              <div className="text-5xl font-bold text-emerald-400 mb-3 font-playfair">
                {film.fundingPct}%
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(film.fundingPct, 100)}%`, background: 'linear-gradient(90deg, #059669, #10B981)' }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Genre', value: film.genre, icon: Star },
                { label: 'Year', value: film.year, icon: Calendar },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <s.icon className="h-4 w-4 mx-auto mb-1.5 text-white/30" />
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/30 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <Link href="/tasks">
              <Button className="w-full" size="lg">
                Contribute to this Film
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Co-Producer Section */}
        <div className="rounded-2xl border border-[#E50914]/20 bg-gradient-to-br from-[#E50914]/[0.06] to-transparent p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E50914]/[0.05] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/25 flex items-center justify-center">
                <Crown className="h-5 w-5 text-[#E50914]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-playfair">
                Become a Co-Producer
              </h2>
            </div>

            <p className="text-white/50 mb-8 max-w-2xl text-lg leading-relaxed">
              Invest in this film and receive a share of the revenue.
              Each token gives you a vote on creative decisions.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Coins, title: 'Invest from 10\u20AC', desc: 'Co-production tokens accessible to all' },
                { icon: Vote, title: 'Vote', desc: 'Participate in creative decisions' },
                { icon: Crown, title: 'Credits', desc: 'Your name credited as co-producer' },
              ].map((b) => (
                <div key={b.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <b.icon className="h-6 w-6 text-[#E50914]/60 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-white mb-1">{b.title}</h4>
                  <p className="text-xs text-white/30">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/tokenization">
                  <Button variant="outline" className="group">
                    <Bell className="h-4 w-4" />
                    View Available Offerings
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Films */}
        {similarFilms.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4" style={{ color: accentColor }}>Films similaires</h2>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {similarFilms.map((sf) => (
                <Link key={sf.slug} href={`/films/${sf.slug}`} className="flex-shrink-0 w-[120px] group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#141414] ring-1 ring-white/5 mb-2">
                    {sf.coverImageUrl ? (
                      <Image src={sf.coverImageUrl} alt={sf.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="120px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="h-6 w-6 text-white/10" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-white/60 truncate group-hover:text-white transition-colors">{sf.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Co-Producer Section (shared between DB films)
   ───────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CoProducerSection({ film }: { film: any }) {
  return (
    <div className="rounded-2xl border border-[#E50914]/20 bg-gradient-to-br from-[#E50914]/[0.06] to-transparent p-8 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E50914]/[0.05] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/25 flex items-center justify-center">
            <Crown className="h-5 w-5 text-[#E50914]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-playfair">
            Devenez Co-Producteur
          </h2>
        </div>

        <p className="text-white/50 mb-8 max-w-2xl text-lg leading-relaxed">
          Investissez dans ce film et recevez une part des revenus.
          Chaque token vous donne un droit de vote sur les decisions creatives.
        </p>

        {film.tokenOffering && film.tokenOffering.status === 'OPEN' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="rounded-xl border border-[#E50914]/10 bg-white/[0.03] p-4 text-center">
                <div className="text-2xl font-bold text-[#E50914] font-playfair">
                  {film.tokenOffering.tokenPrice}&#8364;
                </div>
                <div className="text-xs text-white/30 mt-1">Prix / token</div>
              </div>
              <div className="rounded-xl border border-[#E50914]/10 bg-white/[0.03] p-4 text-center">
                <div className="text-2xl font-bold text-white font-playfair">
                  {Math.round(film.tokenOffering.raised).toLocaleString('fr-FR')}&#8364;
                </div>
                <div className="text-xs text-white/30 mt-1">Leves</div>
              </div>
              <div className="rounded-xl border border-[#E50914]/10 bg-white/[0.03] p-4 text-center">
                <div className="text-2xl font-bold text-white font-playfair">
                  {film.tokenOffering.tokensSold}
                </div>
                <div className="text-xs text-white/30 mt-1">Tokens vendus</div>
              </div>
              {film.tokenOffering.projectedROI && (
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 font-playfair">
                    ~{film.tokenOffering.projectedROI}%
                  </div>
                  <div className="text-xs text-white/30 mt-1">ROI estime</div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-white/50">Progression de la levee</span>
                <span className="text-[#E50914] font-semibold">
                  {film.tokenOffering.hardCap > 0 ? Math.round((film.tokenOffering.raised / film.tokenOffering.hardCap) * 100) : 0}%
                </span>
              </div>
              <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full transition-all duration-1000"
                  style={{ width: `${film.tokenOffering.hardCap > 0 ? Math.min(100, (film.tokenOffering.raised / film.tokenOffering.hardCap) * 100) : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-white/30">
                <span>{Math.round(film.tokenOffering.raised).toLocaleString('fr-FR')}&#8364; leves</span>
                <span>Objectif : {Math.round(film.tokenOffering.hardCap).toLocaleString('fr-FR')}&#8364;</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: TrendingUp, label: 'Revenus partages' },
                { icon: Vote, label: 'Droit de vote' },
                { icon: Crown, label: 'Nom au generique' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-xs text-white/40">
                  <b.icon className="h-3.5 w-3.5 text-[#E50914]" />
                  {b.label}
                </div>
              ))}
            </div>

            <Link href={`/tokenization/${film.id}`}>
              <Button size="lg" className="w-full sm:w-auto group">
                <Coins className="h-5 w-5" />
                Investir dans ce Film
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Coins, title: 'Investissez des 10\u20AC', desc: 'Tokens de co-production accessibles a tous' },
                { icon: Vote, title: 'Votez', desc: 'Participez aux decisions creatives du film' },
                { icon: Crown, title: 'Au Generique', desc: 'Votre nom credite comme co-producteur' },
              ].map((b) => (
                <div key={b.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <b.icon className="h-6 w-6 text-[#E50914]/60 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-white mb-1">{b.title}</h4>
                  <p className="text-xs text-white/30">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-white/40 mb-4">
                L&apos;offre de co-production sera bientot disponible.
                Suivez ce film pour etre notifie des son ouverture.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/tokenization">
                  <Button variant="outline" className="group">
                    <Bell className="h-4 w-4" />
                    Voir les Offres Disponibles
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
