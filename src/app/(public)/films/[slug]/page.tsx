import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export const dynamic = 'force-dynamic'
import Image from 'next/image'
import { Film, ChevronRight, Lock, CheckCircle, Loader2, Star, ArrowRight, Coins, Crown, Vote, TrendingUp, Bell } from 'lucide-react'
import { FILM_STATUS_LABELS, PHASE_LABELS, TASK_TYPE_LABELS, DIFFICULTY_LABELS } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const film = await prisma.film.findUnique({ where: { slug } })
  if (!film) return { title: 'Film introuvable' }
  return {
    title: `${film.title} — Film en Production`,
    description: film.description || film.synopsis || `Film Lumière : ${film.title}`,
    openGraph: {
      title: `${film.title} — Film en Production | Lumière`,
      description: film.description || film.synopsis || undefined,
      images: film.coverImageUrl ? [film.coverImageUrl] : undefined,
    },
  }
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

  if (!film) notFound()

  const availableTasks = await prisma.task.count({
    where: { filmId: film.id, status: 'AVAILABLE' },
  })

  const phaseStatusIcon = (status: string) => {
    if (status === 'COMPLETED') return <CheckCircle className="h-5 w-5 text-green-400" />
    if (status === 'ACTIVE') return <Loader2 className="h-5 w-5 text-[#D4AF37] animate-spin" />
    return <Lock className="h-5 w-5 text-white/20" />
  }

  const phaseStatusColor = (status: string) => {
    if (status === 'COMPLETED') return 'border-green-500/20 bg-green-500/5'
    if (status === 'ACTIVE') return 'border-[#D4AF37]/30 bg-[#D4AF37]/5'
    return 'border-white/5 bg-white/[0.01] opacity-60'
  }

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-72 md:h-96">
        {film.coverImageUrl ? (
          <Image src={film.coverImageUrl} alt={film.title} fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/10 via-purple-900/20 to-black flex items-center justify-center">
            <Film className="h-24 w-24 text-[#D4AF37]/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

        <div className="absolute bottom-8 left-4 right-4 container mx-auto max-w-5xl">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="default">{film.genre || 'Film IA'}</Badge>
                <Badge variant="secondary">{FILM_STATUS_LABELS[film.status]}</Badge>
                {availableTasks > 0 && (
                  <Badge variant="success">{availableTasks} tâches disponibles</Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                {film.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
        {/* Synopsis + Stats */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {film.synopsis && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-[#D4AF37]">Synopsis</h2>
                <p className="text-white/60 leading-relaxed">{film.synopsis}</p>
              </div>
            )}
            {film.description && !film.synopsis && (
              <p className="text-white/60 leading-relaxed">{film.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {/* Progress card */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Progression globale</h3>
              <div className="text-5xl font-bold text-[#D4AF37] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                {Math.round(film.progressPct)}%
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] rounded-full transition-all duration-1000"
                  style={{ width: `${film.progressPct}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
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
            <div className="grid grid-cols-2 gap-3">
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

        {/* Phases */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Phases de Production
          </h2>
          <div className="space-y-4">
            {film.phases.map((phase) => (
              <div key={phase.id} className={`rounded-xl border p-6 transition-all ${phaseStatusColor(phase.status)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {phaseStatusIcon(phase.status)}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {phase.phaseOrder}. {PHASE_LABELS[phase.phaseName]}
                      </h3>
                      <p className="text-xs text-white/30 capitalize">{phase.status.toLowerCase()}</p>
                    </div>
                  </div>
                  <div className="text-sm text-white/40">
                    {phase._count.tasks} tâche{phase._count.tasks > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Sample tasks */}
                {phase.tasks.length > 0 && phase.status !== 'LOCKED' && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                    {phase.tasks.map((task) => (
                      <Link key={task.id} href={`/tasks/${task.id}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium line-clamp-1">{task.title}</span>
                            <Badge variant="secondary" className="text-xs hidden sm:block">
                              {TASK_TYPE_LABELS[task.type]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm font-medium text-[#D4AF37]">{formatPrice(task.priceEuros)}</span>
                            <ChevronRight className="h-4 w-4 text-white/20" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Co-Producer Section */}
        <div className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/[0.06] to-transparent p-8 md:p-10 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/[0.05] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/25 flex items-center justify-center">
                <Crown className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                Devenez Co-Producteur
              </h2>
            </div>

            <p className="text-white/50 mb-8 max-w-2xl text-lg leading-relaxed">
              Investissez dans ce film et recevez une part des revenus.
              Chaque token vous donne un droit de vote sur les decisions creatives.
            </p>

            {film.tokenOffering && film.tokenOffering.status === 'OPEN' ? (
              <div className="space-y-6">
                {/* Offering stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-[#D4AF37]/10 bg-white/[0.03] p-4 text-center">
                    <div className="text-2xl font-bold text-[#D4AF37]" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {film.tokenOffering.tokenPrice}&#8364;
                    </div>
                    <div className="text-xs text-white/30 mt-1">Prix / token</div>
                  </div>
                  <div className="rounded-xl border border-[#D4AF37]/10 bg-white/[0.03] p-4 text-center">
                    <div className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {Math.round(film.tokenOffering.raised).toLocaleString('fr-FR')}&#8364;
                    </div>
                    <div className="text-xs text-white/30 mt-1">Leves</div>
                  </div>
                  <div className="rounded-xl border border-[#D4AF37]/10 bg-white/[0.03] p-4 text-center">
                    <div className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {film.tokenOffering.tokensSold}
                    </div>
                    <div className="text-xs text-white/30 mt-1">Tokens vendus</div>
                  </div>
                  {film.tokenOffering.projectedROI && (
                    <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-playfair)' }}>
                        ~{film.tokenOffering.projectedROI}%
                      </div>
                      <div className="text-xs text-white/30 mt-1">ROI estime</div>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-white/50">Progression de la levee</span>
                    <span className="text-[#D4AF37] font-semibold">
                      {film.tokenOffering.hardCap > 0 ? Math.round((film.tokenOffering.raised / film.tokenOffering.hardCap) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] rounded-full transition-all duration-1000"
                      style={{ width: `${film.tokenOffering.hardCap > 0 ? Math.min(100, (film.tokenOffering.raised / film.tokenOffering.hardCap) * 100) : 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-white/30">
                    <span>{Math.round(film.tokenOffering.raised).toLocaleString('fr-FR')}&#8364; leves</span>
                    <span>Objectif : {Math.round(film.tokenOffering.hardCap).toLocaleString('fr-FR')}&#8364;</span>
                  </div>
                </div>

                {/* Benefits row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: TrendingUp, label: 'Revenus partages' },
                    { icon: Vote, label: 'Droit de vote' },
                    { icon: Crown, label: 'Nom au generique' },
                  ].map((b) => (
                    <div key={b.label} className="flex items-center gap-2 text-xs text-white/40">
                      <b.icon className="h-3.5 w-3.5 text-[#D4AF37]" />
                      {b.label}
                    </div>
                  ))}
                </div>

                {/* CTA */}
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
                {/* Benefits when no offering yet */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { icon: Coins, title: 'Investissez des 10\u20AC', desc: 'Tokens de co-production accessibles a tous' },
                    { icon: Vote, title: 'Votez', desc: 'Participez aux decisions creatives du film' },
                    { icon: Crown, title: 'Au Generique', desc: 'Votre nom credite comme co-producteur' },
                  ].map((b) => (
                    <div key={b.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                      <b.icon className="h-6 w-6 text-[#D4AF37]/60 mx-auto mb-2" />
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
      </div>
    </div>
  )
}
