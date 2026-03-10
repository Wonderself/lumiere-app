'use client'

import { useEffect, useState } from 'react'
import { HeroManifesto } from './hero-manifesto'
import { FilmRow } from './film-row'
import { NetflixHeader } from './netflix-header'
import { SplashScreen } from './splash-screen'
import { Footer } from '@/components/layout/footer'
import { GENRE_ORDER, FILMS_BY_GENRE } from '@/data/films'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, ChevronRight, Pen, Palette, Music, Camera, Sparkles,
  Clapperboard, DollarSign, PlayCircle, Vote, Star, Users, MessageSquare,
  Flame, Laugh, Drama, Microscope, BookOpen, Swords, Ghost, Heart, Wand2, Clock,
  Activity,
} from 'lucide-react'

/* ────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────── */

interface FilmCard {
  id: string
  title: string
  slug: string
  genre: string | null
  coverImageUrl: string | null
  status: string
  progressPct: number
  fundingPct?: number
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

/* ────────────────────────────────────────────────
   Data: Posters & Genre Films
   ──────────────────────────────────────────────── */

/* Fallback genre films — derived from the shared data module */
const FALLBACK_GENRE_FILMS: Record<string, FilmCard[]> = Object.fromEntries(
  GENRE_ORDER.map((genre) => [
    genre,
    (FILMS_BY_GENRE[genre] || []).map((f) => ({
      id: f.id,
      title: f.title,
      slug: f.slug,
      genre: f.genre,
      coverImageUrl: f.coverImageUrl,
      status: f.status,
      progressPct: f.progressPct,
      fundingPct: f.fundingPct,
      type: 'film' as const,
    })),
  ])
)

/* Deterministic shuffle: pick 1 film per genre in round-robin, then repeat — gives a good mix */
const TRENDING_FILMS: FilmCard[] = (() => {
  const mixed: FilmCard[] = []
  const maxPerRound = GENRE_ORDER.length
  for (let round = 0; round < 2; round++) {
    for (let gi = 0; gi < maxPerRound; gi++) {
      const genre = GENRE_ORDER[gi]
      const films = FALLBACK_GENRE_FILMS[genre] || []
      const pick = films[round + gi % films.length]
      if (pick) mixed.push({ ...pick, id: `trending-${round}-${gi}` })
    }
  }
  return mixed.slice(0, 20)
})()

/* ────────────────────────────────────────────────
   Genre config (icons + colors)
   ──────────────────────────────────────────────── */

const GENRE_CONFIG: Record<string, { icon: typeof Flame; color: string; colorLight: string; pattern: string; image: string }> = {
  'Action':      { icon: Flame,      color: '#E50914', colorLight: '#FF4444', pattern: 'embers',    image: 'https://plus.unsplash.com/premium_photo-1748959562766-0d6cd69a210f?auto=format&fit=crop&w=800&h=400&q=80' },
  'Comedy':      { icon: Laugh,      color: '#F59E0B', colorLight: '#FCD34D', pattern: 'confetti',  image: 'https://plus.unsplash.com/premium_photo-1682430945542-7d8742d4cb0e?auto=format&fit=crop&w=800&h=400&q=80' },
  'Drama':       { icon: Drama,      color: '#8B5CF6', colorLight: '#C4B5FD', pattern: 'curtain',   image: 'https://plus.unsplash.com/premium_photo-1661501691846-7bed1fdf5b95?auto=format&fit=crop&w=800&h=400&q=80' },
  'Sci-Fi':      { icon: Microscope, color: '#3B82F6', colorLight: '#93C5FD', pattern: 'scan',      image: 'https://plus.unsplash.com/premium_photo-1683121271048-88e13aa31c11?auto=format&fit=crop&w=800&h=400&q=80' },
  'Documentary': { icon: BookOpen,   color: '#10B981', colorLight: '#6EE7B7', pattern: 'lens',      image: 'https://plus.unsplash.com/premium_photo-1674389991716-c85ddd942811?auto=format&fit=crop&w=800&h=400&q=80' },
  'Thriller':    { icon: Ghost,      color: '#6366F1', colorLight: '#A5B4FC', pattern: 'shadow',    image: 'https://plus.unsplash.com/premium_photo-1661891158359-1cb37357707c?auto=format&fit=crop&w=800&h=400&q=80' },
  'Animation':   { icon: Wand2,      color: '#EC4899', colorLight: '#F9A8D4', pattern: 'sparkle',   image: 'https://plus.unsplash.com/premium_photo-1732776567082-cbcd94f49316?auto=format&fit=crop&w=800&h=400&q=80' },
  'Historical':  { icon: Clock,      color: '#D97706', colorLight: '#FCD34D', pattern: 'parchment', image: 'https://plus.unsplash.com/premium_photo-1697730060425-c2e6aae61e04?auto=format&fit=crop&w=800&h=400&q=80' },
  'Romance':     { icon: Heart,      color: '#F43F5E', colorLight: '#FDA4AF', pattern: 'hearts',    image: 'https://plus.unsplash.com/premium_photo-1723673057176-1bf5582ed316?auto=format&fit=crop&w=800&h=400&q=80' },
  'Fantasy':     { icon: Swords,     color: '#A855F7', colorLight: '#D8B4FE', pattern: 'stars',     image: 'https://plus.unsplash.com/premium_photo-1747592231452-55a8355d53e3?auto=format&fit=crop&w=800&h=400&q=80' },
}

/* ────────────────────────────────────────────────
   Pillar blocks
   ──────────────────────────────────────────────── */

const pillars = [
  {
    icon: Clapperboard,
    title: 'PRODUCE',
    sub: 'Submit scripts, assemble a team, and lead your own film production.',
    href: '/films',
    image: '/images/ai-film-production-team-meeting.webp',
    accent: '#E50914',
    gradient: 'from-[#E50914]/40 via-[#E50914]/10 to-transparent',
  },
  {
    icon: DollarSign,
    title: 'FUND',
    sub: 'Back the projects you believe in. Invest in independent cinema.',
    href: '/invest',
    image: '/images/editions-ruppin-library-partnership.webp',
    accent: '#10B981',
    gradient: 'from-emerald-500/40 via-emerald-500/10 to-transparent',
  },
  {
    icon: PlayCircle,
    title: 'CREATE',
    sub: 'Micro-tasks: design, compose, write. Earn Lumens for every contribution.',
    href: '/tasks',
    image: '/images/studio-workflow-maison-desk.webp',
    accent: '#3B82F6',
    gradient: 'from-blue-500/40 via-blue-500/10 to-transparent',
  },
]

/* ────────────────────────────────────────────────
   Create cards
   ──────────────────────────────────────────────── */

const createCards = [
  { icon: Pen, title: 'Write a Screenplay', description: 'Submit your story to the community vote', href: '/community/scenarios', accent: '#E50914', accentLight: '#FF4444', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&h=500&q=80' },
  { icon: Palette, title: 'Design & VFX', description: 'Create visuals, storyboards, environments', href: '/tasks', accent: '#8B5CF6', accentLight: '#C4B5FD', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=500&q=80' },
  { icon: Music, title: 'Compose Music', description: 'Score original soundtracks for films', href: '/tasks', accent: '#F59E0B', accentLight: '#FCD34D', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&h=500&q=80' },
  { icon: Camera, title: 'Direct & Produce', description: 'Lead a film from script to screen', href: '/films', accent: '#10B981', accentLight: '#6EE7B7', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&h=500&q=80' },
  { icon: Sparkles, title: 'AI Micro-Tasks', description: 'Complete small tasks, earn rewards', href: '/tasks', accent: '#3B82F6', accentLight: '#93C5FD', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&h=500&q=80' },
]

/* ────────────────────────────────────────────────
   Live counter hook (fake animated counter)
   ──────────────────────────────────────────────── */

function useLiveCounter(base: number) {
  const [mounted, setMounted] = useState(false)
  const [count, setCount] = useState(base)
  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3))
    }, 4000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])
  return mounted ? count : null
}

/* ────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────── */

export function NetflixHome({ data }: { data: HomeData }) {
  const hasDbData = data.allFilms.length > 0
  const trendingFilms = hasDbData ? data.allFilms.slice(0, 14) : TRENDING_FILMS

  // Top 10: pick the highest-funded films across all genres
  const top10Films: FilmCard[] = Object.values(FALLBACK_GENRE_FILMS)
    .flat()
    .sort((a, b) => (b.fundingPct ?? 0) - (a.fundingPct ?? 0))
    .slice(0, 10)
    .map((f, i) => ({ ...f, id: `top10-${i}` }))

  // ALWAYS show all 10 genre rows (fallback), regardless of DB
  const allGenreRows = GENRE_ORDER.map(genre => [genre, FALLBACK_GENRE_FILMS[genre]] as [string, FilmCard[]])
  // Documentary row is extracted to show first; remaining genres split in half
  const docRow = allGenreRows.find(([g]) => g === 'Documentary')
  const otherGenreRows = allGenreRows.filter(([g]) => g !== 'Documentary')
  const firstHalfGenres = otherGenreRows.slice(0, 5)
  const secondHalfGenres = otherGenreRows.slice(5)

  const voteCount = useLiveCounter(2847)
  const contributorCount = useLiveCounter(1203)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <SplashScreen />
      <NetflixHeader />

      {/* ── Hero ── */}
      <HeroManifesto />

      <div className="relative z-10">
        {/* ── Category Pills — Cinematic genre buttons with Unsplash backgrounds ── */}
        <section className="relative pt-1 pb-4 md:pt-2 md:pb-5">
          {/* Live activity bar */}
          <div className="flex items-center gap-4 px-4 sm:px-8 md:px-16 lg:px-20 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E50914] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E50914]" />
              </span>
              <span className="text-[10px] text-white/30 font-medium">{voteCount !== null ? voteCount.toLocaleString() : '—'} votes cast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-emerald-500/60" />
              <span className="text-[10px] text-white/30 font-medium">{contributorCount !== null ? contributorCount.toLocaleString() : '—'} contributors</span>
            </div>
          </div>

          <div
            className="flex items-stretch gap-2.5 md:gap-3 overflow-x-auto px-4 sm:px-8 md:px-16 lg:px-20 scroll-smooth snap-x snap-mandatory py-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {GENRE_ORDER.map((genre, gi) => {
              const cfg = GENRE_CONFIG[genre] || { icon: Star, color: '#888', colorLight: '#aaa', pattern: 'none', image: '' }
              const Icon = cfg.icon
              const filmCount = FALLBACK_GENRE_FILMS[genre]?.length || 10
              return (
                <Link
                  key={genre}
                  href={`#genre-${genre.toLowerCase().replace(/[^a-z]/g, '')}`}
                  className="group/pill flex-shrink-0 snap-start relative w-[130px] md:w-[160px] h-[80px] md:h-[100px] rounded-xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.04] overflow-hidden"
                  style={{
                    boxShadow: `0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`,
                    border: `1px solid ${cfg.color}25`,
                  }}
                >
                  {/* Full background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/pill:scale-110"
                    style={{ backgroundImage: `url(${cfg.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover/pill:bg-black/35 transition-all duration-500" />
                  <div
                    className="absolute inset-0 opacity-30 group-hover/pill:opacity-50 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${cfg.color}40, transparent 70%)` }}
                  />

                  {/* Flash sweep */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="absolute top-0 h-full w-[50%] opacity-15 group-hover/pill:opacity-40"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${cfg.color}30, rgba(255,255,255,0.12), ${cfg.color}30, transparent)`,
                        animation: `glintSweep ${2.5 + gi * 0.15}s ease-in-out infinite`,
                        animationDelay: `${gi * 0.3}s`,
                      }}
                    />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2">
                    <div
                      className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all duration-500 group-hover/pill:scale-110 group-hover/pill:rotate-3"
                      style={{
                        background: `linear-gradient(135deg, ${cfg.color}60, ${cfg.color}30)`,
                        boxShadow: `0 2px 12px ${cfg.color}40`,
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      <Icon className="h-4 w-4 text-white" style={{ filter: `drop-shadow(0 0 4px ${cfg.color})` }} />
                    </div>
                    <span className="text-[11px] md:text-[12px] font-bold text-white tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{genre}</span>
                    <span className="text-[8px] text-white/40 font-medium">{filmCount} films</span>
                  </div>

                  {/* Film count badge — top right */}
                  <div
                    className="absolute top-1.5 right-1.5 text-[7px] font-black px-1 py-0.5 rounded backdrop-blur-sm"
                    style={{ background: `${cfg.color}BB`, color: '#fff' }}
                  >
                    {filmCount}
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                    <div
                      className="h-full w-0 group-hover/pill:w-full transition-all duration-700 ease-out"
                      style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, ${cfg.colorLight}, ${cfg.color}, transparent)` }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── Documentary (first row — featured) ── */}
        {docRow && (
          <div id="genre-documentary">
            <FilmRow title="Documentary" films={docRow[1]} />
          </div>
        )}

