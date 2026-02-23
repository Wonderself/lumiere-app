import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScenarioVoteButton } from '@/components/community/scenario-vote-button'
import Link from 'next/link'
import {
  PenTool, Crown, Heart, User, ArrowLeft, BookOpen,
  Film, Calendar, Award, Sparkles, Lock,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' | 'destructive' }> = {
  SUBMITTED: { label: 'Soumis', variant: 'secondary' },
  SHORTLISTED: { label: 'Pre-selectionne', variant: 'warning' },
  VOTING: { label: 'En Vote', variant: 'default' },
  WINNER: { label: 'Gagnant', variant: 'success' },
  ARCHIVED: { label: 'Archive', variant: 'secondary' },
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const scenario = await prisma.scenarioProposal.findUnique({
    where: { id },
    select: { title: true, logline: true },
  })
  if (!scenario) return { title: 'Scénario introuvable' }
  return {
    title: `${scenario.title} — Scénarios Lumière`,
    description: scenario.logline || 'Proposition de scénario sur la plateforme Lumière.',
    openGraph: {
      title: `${scenario.title} — Scénarios Lumière`,
      description: scenario.logline || 'Proposition de scénario sur la plateforme Lumière.',
    },
  }
}

export default async function ScenarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const scenario = await prisma.scenarioProposal.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, displayName: true, avatarUrl: true, level: true } },
      film: { select: { title: true, slug: true } },
      catalog: { select: { title: true, slug: true } },
    },
  })

  if (!scenario) notFound()

  // Session & premium check
  const session = await auth()
  const userId = session?.user?.id

  let isPremium = false
  let hasVoted = false
  if (userId) {
    const [sub, vote] = await Promise.all([
      prisma.subscription.findUnique({
        where: { userId },
        select: { plan: true },
      }),
      scenario.status === 'VOTING'
        ? prisma.scenarioVote.findUnique({
            where: { proposalId_userId: { proposalId: scenario.id, userId } },
          })
        : null,
    ])
    isPremium = !!sub && sub.plan !== 'FREE'
    hasVoted = !!vote
  }

  // Related scenarios (same genre or film, excluding current)
  const related = await prisma.scenarioProposal.findMany({
    where: {
      id: { not: scenario.id },
      OR: [
        ...(scenario.genre ? [{ genre: scenario.genre }] : []),
        ...(scenario.filmId ? [{ filmId: scenario.filmId }] : []),
      ],
      status: { in: ['VOTING', 'WINNER', 'SUBMITTED'] },
    },
    include: { author: { select: { displayName: true } } },
    orderBy: { votesCount: 'desc' },
    take: 4,
  })

  const statusInfo = STATUS_CONFIG[scenario.status] || STATUS_CONFIG.SUBMITTED
  const isVoting = scenario.status === 'VOTING'
  const isWinner = scenario.status === 'WINNER'

  const LEVEL_LABELS: Record<string, string> = {
    ROOKIE: 'Rookie',
    PRO: 'Pro',
    EXPERT: 'Expert',
    VIP: 'VIP',
  }
  const LEVEL_COLORS: Record<string, string> = {
    ROOKIE: 'text-gray-400',
    PRO: 'text-blue-400',
    EXPERT: 'text-purple-400',
    VIP: 'text-[#D4AF37]',
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">

        {/* Breadcrumb */}
        <Link
          href="/community/scenarios"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-[#D4AF37] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux scenarios
        </Link>

        {/* Main content area */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">

          {/* Left: Scenario content */}
          <div>
            {/* Status & Genre */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {isWinner && <Crown className="h-5 w-5 text-[#D4AF37]" />}
              <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">
                {statusInfo.label}
              </Badge>
              {scenario.genre && (
                <Badge variant="secondary">{scenario.genre}</Badge>
              )}
              <Badge variant="outline">Round {scenario.round}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              {isWinner && <span className="text-[#D4AF37]">&#9733; </span>}
              {scenario.title}
            </h1>

            {/* Logline */}
            <div className="mb-8 p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-lg text-white/70 italic leading-relaxed" style={{ fontFamily: 'var(--font-playfair)' }}>
                &ldquo;{scenario.logline}&rdquo;
              </p>
            </div>

            {/* Synopsis */}
            {scenario.synopsis && (
              <div className="mb-8">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <BookOpen className="h-5 w-5 text-[#D4AF37]" />
                  Synopsis
                </h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  {scenario.synopsis.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-white/60 leading-relaxed mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Film reference */}
            {(scenario.film || scenario.catalog) && (
              <div className="mb-8 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-3">
                <Film className="h-5 w-5 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="text-xs text-white/40">Film associe</span>
                  <p className="text-sm font-medium text-white/70">
                    {scenario.film?.title || scenario.catalog?.title}
                  </p>
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
              <Calendar className="h-3.5 w-3.5" />
              <span>Propose le {formatDate(scenario.createdAt)}</span>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">

            {/* Vote Card */}
            <Card variant={isVoting ? 'gold' : isWinner ? 'gold' : 'default'}>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className={`text-4xl font-bold tabular-nums ${isWinner || isVoting ? 'text-[#D4AF37]' : 'text-white'}`}>
                    {scenario.votesCount}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    vote{scenario.votesCount !== 1 ? 's' : ''}
                  </div>
                </div>

                {isVoting && userId && (
                  <ScenarioVoteButton
                    proposalId={scenario.id}
                    currentVotes={scenario.votesCount}
                    hasVoted={hasVoted}
                    isPremium={isPremium}
                  />
                )}

                {isVoting && !userId && (
                  <div className="space-y-2">
                    <p className="text-xs text-white/40">Connectez-vous pour voter</p>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-sm text-[#D4AF37] hover:text-[#F0D060] transition-colors"
                    >
                      Se connecter
                    </Link>
                  </div>
                )}

                {isWinner && (
                  <div className="flex items-center justify-center gap-2 text-[#D4AF37]">
                    <Award className="h-5 w-5" />
                    <span className="font-semibold text-sm">Scenario Gagnant</span>
                  </div>
                )}

                {!isVoting && !isWinner && (
                  <div className="flex items-center justify-center gap-2 text-white/30">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">Vote non ouvert</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Author Card */}
            <Card>
              <CardContent className="p-5">
                <h3 className="text-xs text-white/40 uppercase tracking-wider font-medium mb-3">Auteur</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-white/5 flex items-center justify-center text-sm font-bold text-[#D4AF37]">
                    {scenario.author.displayName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{scenario.author.displayName}</p>
                    <p className={`text-xs ${LEVEL_COLORS[scenario.author.level] || 'text-gray-400'}`}>
                      {LEVEL_LABELS[scenario.author.level] || scenario.author.level}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium CTA (if not premium and voting) */}
            {isVoting && userId && !isPremium && (
              <Card variant="gold">
                <CardContent className="p-5 text-center">
                  <Lock className="h-6 w-6 text-[#D4AF37] mx-auto mb-2" />
                  <h3 className="text-sm font-semibold mb-1">Debloquez le vote</h3>
                  <p className="text-xs text-white/40 mb-3">
                    Passez a Premium pour voter et influencer les futures productions.
                  </p>
                  <Link
                    href="/subscription"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#F0D060] transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Passer Premium
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Scenarios */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              <Sparkles className="h-5 w-5 text-[#D4AF37]" />
              Scenarios similaires
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((s) => {
                const sStatus = STATUS_CONFIG[s.status] || STATUS_CONFIG.SUBMITTED
                return (
                  <Link key={s.id} href={`/community/scenarios/${s.id}`}>
                    <Card className="h-full group cursor-pointer">
                      <CardContent className="p-5">
                        <Badge variant={sStatus.variant} className="mb-2">{sStatus.label}</Badge>
                        <h3 className="font-semibold text-sm group-hover:text-[#D4AF37] transition-colors mb-1.5">
                          {s.title}
                        </h3>
                        <p className="text-xs text-white/40 line-clamp-2 italic mb-2">{s.logline}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/30">{s.author.displayName}</span>
                          <div className="flex items-center gap-1 text-white/30">
                            <Heart className="h-3 w-3" />
                            <span className="text-xs tabular-nums">{s.votesCount}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
