import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Search, Users, Film, Heart, ChevronRight, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ACTOR_STYLE_LABELS } from '@/lib/constants'
import { formatFollowers, getNationalityFlag } from '@/lib/actors'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nos Acteurs IA — Lumiere',
  description: 'Decouvrez les talents virtuels qui donnent vie au cinema de demain.',
}

const STYLE_COLORS: Record<string, string> = {
  DRAMATIC: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  COMEDY: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  ACTION: 'border-red-500/30 bg-red-500/10 text-red-400',
  VERSATILE: 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]',
  HORROR: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  ROMANCE: 'border-pink-500/30 bg-pink-500/10 text-pink-400',
  EXPERIMENTAL: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
}

async function getActors(search?: string, style?: string) {
  try {
    return await prisma.aIActor.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { nationality: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
        ...(style && style !== 'ALL' ? { style: style as any } : {}),
      },
      orderBy: [{ filmCount: 'desc' }, { socialFollowers: 'desc' }, { name: 'asc' }],
    })
  } catch {
    return []
  }
}

async function getStats() {
  try {
    const [actorCount, totalFilms, totalFollowers] = await Promise.all([
      prisma.aIActor.count({ where: { isActive: true } }),
      prisma.aIActor.aggregate({ where: { isActive: true }, _sum: { filmCount: true } }),
      prisma.aIActor.aggregate({ where: { isActive: true }, _sum: { socialFollowers: true } }),
    ])
    return {
      actors: actorCount,
      films: totalFilms._sum.filmCount || 0,
      followers: totalFollowers._sum.socialFollowers || 0,
    }
  } catch {
    return { actors: 0, films: 0, followers: 0 }
  }
}

export default async function ActorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const actors = await getActors(params.q, params.style)
  const stats = await getStats()

  const styles = ['ALL', ...Object.keys(ACTOR_STYLE_LABELS)] as const

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px]" />

        <div className="relative container mx-auto max-w-7xl px-4 pt-24 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Intelligence Artificielle Cinematographique</span>
            </div>
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Nos Acteurs IA
            </h1>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Decouvrez les talents virtuels qui donnent vie au cinema de demain.
              Chaque acteur est unique, avec sa personnalite, son style et son histoire.
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex justify-center gap-8 md:gap-16 mb-12">
            {[
              { label: 'Acteurs', value: stats.actors, icon: Users },
              { label: 'Films', value: stats.films, icon: Film },
              { label: 'Fans', value: formatFollowers(stats.followers), icon: Heart },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="h-5 w-5 text-[#D4AF37]/60" />
                  <span className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {stat.value}
                  </span>
                </div>
                <span className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-lg mx-auto mb-8">
            <form className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
              <input
                name="q"
                type="text"
                placeholder="Rechercher un acteur..."
                defaultValue={params.q || ''}
                className="w-full h-12 pl-12 pr-4 rounded-full border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 backdrop-blur-sm transition-all"
              />
              {params.style && <input type="hidden" name="style" value={params.style} />}
            </form>
          </div>

          {/* Style Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {styles.map((s) => {
              const isActive = (!params.style && s === 'ALL') || params.style === s
              const href =
                s === 'ALL'
                  ? params.q
                    ? `/actors?q=${params.q}`
                    : '/actors'
                  : params.q
                  ? `/actors?q=${params.q}&style=${s}`
                  : `/actors?style=${s}`
              return (
                <Link
                  key={s}
                  href={href}
                  className={`px-5 py-2 rounded-full text-sm border transition-all duration-300 ${
                    isActive
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'bg-white/[0.03] border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                  }`}
                >
                  {s === 'ALL' ? 'Tous' : ACTOR_STYLE_LABELS[s as keyof typeof ACTOR_STYLE_LABELS]}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Actors Grid */}
      <div className="container mx-auto max-w-7xl px-4 pb-24">
        {actors.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl">Aucun acteur trouve</p>
            <p className="text-sm mt-2">
              {params.q || params.style
                ? 'Essayez de modifier vos filtres.'
                : 'Les acteurs seront bientot disponibles.'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actors.map((actor) => (
              <Link key={actor.id} href={`/actors/${actor.slug}`}>
                <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden hover:border-[#D4AF37]/20 transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.08)]">
                  {/* Top gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="p-6">
                    {/* Avatar + Info */}
                    <div className="flex items-start gap-4 mb-5">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/10 to-purple-900/20 overflow-hidden group-hover:border-[#D4AF37]/60 transition-colors duration-500">
                          {actor.avatarUrl ? (
                            <img
                              src={actor.avatarUrl}
                              alt={actor.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#D4AF37]/40 text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                              {actor.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        {/* Active indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-green-500/20 border-2 border-[#0A0A0A] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                      </div>

                      {/* Name + Nationality */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white group-hover:text-[#D4AF37] transition-colors duration-300 truncate">
                          {actor.name}
                        </h3>
                        {actor.nationality && (
                          <p className="text-sm text-white/40 flex items-center gap-1.5 mt-0.5">
                            <span>{getNationalityFlag(actor.nationality)}</span>
                            <span>{actor.nationality}</span>
                          </p>
                        )}
                        <div className="mt-2">
                          <Badge
                            className={`text-xs ${
                              STYLE_COLORS[actor.style] || STYLE_COLORS.VERSATILE
                            }`}
                          >
                            {ACTOR_STYLE_LABELS[actor.style as keyof typeof ACTOR_STYLE_LABELS] || actor.style}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Quote */}
                    {actor.quote && (
                      <p className="text-sm text-white/30 italic line-clamp-2 mb-4 pl-4 border-l-2 border-[#D4AF37]/20">
                        &laquo; {actor.quote} &raquo;
                      </p>
                    )}

                    {/* Stats Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-white/40">
                          <Film className="h-3.5 w-3.5" />
                          <span>{actor.filmCount} film{actor.filmCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/40">
                          <Heart className="h-3.5 w-3.5" />
                          <span>{formatFollowers(actor.socialFollowers)}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#D4AF37]/30 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
