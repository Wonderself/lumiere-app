'use client'

import { useEffect, useRef, useState } from 'react'
import { HeroManifesto } from './hero-manifesto'
import { FilmRow } from './film-row'
import { NetflixHeader } from './netflix-header'
import { SplashScreen } from './splash-screen'
import { Footer } from '@/components/layout/footer'
import { GENRE_ORDER, FILMS_BY_GENRE, ALL_FILMS } from '@/data/films'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, ChevronLeft, ChevronRight, Pen, Palette, Music, Camera, Sparkles,
  Clapperboard, DollarSign, PlayCircle, Vote, Star, Users, MessageSquare,
  Flame, Laugh, Drama, Microscope, BookOpen, Swords, Ghost, Heart, Wand2, Clock,
  Activity, Briefcase, Film, Play, TrendingUp, Tv, Radio, Monitor,
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
  'Action':      { icon: Flame,      color: '#E50914', colorLight: '#FF4444', pattern: 'embers',    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&h=400&q=80' },
  'Comedy':      { icon: Laugh,      color: '#F59E0B', colorLight: '#FCD34D', pattern: 'confetti',  image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&h=400&q=80' },
  'Drama':       { icon: Drama,      color: '#8B5CF6', colorLight: '#C4B5FD', pattern: 'curtain',   image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&h=400&q=80' },
  'Sci-Fi':      { icon: Microscope, color: '#3B82F6', colorLight: '#93C5FD', pattern: 'scan',      image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&h=400&q=80' },
  'Documentary': { icon: BookOpen,   color: '#10B981', colorLight: '#6EE7B7', pattern: 'lens',      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&h=400&q=80' },
  'Thriller':    { icon: Ghost,      color: '#6366F1', colorLight: '#A5B4FC', pattern: 'shadow',    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&h=400&q=80' },
  'Animation':   { icon: Wand2,      color: '#EC4899', colorLight: '#F9A8D4', pattern: 'sparkle',   image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&h=400&q=80' },
  'Historical':  { icon: Clock,      color: '#D97706', colorLight: '#FCD34D', pattern: 'parchment', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&h=400&q=80' },
  'Romance':     { icon: Heart,      color: '#F43F5E', colorLight: '#FDA4AF', pattern: 'hearts',    image: 'https://images.unsplash.com/photo-1518676590747-1e3bb275183a?auto=format&fit=crop&w=800&h=400&q=80' },
  'Fantasy':     { icon: Swords,     color: '#A855F7', colorLight: '#D8B4FE', pattern: 'stars',     image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&h=400&q=80' },
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
  { icon: Palette, title: 'Design & VFX', description: 'Create visuals, storyboards, environments', href: '/tasks', accent: '#8B5CF6', accentLight: '#C4B5FD', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&h=500&q=80' },
  { icon: Music, title: 'Compose Music', description: 'Score original soundtracks for films', href: '/tasks', accent: '#F59E0B', accentLight: '#FCD34D', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&h=500&q=80' },
  { icon: Camera, title: 'Direct & Produce', description: 'Lead a film from script to screen', href: '/films', accent: '#10B981', accentLight: '#6EE7B7', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&h=500&q=80' },
  { icon: Sparkles, title: 'AI Micro-Tasks', description: 'Complete small tasks, earn rewards', href: '/tasks', accent: '#3B82F6', accentLight: '#93C5FD', image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=400&h=500&q=80' },
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

  // Trailers: films in DRAFT or PRE_PRODUCTION
  const trailerFilms = ALL_FILMS
    .filter((f) => f.status === 'DRAFT' || f.status === 'PRE_PRODUCTION')
    .slice(0, 12)
    .map((f, i) => ({ ...f, id: `trailer-${i}` }))

  // Community vote: films with low funding
  const voteFilms = ALL_FILMS
    .filter((f) => f.fundingPct < 30)
    .slice(0, 10)
    .map((f, i) => ({ ...f, id: `cvote-${i}` }))

  const trailerScrollRef = useRef<HTMLDivElement>(null)
  const voteScrollRef = useRef<HTMLDivElement>(null)

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    if (!ref.current) return
    const amount = dir === 'left' ? -400 : 400
    ref.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

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

        {/* ── Bandes-Annonces — En Développement ── */}
        <section className="relative py-8 md:py-10">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          <div className="px-4 sm:px-8 md:px-16 lg:px-20 mt-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E50914]/20 bg-[#E50914]/10 text-[10px] font-bold text-[#E50914] uppercase tracking-wider">
                <Film className="h-3 w-3" />
                Bandes-Annonces
              </span>
            </div>
            <p className="text-[11px] text-white/30 mt-1 mb-4">Films in development — watch trailers, vote, invest, or volunteer to work</p>
          </div>

          <div className="relative group/trailers">
            {/* Left chevron */}
            <button
              onClick={() => scroll(trailerScrollRef, 'left')}
              className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 border border-white/10 flex items-center justify-center opacity-0 group-hover/trailers:opacity-100 transition-opacity duration-300 hover:bg-black/90"
            >
              <ChevronLeft className="h-4 w-4 text-white/70" />
            </button>
            {/* Right chevron */}
            <button
              onClick={() => scroll(trailerScrollRef, 'right')}
              className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 border border-white/10 flex items-center justify-center opacity-0 group-hover/trailers:opacity-100 transition-opacity duration-300 hover:bg-black/90"
            >
              <ChevronRight className="h-4 w-4 text-white/70" />
            </button>

            <div
              ref={trailerScrollRef}
              className="flex gap-3 md:gap-4 overflow-x-auto px-4 sm:px-8 md:px-16 lg:px-20 scroll-smooth snap-x snap-mandatory pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {trailerFilms.map((film) => {
                const raised = Math.round(((film.fundingPct / 100) * 250000))
                const goal = 250000
                return (
                  <div
                    key={film.id}
                    className="flex-shrink-0 snap-start w-[280px] md:w-[360px] rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-white/10"
                  >
                    {/* 16:9 poster area */}
                    <div className="relative" style={{ aspectRatio: '16 / 9' }}>
                      {film.coverImageUrl ? (
                        <Image
                          src={film.coverImageUrl}
                          alt={film.title}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="360px"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                      )}
                      <div className="absolute inset-0 bg-black/50" />
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#E50914] flex items-center justify-center shadow-lg shadow-[#E50914]/30">
                          <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                      {/* Bottom overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-[13px] font-bold text-white truncate">{film.title}</p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-semibold bg-white/10 text-white/60">{film.genre}</span>
                      </div>
                    </div>
                    {/* Card body */}
                    <div className="p-3 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <button className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors">Vote</button>
                        <button className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25 transition-colors">Invest</button>
                        <button className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-colors">Work</button>
                      </div>
                      {/* Funding bar */}
                      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full bg-[#E50914]" style={{ width: `${film.fundingPct}%` }} />
                      </div>
                      <p className="text-[10px] text-white/25">${raised.toLocaleString()} raised of ${goal.toLocaleString()}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Soumis au Vote — Community Vote ── */}
        <section className="relative py-6 md:py-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          <div className="px-4 sm:px-8 md:px-16 lg:px-20 mt-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                <Users className="h-3 w-3" />
                Community Vote
              </span>
            </div>
            <p className="text-[11px] text-white/25 mt-1 mb-4">These films need your vote to enter the platform. Stake points to have your say.</p>
          </div>

          <div className="relative group/cvote">
            {/* Left chevron */}
            <button
              onClick={() => scroll(voteScrollRef, 'left')}
              className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 border border-white/10 flex items-center justify-center opacity-0 group-hover/cvote:opacity-100 transition-opacity duration-300 hover:bg-black/90"
            >
              <ChevronLeft className="h-4 w-4 text-white/70" />
            </button>
            {/* Right chevron */}
            <button
              onClick={() => scroll(voteScrollRef, 'right')}
              className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 border border-white/10 flex items-center justify-center opacity-0 group-hover/cvote:opacity-100 transition-opacity duration-300 hover:bg-black/90"
            >
              <ChevronRight className="h-4 w-4 text-white/70" />
            </button>

            <div
              ref={voteScrollRef}
              className="flex gap-3 overflow-x-auto px-4 sm:px-8 md:px-16 lg:px-20 scroll-smooth snap-x snap-mandatory pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {voteFilms.map((film) => {
                const approvePct = (film.fundingPct * 2) % 100
                const rejectPct = 100 - approvePct
                return (
                  <div
                    key={film.id}
                    className="flex-shrink-0 snap-start w-[160px] rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-white/10"
                  >
                    {/* 2:3 poster */}
                    <div className="relative" style={{ aspectRatio: '2 / 3' }}>
                      {film.coverImageUrl ? (
                        <Image
                          src={film.coverImageUrl}
                          alt={film.title}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="160px"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                      )}
                    </div>
                    {/* Card body */}
                    <div className="p-2.5 space-y-1.5">
                      <p className="text-[11px] font-bold text-white/80 truncate">{film.title}</p>
                      {/* Vote bar */}
                      <div className="flex h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
                        <div className="h-full bg-emerald-500/70 rounded-l-full" style={{ width: `${approvePct}%` }} />
                        <div className="h-full bg-red-500/50 rounded-r-full" style={{ width: `${rejectPct}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[8px] text-white/25">
                        <span className="text-emerald-400/60">{approvePct}% yes</span>
                        <span className="text-red-400/50">{rejectPct}% no</span>
                      </div>
                      <button className="w-full mt-1 px-2 py-1 rounded-md text-[9px] font-bold golden-border-btn border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors">
                        Vote
                      </button>
                      <p className="text-[8px] text-white/20 text-center">5 pts to stake</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      </div>

      {/* ── Rentrez dans le Cinéma — 3 hero cards ── */}
      <section className="relative py-12 md:py-16 px-4 sm:px-8 md:px-16 lg:px-20">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/20 to-transparent" />
        <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-[#E50914]/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] bg-amber-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E50914]/20 bg-[#E50914]/10 mb-4">
              <Clapperboard className="h-3.5 w-3.5 text-[#E50914]" />
              <span className="text-[11px] font-bold text-[#E50914] uppercase tracking-wider">Rentrez dans le Cinéma</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.1] section-title-flash">
              Your Role Awaits.
            </h2>
            <p className="text-sm md:text-base text-white/35 max-w-lg mx-auto mt-3 leading-relaxed">
              Act, produce, or work on films. Choose your path in the world of cinema.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                icon: Star,
                title: 'ACT',
                description: 'Become the star of iconic films. Upload your photo and see yourself on screen.',
                href: '/act',
                accent: '#E50914',
                accentLight: '#FF4444',
                image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&h=600&q=80',
              },
              {
                icon: Clapperboard,
                title: 'PRODUCE',
                description: 'Turn your vision into reality. Start and crowdfund your film project.',
                href: '/produce',
                accent: '#F59E0B',
                accentLight: '#FCD34D',
                image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&h=600&q=80',
              },
              {
                icon: Briefcase,
                title: 'WORK',
                description: 'Complete film tasks, get paid in cash or production shares.',
                href: '/work',
                accent: '#D97706',
                accentLight: '#FCD34D',
                image: 'https://images.unsplash.com/photo-1518676590747-1e3bb275183a?auto=format&fit=crop&w=800&h=600&q=80',
              },
            ].map((card, ci) => (
              <Link
                key={card.title}
                href={card.href}
                className="group/cinema relative block rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] golden-border-btn"
                style={{
                  aspectRatio: '4 / 5',
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
                {/* Full background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/cinema:scale-110"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/55 group-hover/cinema:bg-black/40 transition-all duration-500" />
                {/* Color gradient overlay */}
                <div
                  className="absolute inset-0 opacity-40 group-hover/cinema:opacity-60 transition-opacity duration-500"
                  style={{ background: `linear-gradient(to top, ${card.accent}60, transparent 60%)` }}
                />

                {/* Flash sweep */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div
                    className="absolute top-0 h-full w-[50%] opacity-15 group-hover/cinema:opacity-40"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${card.accent}30, rgba(255,255,255,0.12), ${card.accent}30, transparent)`,
                      animation: `glintSweep ${2.5 + ci * 0.2}s ease-in-out infinite`,
                      animationDelay: `${ci * 0.4}s`,
                    }}
                  />
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover/cinema:opacity-100 transition-all duration-500 pointer-events-none"
                  style={{ boxShadow: `0 12px 48px ${card.accent}30, 0 0 80px ${card.accent}10` }}
                />

                {/* Top edge highlight */}
                <div
                  className="absolute top-0 left-6 right-6 h-[1px] opacity-25 group-hover/cinema:opacity-60 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${card.accentLight}50, transparent)` }}
                />

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                  <div
                    className="h-full w-0 group-hover/cinema:w-full transition-all duration-700 ease-out"
                    style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, ${card.accentLight}, ${card.accent}, transparent)` }}
                  />
                </div>

                {/* Content — positioned at bottom */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover/cinema:scale-110 group-hover/cinema:rotate-3"
                    style={{
                      background: `linear-gradient(135deg, ${card.accent}70, ${card.accent}30)`,
                      boxShadow: `0 4px 20px ${card.accent}50, inset 0 1px 0 rgba(255,255,255,0.2)`,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <card.icon className="h-7 w-7 text-white" style={{ filter: `drop-shadow(0 0 6px ${card.accent})` }} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-wider mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[13px] md:text-[14px] text-white/50 leading-relaxed group-hover/cinema:text-white/75 transition-colors max-w-xs">
                    {card.description}
                  </p>

                  {/* Arrow link */}
                  <div className="flex items-center gap-2 mt-4 opacity-0 group-hover/cinema:opacity-100 transition-all duration-300 translate-y-2 group-hover/cinema:translate-y-0">
                    <span className="text-[12px] font-bold" style={{ color: card.accentLight }}>Enter</span>
                    <ArrowRight className="h-4 w-4 group-hover/cinema:translate-x-1 transition-transform" style={{ color: card.accentLight }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

      {/* ── CINEGEN TV Discovery Banner ── */}
      <section className="relative mx-4 sm:mx-8 md:mx-16 lg:mx-20 mb-8 rounded-2xl overflow-hidden">
        <div
          className="relative"
          style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(5,10,21,0.95) 50%, rgba(37,99,235,0.06) 100%)',
            border: '1px solid rgba(37,99,235,0.15)',
          }}
        >
          <div className="absolute top-0 right-[20%] w-[200px] h-[100px] bg-[#2563EB]/[0.08] rounded-full blur-[80px]" />
          <div className="relative z-10 px-6 sm:px-8 md:px-12 py-6 md:py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 mb-3">
                  <Tv className="h-3 w-3 text-[#2563EB]" />
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">New</span>
                </div>
                <h2 className="text-lg md:text-xl font-black text-white mb-1.5 tracking-tight">
                  Discover <span className="text-[#2563EB]">CINEGEN TV</span>
                </h2>
                <p className="text-xs text-white/35 max-w-md leading-relaxed">
                  AI-generated TV shows, live broadcasts, and original series. Create, produce, or invest in the future of television.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/tv" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#3B82F6] text-white text-xs font-bold transition-colors">
                  <Monitor className="h-3.5 w-3.5" /> Explore TV
                </Link>
                <Link href="/tv/live" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2563EB]/30 hover:bg-[#2563EB]/10 text-white/70 hover:text-white text-xs font-medium transition-all">
                  <Radio className="h-3.5 w-3.5 text-red-500" /> Live Now
                </Link>
                <Link href="/watch" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-white/50 hover:text-white text-xs font-medium transition-all">
                  <Play className="h-3.5 w-3.5" /> Watch All
                </Link>
              </div>
            </div>
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
              className="golden-border-btn golden-border-always group relative shrink-0 inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-[14px] font-bold text-white transition-all duration-500 hover:-translate-y-0.5 overflow-hidden"
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
