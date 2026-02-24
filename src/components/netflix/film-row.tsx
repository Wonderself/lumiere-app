'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

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

interface FilmRowProps {
  title: string
  films: FilmCard[]
  href?: string
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=1200&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=1200&fit=crop',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=1200&fit=crop',
  'https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=800&h=1200&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=1200&fit=crop',
]

function getStatusLabel(status: string) {
  switch (status) {
    case 'DRAFT': return 'En Dev'
    case 'PRE_PRODUCTION': return 'Pre-Prod'
    case 'IN_PRODUCTION': return 'Production'
    case 'POST_PRODUCTION': return 'Post-Prod'
    case 'RELEASED': return 'Disponible'
    case 'LIVE': return 'Streaming'
    default: return status
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'RELEASED':
    case 'LIVE': return '#10B981'
    case 'IN_PRODUCTION': return '#D4AF37'
    case 'PRE_PRODUCTION': return '#60A5FA'
    case 'POST_PRODUCTION': return '#A78BFA'
    default: return '#6B7280'
  }
}

export function FilmRow({ title, films, href }: FilmRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const updateArrows = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 20)
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  if (films.length === 0) return null

  return (
    <section className="relative group/row mb-16 md:mb-20">
      {/* Row title */}
      <div className="flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-20 mb-6">
        <h2
          className="text-lg md:text-xl lg:text-2xl font-bold text-white/90 tracking-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="text-xs md:text-sm text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors font-medium tracking-wide group/link flex items-center gap-1"
          >
            Tout voir
            <ChevronRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {/* Scroll container */}
      <div className="relative">
        {/* Left arrow */}
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-16 md:w-20 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent flex items-center justify-start pl-3 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
          >
            <div className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80 hover:border-[#D4AF37]/30 transition-all">
              <ChevronLeft className="h-5 w-5 text-white/80" />
            </div>
          </button>
        )}

        {/* Right arrow */}
        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-16 md:w-20 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent flex items-center justify-end pr-3 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
          >
            <div className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80 hover:border-[#D4AF37]/30 transition-all">
              <ChevronRight className="h-5 w-5 text-white/80" />
            </div>
          </button>
        )}

        {/* Films scroll */}
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide px-4 sm:px-8 md:px-16 lg:px-20 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {films.map((film, idx) => (
            <Link
              key={film.id}
              href={film.type === 'catalog' ? `/streaming/${film.slug}` : `/films/${film.slug}`}
              className="group/card flex-shrink-0 w-[150px] sm:w-[175px] md:w-[210px] lg:w-[230px] relative transition-all duration-300 hover:scale-[1.06] hover:z-20"
            >
              {/* Poster image */}
              <div className="relative aspect-[2/3] bg-[#141414] rounded-xl overflow-hidden ring-1 ring-white/5 group-hover/card:ring-[#D4AF37]/30 transition-all duration-300 group-hover/card:shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
                <Image
                  src={film.coverImageUrl || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                  alt={film.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/card:scale-[1.08]"
                  sizes="(max-width: 640px) 150px, (max-width: 768px) 175px, (max-width: 1024px) 210px, 230px"
                />

                {/* Always-on subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  {/* Play button */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 group-hover/card:scale-100 scale-75">
                    <div className="h-13 w-13 rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.5)]" style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)' }}>
                      <Play className="h-5 w-5 text-black fill-black ml-0.5" />
                    </div>
                  </div>

                  <p className="text-[13px] font-bold text-white leading-tight">{film.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {film.genre && (
                      <span className="text-[11px] text-white/50">{film.genre}</span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: getStatusColor(film.status) }}>
                      {getStatusLabel(film.status)}
                    </span>
                  </div>
                  {film.progressPct > 0 && (
                    <div className="mt-2.5 h-[3px] bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${film.progressPct}%`,
                          background: 'linear-gradient(90deg, #D4AF37, #F0D060)',
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Status badge (always visible) */}
                <div className="absolute top-3.5 left-3.5">
                  <span
                    className="text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider backdrop-blur-xl"
                    style={{
                      background: `${getStatusColor(film.status)}18`,
                      color: getStatusColor(film.status),
                      border: `1px solid ${getStatusColor(film.status)}25`,
                    }}
                  >
                    {getStatusLabel(film.status)}
                  </span>
                </div>
              </div>

              {/* Title below poster */}
              <div className="pt-3.5 pb-2.5 px-1.5">
                <p className="text-[12px] sm:text-[13px] font-semibold text-white/80 truncate group-hover/card:text-white transition-colors">{film.title}</p>
                {film.genre && (
                  <p className="text-[10px] sm:text-[11px] text-white/30 mt-0.5">{film.genre}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
