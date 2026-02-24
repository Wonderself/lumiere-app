'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
  'https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=400&q=80',
]

export function TopTenRow({ films }: { films: FilmCard[] }) {
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

  const topFilms = films.slice(0, 10)

  return (
    <section className="relative group/row mb-8 md:mb-10">
      <div className="px-4 md:px-12 mb-3">
        <h2 className="text-lg md:text-xl font-bold text-white/90 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
          Top 10 des Projets
        </h2>
      </div>

      <div className="relative">
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-gradient-to-r from-[#0A0A0A] to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-8 w-8 text-white/80" />
          </button>
        )}

        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-gradient-to-l from-[#0A0A0A] to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-8 w-8 text-white/80" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-12 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {topFilms.map((film, idx) => (
            <Link
              key={film.id}
              href={film.type === 'catalog' ? `/streaming/${film.slug}` : `/films/${film.slug}`}
              className="group/card flex-shrink-0 flex items-end relative"
            >
              {/* Big number */}
              <div
                className="text-[120px] sm:text-[140px] md:text-[160px] font-black leading-none text-transparent select-none mr-[-20px] z-10"
                style={{
                  WebkitTextStroke: '3px rgba(212, 175, 55, 0.4)',
                  fontFamily: 'var(--font-playfair)',
                }}
              >
                {idx + 1}
              </div>

              {/* Poster */}
              <div className="relative w-[120px] sm:w-[140px] md:w-[160px] aspect-[2/3] rounded-md overflow-hidden transition-all duration-300 group-hover/card:scale-105 group-hover/card:shadow-[0_8px_40px_rgba(212,175,55,0.15)]">
                <Image
                  src={film.coverImageUrl || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                  alt={film.title}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-[10px] font-bold text-white truncate">{film.title}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