        {/* ── Top 10 ── */}
        <FilmRow
          title="Top 10"
          films={top10Films}
          href="/films"
          variant="trending"
        />

        {/* ── Pillar Blocks (2nd position) ── */}
        <section className="relative mb-10 md:mb-12 px-4 sm:px-8 md:px-16 lg:px-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg lg:text-xl font-bold text-white/90 tracking-tight section-title-flash">
              Get Involved
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {pillars.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="group relative aspect-[16/10] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/15 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-all duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${p.gradient}`} />
                <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/0 group-hover:via-white/20 to-transparent transition-all duration-700" />

                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                    style={{ background: `${p.accent}22` }}
                  >
                    <p.icon className="h-5 w-5" style={{ color: p.accent }} />
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-white tracking-wide mb-1">{p.title}</h3>
                  <p className="text-[11px] md:text-[12px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors line-clamp-2">{p.sub}</p>
                  <div className="flex items-center gap-1.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="text-[11px] font-semibold" style={{ color: p.accent }}>Explore</span>
                    <ArrowRight className="h-3 w-3" style={{ color: p.accent }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── First half of genre rows ── */}
        {firstHalfGenres.map(([genre, films]) => (
          <div key={genre} id={`genre-${genre.toLowerCase().replace(/[^a-z]/g, '')}`}>
            <FilmRow title={genre} films={films} />
          </div>
        ))}

        {/* ── Vote CTA Block ── */}
        <section className="relative my-10 md:my-14 mx-4 sm:mx-8 md:mx-16 lg:mx-20 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/10 via-[#0F0808] to-[#E50914]/5" />
          <div className="absolute inset-0 bg-[url('/images/cinema-clapperboard-clouds-hero.webp')] bg-cover bg-center opacity-[0.06]" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#E50914]/[0.08] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/[0.05] rounded-full blur-[80px]" />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.08]" />

          <div className="relative z-10 px-8 sm:px-10 md:px-14 py-10 md:py-14">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E50914]/20 bg-[#E50914]/10 mb-5 animate-[subtlePulse_3s_ease-in-out_infinite]">
                <Vote className="h-3.5 w-3.5 text-[#E50914]" />
                <span className="text-[11px] font-bold text-[#E50914] uppercase tracking-wider">Community Governance</span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight leading-[1.1] section-title-flash">
                Vote for the Next Film.
              </h2>
              <p className="text-sm md:text-base text-white/40 max-w-lg mb-8 leading-relaxed">
                Every film on CINEGEN is shaped by its community. Submit your stories, vote on scripts, and help decide what gets produced next.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: MessageSquare, title: 'Submit a Story', desc: 'Propose your screenplay idea', href: '/community/scenarios', accent: '#E50914' },
                  { icon: Vote, title: 'Vote on Scripts', desc: 'Read and vote for your favorites', href: '/community/vote', accent: '#F59E0B' },
                  { icon: Users, title: 'Join Community', desc: 'Collaborate and earn Lumens', href: '/community', accent: '#3B82F6' },
                ].map((cta) => (
                  <Link
                    key={cta.title}
                    href={cta.href}
                    className="group relative p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-all duration-500 hover:-translate-y-0.5"
                  >
                    <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/0 group-hover:via-white/15 to-transparent transition-all duration-700" />
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110"
                      style={{ background: `${cta.accent}15` }}
                    >
                      <cta.icon className="h-4 w-4" style={{ color: cta.accent }} />
                    </div>
                    <p className="text-[13px] font-bold text-white mb-1 group-hover:text-white transition-colors">{cta.title}</p>
                    <p className="text-[11px] text-white/30 leading-relaxed group-hover:text-white/50 transition-colors">{cta.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Second half of genre rows ── */}
        {secondHalfGenres.map(([genre, films]) => (
          <div key={genre} id={`genre-${genre.toLowerCase().replace(/[^a-z]/g, '')}`}>
            <FilmRow title={genre} films={films} />
          </div>
        ))}

        {/* ── Derniers Films (mixed row — moved lower) ── */}
        <FilmRow
          title="Derniers Films"
          films={trendingFilms}
          href="/films"
          variant="trending"
        />

      </div>

      {/* ── Start Creating — Deep 3D cards ── */}
      <section className="relative py-10 md:py-14 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/15 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white/90 tracking-tight section-title-flash">Start Creating</h2>
              <p className="text-xs text-white/35 mt-1">Join the production of our films</p>
            </div>
            <Link
              href="/tasks"
              className="group text-xs font-medium text-white/40 hover:text-[#E50914] transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-[#E50914]/20 hover:bg-[#E50914]/5"
            >
              Browse All <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {createCards.map((card, ci) => (
              <Link
                key={card.title}
                href={card.href}
                className="group/create relative block rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] overflow-hidden"
                style={{
                  boxShadow: `
                    0 4px 8px rgba(0,0,0,0.3),
                    0 12px 32px rgba(0,0,0,0.35),
                    0 24px 64px rgba(0,0,0,0.15),
                    inset 0 1px 0 rgba(255,255,255,0.1),
                    inset 0 -1px 0 rgba(0,0,0,0.4)
                  `,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* Background image zone — top of card */}
                <div className="relative h-28 sm:h-32 overflow-hidden">
                  {/* Unsplash background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/create:scale-110"
                    style={{ backgroundImage: `url(${card.image})` }}
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/50 group-hover/create:bg-black/35 transition-all duration-500" />
                  {/* Color tint */}
                  <div
                    className="absolute inset-0 opacity-30 group-hover/create:opacity-50 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${card.accent}50, transparent 70%)` }}
                  />

                  {/* Animated flash sweep */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="absolute top-0 h-full w-[50%] opacity-25 group-hover/create:opacity-50"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${card.accent}30, rgba(255,255,255,0.12), ${card.accent}30, transparent)`,
                        animation: `glintSweep ${2.5 + ci * 0.2}s ease-in-out infinite`,
                        animationDelay: `${ci * 0.3}s`,
                      }}
                    />
                  </div>

                  {/* (removed second flash + floating particles for performance) */}

                  {/* Icon — floating with glass effect */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover/create:scale-125 group-hover/create:rotate-6"
                      style={{
                        background: `linear-gradient(135deg, ${card.accent}60, ${card.accent}30)`,
                        boxShadow: `0 4px 20px ${card.accent}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
                        backdropFilter: 'blur(8px)',
                        animation: `iconFloat ${3.5 + ci * 0.2}s ease-in-out infinite`,
                        animationDelay: `${ci * 0.25}s`,
                      }}
                    >
                      <card.icon className="h-5 w-5 text-white" style={{ filter: `drop-shadow(0 0 6px ${card.accent})` }} />
                    </div>
                  </div>
                </div>

                {/* (removed breathing glow for performance) */}

                {/* Hover glow intensify */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover/create:opacity-100 transition-all duration-500 pointer-events-none"
                  style={{
                    boxShadow: `0 12px 48px ${card.accent}20, 0 0 80px ${card.accent}08`,
                  }}
                />

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                  <div
                    className="h-full w-0 group-hover/create:w-full transition-all duration-700 ease-out"
                    style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, ${card.accentLight}, ${card.accent}, transparent)` }}
                  />
                </div>

                {/* Top edge highlight */}
                <div
                  className="absolute top-0 left-4 right-4 h-[1px] opacity-25 group-hover/create:opacity-60 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${card.accentLight}50, transparent)` }}
                />

                {/* Text content */}
                <div className="relative bg-[#0A0A0A]/90 p-4 pt-3">
                  <p className="text-[12px] font-bold text-white/85 mb-1 group-hover/create:text-white transition-colors tracking-wide">{card.title}</p>
                  <p className="text-[10px] text-white/25 leading-relaxed group-hover/create:text-white/50 transition-colors">{card.description}</p>
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover/create:opacity-100 transition-all duration-400 translate-y-1 group-hover/create:translate-y-0">
                    <span className="text-[9px] font-semibold" style={{ color: card.accent }}>Explore</span>
                    <ArrowRight className="h-2.5 w-2.5" style={{ color: card.accent }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA — Compact 3D banner ── */}
      <section className="relative mx-4 sm:mx-8 md:mx-16 lg:mx-20 mb-10 rounded-2xl overflow-hidden">
        {/* 3D depth container */}
        <div
          className="relative"
          style={{
            background: 'linear-gradient(135deg, rgba(229,9,20,0.08) 0%, rgba(15,8,8,0.95) 40%, rgba(229,9,20,0.04) 100%)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Ambient glows */}
          <div className="absolute top-0 left-[20%] w-[200px] h-[100px] bg-[#E50914]/[0.08] rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-[10%] w-[150px] h-[80px] bg-blue-500/[0.04] rounded-full blur-[60px]" />
          {/* Animated shine */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 h-[1px] w-[60%] animate-[shimmerLine_8s_ease-in-out_infinite]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(229,9,20,0.3), transparent)' }} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 sm:px-10 md:px-14 py-8 md:py-10">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-2 tracking-tight section-title-flash">
                The Future of Cinema.
              </h2>
              <p className="text-xs md:text-sm text-white/35 max-w-md leading-relaxed">
                Independent films, documentaries and original series. Produced by the community, powered by AI.
              </p>
            </div>
            <Link
              href="/register"
              className="group relative shrink-0 inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-[14px] font-bold text-white transition-all duration-500 hover:-translate-y-0.5 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)',
                boxShadow: '0 6px 24px rgba(229,9,20,0.3), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.2)',
              }}
            >
              <span className="relative z-10">Get Started Free</span>
              <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
