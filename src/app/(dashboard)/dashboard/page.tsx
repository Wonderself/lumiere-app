import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Film, Video, Users, Settings,
  Coins, Star, TrendingUp,
  Tv, Wand2, Handshake, ChartLine,
  ArrowRight, Crown, CheckCircle2, Clock,
  EyeOff, Calendar, UserPlus,
  Vote, Scale, CircleDollarSign,
  Building2, CreditCard, Key, ShieldCheck,
  Landmark, Globe, Server, ExternalLink,
  AlertCircle, Square, ChevronRight
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      creatorProfile: true,
      _count: {
        select: {
          submissions: true,
          catalogFilms: true,
          sentCollabs: true,
          receivedCollabs: true,
          referralsMade: true,
        },
      },
    },
  })

  if (!user) redirect('/login')

  // Get recent videos count
  const videosCount = user.creatorProfile
    ? await prisma.generatedVideo.count({ where: { profileId: user.creatorProfile.id } })
    : 0

  const publishedVideos = user.creatorProfile
    ? await prisma.generatedVideo.count({ where: { profileId: user.creatorProfile.id, status: 'PUBLISHED' } })
    : 0

  // Pending collabs
  const pendingCollabs = await prisma.collabRequest.count({
    where: { toUserId: user.id, status: 'PENDING' },
  })

  // Active orders
  const activeOrders = await prisma.videoOrder.count({
    where: {
      OR: [
        { clientUserId: user.id },
        { creatorUserId: user.id },
      ],
      status: { in: ['CLAIMED', 'IN_PROGRESS', 'DELIVERED'] },
    },
  })

  // Tokenization data
  const tokenPurchases = await prisma.filmTokenPurchase.findMany({
    where: { userId: user.id, status: 'CONFIRMED' },
    select: { tokenCount: true },
  })
  const totalTokensHeld = tokenPurchases.reduce((sum, p) => sum + p.tokenCount, 0)

  const pendingDividends = await prisma.tokenDividend.count({
    where: { userId: user.id, status: 'PENDING' },
  })

  const activeProposals = await prisma.governanceProposal.count({
    where: {
      status: 'ACTIVE',
      deadline: { gt: new Date() },
    },
  })

  // Check if user has voted on active proposals
  const userVotesOnActive = await prisma.governanceVote.count({
    where: {
      userId: user.id,
      proposal: { status: 'ACTIVE', deadline: { gt: new Date() } },
    },
  })
  const unvotedProposals = activeProposals - userVotesOnActive

  const isAdmin = user.role === 'ADMIN'
  const hasCreatorProfile = !!user.creatorProfile

  const now = new Date()
  const frenchDate = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-white/30 text-sm capitalize mb-1">{frenchDate}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Bonjour, {user.displayName || 'Créateur'}
          </h1>
          <p className="text-white/30 mt-1.5 text-sm">Votre hub central</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
            <Crown className="h-3 w-3 mr-1" />
            {user.level}
          </Badge>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10">
            <Coins className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-white text-sm font-semibold">{user.lumenBalance}</span>
            <span className="text-white/30 text-xs">Lumens</span>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: 'Tâches complétées', value: user.tasksCompleted, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Vidéos créées', value: videosCount, icon: Video, color: 'text-blue-400' },
          { label: 'Réputation', value: `${user.reputationScore}/100`, icon: Star, color: 'text-[#D4AF37]' },
          { label: 'Points', value: user.points, icon: TrendingUp, color: 'text-purple-400' },
          { label: 'Tokens Film', value: totalTokensHeld, icon: Coins, color: 'text-amber-400' },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-white/[0.02] border-white/[0.06]">
            <CardContent className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 min-h-[76px]">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                <kpi.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${kpi.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-white text-lg sm:text-xl font-bold leading-tight truncate">{kpi.value}</p>
                <p className="text-white/30 text-[11px] sm:text-xs mt-0.5 truncate">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {(pendingCollabs > 0 || activeOrders > 0 || pendingDividends > 0 || unvotedProposals > 0) && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          {pendingCollabs > 0 && (
            <Link href="/collabs" className="flex-1 min-w-0 sm:min-w-[240px]">
              <Card className="bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40 transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <Handshake className="h-5 w-5 text-yellow-400" />
                  <span className="text-white text-sm">{pendingCollabs} collab(s) en attente</span>
                  <ArrowRight className="h-4 w-4 text-white/30 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          )}
          {activeOrders > 0 && (
            <Link href="/collabs/orders" className="flex-1 min-w-0 sm:min-w-[240px]">
              <Card className="bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="text-white text-sm">{activeOrders} commande(s) active(s)</span>
                  <ArrowRight className="h-4 w-4 text-white/30 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          )}
          {pendingDividends > 0 && (
            <Link href="/tokenization/portfolio" className="flex-1 min-w-0 sm:min-w-[240px]">
              <Card className="bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <CircleDollarSign className="h-5 w-5 text-amber-400" />
                  <span className="text-white text-sm">{pendingDividends} dividende(s) à réclamer</span>
                  <ArrowRight className="h-4 w-4 text-white/30 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          )}
          {unvotedProposals > 0 && (
            <Link href="/tokenization/governance" className="flex-1 min-w-0 sm:min-w-[240px]">
              <Card className="bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40 transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <Vote className="h-5 w-5 text-purple-400" />
                  <span className="text-white text-sm">{unvotedProposals} vote(s) en attente</span>
                  <ArrowRight className="h-4 w-4 text-white/30 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Module 1 — Studio Films */}
        <Link href="/tasks">
          <Card className="bg-gradient-to-br from-[#D4AF37]/[0.06] to-transparent border-white/[0.06] hover:border-[#D4AF37]/30 transition-all h-full group">
            <CardContent className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                  <Film className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-[#D4AF37] transition-colors" />
              </div>
              <h3 className="text-white font-semibold text-base">Studio Films</h3>
              <p className="text-white/30 text-sm leading-relaxed">Micro-tâches cinéma, VFX, doublage, montage.</p>
              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                <span className="text-white/40 text-xs">{user.tasksCompleted} tâches</span>
                <span className="text-white/20">|</span>
                <span className="text-white/40 text-xs">{user.tasksValidated} validées</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Module 2 — Créateur IA */}
        <Link href={hasCreatorProfile ? '/creator' : '/creator/wizard'}>
          <Card className="bg-gradient-to-br from-purple-500/[0.06] to-transparent border-white/[0.06] hover:border-purple-500/30 transition-all h-full group">
            <CardContent className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Wand2 className="h-5 w-5 text-purple-400" />
                </div>
                <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-white font-semibold text-base">Créateur IA</h3>
              <p className="text-white/30 text-sm leading-relaxed">
                {hasCreatorProfile
                  ? 'Générez des vidéos IA, planifiez, publiez.'
                  : 'Créez votre profil créateur pour commencer.'}
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                {hasCreatorProfile ? (
                  <>
                    <span className="text-purple-400/70 text-xs">{videosCount} vidéos</span>
                    <span className="text-white/20">|</span>
                    <span className="text-green-400/70 text-xs">{publishedVideos} publiées</span>
                  </>
                ) : (
                  <span className="text-yellow-400/70 text-xs">Profil non créé</span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Module 3 — Collabs & Growth */}
        <Link href="/collabs">
          <Card className="bg-gradient-to-br from-green-500/[0.06] to-transparent border-white/[0.06] hover:border-green-500/30 transition-all h-full group">
            <CardContent className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Handshake className="h-5 w-5 text-green-400" />
                </div>
                <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-green-400 transition-colors" />
              </div>
              <h3 className="text-white font-semibold text-base">Collabs & Growth</h3>
              <p className="text-white/30 text-sm leading-relaxed">Marketplace, commandes, parrainages.</p>
              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                <span className="text-white/40 text-xs">{user._count.sentCollabs + user._count.receivedCollabs} collabs</span>
                <span className="text-white/20">|</span>
                <span className="text-white/40 text-xs">{user._count.referralsMade} filleuls</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Module 4 — Analytics */}
        <Link href="/analytics">
          <Card className="bg-gradient-to-br from-blue-500/[0.06] to-transparent border-white/[0.06] hover:border-blue-500/30 transition-all h-full group">
            <CardContent className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <ChartLine className="h-5 w-5 text-blue-400" />
                </div>
                <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-white font-semibold text-base">Analytics</h3>
              <p className="text-white/30 text-sm leading-relaxed">Performance, revenus, engagement unifié.</p>
              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                <span className="text-blue-400/70 text-xs">Temps réel</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Streaming */}
        <Link href="/streaming">
          <Card className="bg-gradient-to-br from-red-500/[0.06] to-transparent border-white/[0.06] hover:border-red-500/30 transition-all h-full group">
            <CardContent className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Tv className="h-5 w-5 text-red-400" />
                </div>
                <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-red-400 transition-colors" />
              </div>
              <h3 className="text-white font-semibold text-base">Streaming</h3>
              <p className="text-white/30 text-sm leading-relaxed">Soumettez et regardez les films IA.</p>
              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                <span className="text-white/40 text-xs">{user._count.catalogFilms} films soumis</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Module 6 — Investissement */}
        <Link href="/tokenization">
          <Card className="bg-gradient-to-br from-amber-500/[0.06] to-transparent border-white/[0.06] hover:border-amber-500/30 transition-all h-full group">
            <CardContent className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-amber-400" />
                </div>
                <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="text-white font-semibold text-base">Investissement</h3>
              <p className="text-white/30 text-sm leading-relaxed">Tokens de films, dividendes, gouvernance.</p>
              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                <span className="text-amber-400/70 text-xs">{totalTokensHeld} tokens</span>
                {pendingDividends > 0 && (
                  <>
                    <span className="text-white/20">|</span>
                    <span className="text-green-400/70 text-xs">{pendingDividends} dividende(s)</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Admin (admin only) */}
        {isAdmin && (
          <Link href="/admin">
            <Card className="bg-gradient-to-br from-orange-500/[0.06] to-transparent border-white/[0.06] hover:border-orange-500/30 transition-all h-full group">
              <CardContent className="p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-orange-400" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-orange-400 transition-colors" />
                </div>
                <h3 className="text-white font-semibold text-base">Administration</h3>
                <p className="text-white/30 text-sm leading-relaxed">Utilisateurs, catalogue, payouts.</p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Générer une vidéo', href: '/creator/generate', icon: Wand2, color: 'text-purple-400', bg: 'bg-purple-500/[0.06]' },
          { label: 'Voir le planning', href: '/creator/schedule', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/[0.06]' },
          { label: 'NoFace Studio', href: '/creator/noface', icon: EyeOff, color: 'text-cyan-400', bg: 'bg-cyan-500/[0.06]' },
          { label: 'Inviter un ami', href: '/collabs/referrals', icon: UserPlus, color: 'text-green-400', bg: 'bg-green-500/[0.06]' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex items-center gap-3 p-4 rounded-xl ${action.bg} border border-white/[0.06] hover:border-white/10 transition-all min-h-[56px] group`}
          >
            <action.icon className={`h-5 w-5 shrink-0 ${action.color}`} />
            <span className="text-white/60 text-sm font-medium group-hover:text-white/80 transition-colors">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Launch Checklist — Admin Only */}
      {isAdmin && (
        <Card className="bg-gradient-to-b from-[#D4AF37]/[0.04] to-transparent border-[#D4AF37]/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <CardTitle className="text-white text-lg font-[family-name:var(--font-playfair)]">
                  Checklist de Lancement
                </CardTitle>
                <p className="text-white/30 text-xs mt-0.5">
                  Actions requises avant la mise en production
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {([
                {
                  title: 'Créer une entité légale en Israel (Ltd)',
                  icon: Building2,
                  helper: 'HUMAN',
                  needsAttention: true,
                  link: 'https://www.gov.il/en/departments/topics/companies-registrar',
                },
                {
                  title: 'Ouvrir un compte bancaire professionnel',
                  icon: Landmark,
                  helper: 'HUMAN',
                  needsAttention: true,
                },
                {
                  title: 'Configurer Stripe Connect pour les paiements',
                  icon: CreditCard,
                  helper: 'CLAUDE',
                  needsAttention: true,
                },
                {
                  title: 'Obtenir les clés API (Claude, ElevenLabs, Runway)',
                  icon: Key,
                  helper: 'CLAUDE',
                  needsAttention: true,
                },
                {
                  title: 'Souscrire à un KYC provider (Sumsub)',
                  icon: ShieldCheck,
                  helper: 'BOTH',
                  needsAttention: true,
                },
                {
                  title: 'Demander le sandbox ISA pour les tokens',
                  icon: Scale,
                  helper: 'HUMAN',
                  needsAttention: true,
                },
                {
                  title: 'Domaine + Cloudflare',
                  icon: Globe,
                  helper: 'CLAUDE',
                  needsAttention: false,
                },
                {
                  title: 'Déployer sur Coolify/Hetzner',
                  icon: Server,
                  helper: 'CLAUDE',
                  needsAttention: false,
                },
              ] as const).map((item) => (
                <div
                  key={item.title}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors duration-200 group"
                >
                  <Square className={`h-4 w-4 shrink-0 ${item.needsAttention ? 'text-[#D4AF37]/40' : 'text-white/15'}`} />
                  <item.icon className={`h-4 w-4 shrink-0 ${item.needsAttention ? 'text-[#D4AF37]/60' : 'text-white/20'}`} />
                  <span className={`text-sm flex-1 min-w-0 ${item.needsAttention ? 'text-white/70' : 'text-white/30'}`}>
                    {item.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1.5 py-0 h-4 shrink-0 ${
                      item.helper === 'CLAUDE'
                        ? 'border-purple-500/20 text-purple-400/70'
                        : item.helper === 'HUMAN'
                        ? 'border-orange-500/20 text-orange-400/70'
                        : 'border-blue-500/20 text-blue-400/70'
                    }`}
                  >
                    {item.helper === 'CLAUDE' ? 'Claude' : item.helper === 'HUMAN' ? 'Humain' : 'Les deux'}
                  </Badge>
                  {'link' in item && item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37]/40 hover:text-[#D4AF37] transition-colors sm:opacity-0 sm:group-hover:opacity-100 shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
