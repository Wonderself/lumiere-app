'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play, Info } from 'lucide-react'

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
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
  'https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=400&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
]

function getStatusLabel(status: string) {
  switch (status) {
    case 'DRAFT': return 'En Developpement'
    case 'PRE_PRODUCTION': return 'Pre-Production'
    case 'IN_PRODUCTION': return 'En Production'
    case 'POST_PRODUCTION': return 'Post-Production'
    case 'RELEASED': return 'Disponible'
    case 'LIVE': return 'En Streaming'
    default: return status
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'RELEASED':
    case 'LIVE': return '#10B981'
    case 'IN_PRODUCTION': return '#D4AF37'
    case 'PRE_PRODUCTION': return '#3B82F6'
    case 'POST_PRODUCTION': return '#8B5CF6'
    default: return '#888888'
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
    <section className="relative group/row mb-8 md:mb-10">
      {/* Row title */}
      <div className="flex items-center justify-between px-4 md:px-12 mb-3">
        <h2 className="text-lg md:text-xl font-bold text-white/90 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
          {title}
        </h2>
        {href && (
          <Link href={href} className="text-xs text-[#D4AF37] hover:text-[#F0D060] transition-colors font-medium">
            Tout voir &rsaquo;
          </Link>
        )}
      </div>

      {/* Scroll container */}
      <div className="relative">
        {/* Left arrow */}
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-gradient-to-r from-[#0A0A0A] to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-8 w-8 text-white/80" />
          </button>
        )}

        {/* Right arrow */}
        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-gradient-to-l from-[#0A0A0A] to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-8 w-8 text-white/80" />
          </button>
        )}

        {/* Films scroll */}
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-12 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {films.map((film, idx) => (
            <Link
              key={film.id}
              href={film.type === 'catalog' ? `/streaming/${film.slug}` : `/films/${film.slug}`}
              className="group/card flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[260px] relative rounded-md overflow-hidden transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-[0_8px_40px_rgba(212,175,55,0.15)]"
            >
              {/* Poster image */}
              <div className="relative aspect-[2/3] bg-[#1A1A1A]">
                <Image
                  src={film.coverImageUrl || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                  alt={film.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, (max-width: 1024px) 240px, 260px"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                      <Play className="h-4 w-4 text-black fill-black" />
                    </div>
                    <div className="h-8 w-8 rounded-full border border-white/40 flex items-center justify-center hover:border-white transition-colors">
                      <Info className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-white leading-tight">{film.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {film.genre && (
                      <span className="text-[10px] text-white/60">{film.genre}</span>
                    )}
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: getStatusColor(film.status) }}
                    >
                      {getStatusLabel(film.status)}
                    </span>
                  </div>
                  {film.progressPct > 0 && (
                    <div className="mt-2 h-0.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF37] rounded-full"
                        style={{ width: `${film.progressPct}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Status badge (always visible) */}
                <div className="absolute top-2 left-2">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{
                      background: `${getStatusColor(film.status)}20`,
                      color: getStatusColor(film.status),
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {getStatusLabel(film.status)}
                  </span>
                </div>
              </div>

              {/* Title below poster */}
              <div className="p-2 bg-[#111]">
                <p className="text-xs font-medium text-white/80 truncate">{film.title}</p>
                {film.genre && (
                  <p className="text-[10px] text-white/30 mt-0.5">{film.genre}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
