'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Info, Volume2, VolumeX } from 'lucide-react'

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

interface HeroBannerProps {
  films: HeroFilm[]
}

export function HeroBanner({ films }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const [muted, setMuted] = useState(true)

  const film = films[current]

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (films.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % films.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [films.length])

  if (!film) return null

  const href = film.type === 'catalog' ? `/streaming/${film.slug}` : `/films/${film.slug}`

  return (
    <div className="relative w-full h-[56vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={film.coverImageUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80'}
          alt={film.title}
          fill
          className="object-cover transition-all duration-1000"
          sizes="100vw"
          priority
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/30" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-16 sm:pb-20 md:pb-28 px-4 md:px-12">
        <div className="max-w-2xl">
          {/* Logo / Title */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-white leading-tight drop-shadow-lg"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {film.title}
          </h1>

          {/* Genre + Status badges */}
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            {film.genre && (
              <span className="text-sm font-medium text-[#D4AF37]">{film.genre}</span>
            )}
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="text-sm text-white/60">
              {film.status === 'RELEASED' || film.status === 'LIVE' ? 'Disponible en streaming' : 'En developpement'}
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-sm md:text-base text-white/70 mb-5 md:mb-6 line-clamp-3 leading-relaxed max-w-xl">
            {film.synopsis || 'Decouvrez ce projet en developpement sur Lumiere Cinema.'}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Link
              href={href}
              className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-md text-sm md:text-base font-bold text-black transition-all hover:opacity-90 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)' }}
            >
              <Play className="h-5 w-5 fill-black" />
              {film.status === 'RELEASED' || film.status === 'LIVE' ? 'Regarder' : 'Decouvrir'}
            </Link>
            <Link
              href={href}
              className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-md text-sm md:text-base font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
            >
              <Info className="h-5 w-5" />
              Plus d&apos;infos
            </Link>
          </div>
        </div>
      </div>

      {/* Volume / Dots indicator */}
      <div className="absolute bottom-20 md:bottom-28 right-4 md:right-12 flex items-center gap-3">
        <button
          onClick={() => setMuted(!muted)}
          className="h-9 w-9 rounded-full border border-white/30 flex items-center justify-center hover:border-white/60 transition-colors"
        >
          {muted ? <VolumeX className="h-4 w-4 text-white/60" /> : <Volume2 className="h-4 w-4 text-white/60" />}
        </button>
      </div>

      {/* Dots navigation */}
      {films.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {films.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === current ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
