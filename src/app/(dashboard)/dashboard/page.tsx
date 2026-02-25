import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Film, Settings, Coins, Star, TrendingUp,
  Tv, ArrowRight, Crown, CheckCircle2,
  Vote, CircleDollarSign,
  Building2, CreditCard, Key, ShieldCheck,
  Landmark, Globe, Server, ExternalLink,
  AlertCircle, Square, ChevronRight,
  Scale, Search, Clapperboard, PlayCircle, PiggyBank, Users, Sparkles, Zap, Banknote,
} from 'lucide-react'
import { getRecommendedTasks } from '@/app/actions/recommendations'
import { TASK_TYPE_LABELS, DIFFICULTY_LABELS } from '@/lib/constants'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          submissions: true,
          catalogFilms: true,
        },
      },
    },
  })

  if (!user) redirect('/login')

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

  // Get personalized task recommendations
  const recommendations = await getRecommendedTasks().catch(() => [])

  const now = new Date()
  const frenchDate = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-12">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-gray-400 text-sm capitalize mb-2">{frenchDate}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
            Bonjour, {user.displayName || 'Contributeur'}
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Votre hub central</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
            <Crown className="h-3 w-3 mr-1" />
            {user.level}
          </Badge>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
            <Coins className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-gray-900 text-sm font-semibold">{user.lumenBalance}</span>
            <span className="text-gray-400 text-xs">Lumens</span>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
        {[
          { label: 'Taches completees', value: user.tasksCompleted, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Points', value: user.points, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Reputation', value: `${user.reputationScore}/100`, icon: Star, color: 'text-[#D4AF37]', bg: 'bg-amber-50' },
          { label: 'Tokens Film', value: totalTokensHeld, icon: Coins, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-7">
            <div className="flex items-center gap-3 sm:gap-4 min-h-[52px]">
              <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-gray-900 text-lg sm:text-xl font-bold leading-tight truncate">{kpi.value}</p>
                <p className="text-gray-400 text-xs mt-1 truncate">{kpi.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts — Tokenization only */}
      {(pendingDividends > 0 || unvotedProposals > 0) && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          {pendingDividends > 0 && (
            <Link href="/tokenization/portfolio" className="flex-1 min-w-0 sm:min-w-[240px]">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl hover:border-amber-300 transition-all p-4 flex items-center gap-3">
                <CircleDollarSign className="h-5 w-5 text-amber-500" />
                <span className="text-gray-700 text-sm">{pendingDividends} dividende(s) a reclamer</span>
                <ArrowRight className="h-4 w-4 text-gray-300 ml-auto" />
              </div>
            </Link>
          )}
          {unvotedProposals > 0 && (
            <Link href="/tokenization/governance" className="flex-1 min-w-0 sm:min-w-[240px]">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl hover:border-purple-300 transition-all p-4 flex items-center gap-3">
                <Vote className="h-5 w-5 text-purple-500" />
                <span className="text-gray-700 text-sm">{unvotedProposals} vote(s) en attente</span>
                <ArrowRight className="h-4 w-4 text-gray-300 ml-auto" />
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Task Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-[#D4AF37]" />
            <h2 className="text-gray-900 font-bold text-lg font-playfair">
              Recommande pour vous
            </h2>
          </div>
          <Link href="/tasks" className="text-sm text-[#D4AF37] hover:underline">
            Voir toutes →
          </Link>
        </div>
        {recommendations.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((rec) => (
              <Link key={rec.id} href={`/tasks/${rec.id}`}>
                <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-[#D4AF37]/30 hover:shadow-md transition-all group">
                  {rec.isSkillMatch && (
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold">
                      MATCH
                    </span>
                  )}
                  <p className="text-sm font-semibold text-gray-800 mb-2 line-clamp-1 pr-14">{rec.title}</p>
                  <p className="text-xs text-gray-400 mb-3 truncate">
                    {rec.filmTitle} · {(TASK_TYPE_LABELS as Record<string, string>)[rec.type] || rec.type}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {(DIFFICULTY_LABELS as Record<string, string>)[rec.difficulty] || rec.difficulty}
                    </span>
                    <span className="text-sm font-bold text-[#D4AF37]">{rec.priceEuros}€</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-[#D4AF37]/60" />
            </div>
            <p className="text-gray-600 font-semibold mb-1">Pas encore de recommandations</p>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-5">Completez votre profil et realisez vos premieres taches pour recevoir des recommandations personnalisees.</p>
            <Link href="/tasks" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-white text-sm font-medium hover:bg-[#C5A028] transition-colors">
              Explorer les taches disponibles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Module 1 -- Studio Films */}
        <Link href="/tasks">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#D4AF37]/40 hover:shadow-md transition-all h-full group p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <Film className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-[#D4AF37] transition-colors" />
            </div>
            <h3 className="text-gray-900 font-semibold text-base">Studio Films</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Micro-taches cinema, VFX, doublage, montage.</p>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <span className="text-gray-400 text-xs">{user.tasksCompleted} taches</span>
              <span className="text-gray-200">|</span>
              <span className="text-gray-400 text-xs">{user.tasksValidated} validees</span>
            </div>
          </div>
        </Link>

        {/* Module 2 -- Streaming */}
        <Link href="/streaming">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-red-300 hover:shadow-md transition-all h-full group p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-red-50 flex items-center justify-center">
                <Tv className="h-5 w-5 text-red-500" />
              </div>
              <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-red-400 transition-colors" />
            </div>
            <h3 className="text-gray-900 font-semibold text-base">Streaming</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Soumettez et regardez les films IA.</p>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <span className="text-gray-400 text-xs">{user._count.catalogFilms} films soumis</span>
            </div>
          </div>
        </Link>

        {/* Module 3 -- Investissement */}
        <Link href="/tokenization">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all h-full group p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <Coins className="h-5 w-5 text-amber-500" />
              </div>
              <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="text-gray-900 font-semibold text-base">Investissement</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Tokens de films, dividendes, gouvernance.</p>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <span className="text-amber-500 text-xs">{totalTokensHeld} tokens</span>
              {pendingDividends > 0 && (
                <>
                  <span className="text-gray-200">|</span>
                  <span className="text-green-500 text-xs">{pendingDividends} dividende(s)</span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Module 4 -- Admin (admin only) */}
        {isAdmin && (
          <Link href="/admin">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all h-full group p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-orange-500" />
                </div>
                <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-orange-400 transition-colors" />
              </div>
              <h3 className="text-gray-900 font-semibold text-base">Administration</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Utilisateurs, catalogue, payouts.</p>
            </div>
          </Link>
        )}
      </div>

      {/* Screenwriter Banner */}
      {(user.role === 'SCREENWRITER' || user.role === 'ADMIN') && (
        <Link href="/dashboard/screenwriter" className="block p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center">
                <Scale className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Espace Scenariste</h3>
                <p className="text-xs text-gray-500">Gerez vos scenarios, suivez les votes et scores IA</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
          </div>
        </Link>
      )}

      {/* Referral Banner */}
      <Link href="/dashboard/referral" className="block p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Parrainage</h3>
              <p className="text-xs text-gray-500">Invitez des amis et gagnez 30 Lumens par filleul</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-purple-500 transition-colors" />
        </div>
      </Link>

      {/* Earnings Banner */}
      <Link href="/dashboard/earnings" className="block p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Banknote className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Mes Revenus</h3>
              <p className="text-xs text-gray-500">Historique des gains, stats mensuelles et previsions</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-green-600 transition-colors" />
        </div>
      </Link>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {[
          { label: 'Trouver une tache', href: '/tasks', icon: Search, color: 'text-[#D4AF37]', bg: 'bg-amber-50' },
          { label: 'Decouvrir les films', href: '/films', icon: Clapperboard, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Voir le streaming', href: '/streaming', icon: PlayCircle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Investir', href: '/tokenization', icon: PiggyBank, color: 'text-green-500', bg: 'bg-green-50' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex items-center gap-3 p-6 rounded-xl ${action.bg} border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all min-h-[60px] group`}
          >
            <action.icon className={`h-5 w-5 shrink-0 ${action.color}`} />
            <span className="text-gray-600 text-sm font-medium group-hover:text-gray-800 transition-colors">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Launch Checklist -- Admin Only */}
      {isAdmin && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-7 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-gray-900 text-lg font-bold font-[family-name:var(--font-playfair)]">
                  Checklist de Lancement
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Actions requises avant la mise en production
                </p>
              </div>
            </div>
          </div>
          <div className="px-7 pb-7">
            <div className="space-y-3">
              {([
                {
                  title: 'Creer une entite legale en Israel (Ltd)',
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
                  title: 'Obtenir les cles API (Claude, ElevenLabs, Runway)',
                  icon: Key,
                  helper: 'CLAUDE',
                  needsAttention: true,
                },
                {
                  title: 'Souscrire a un KYC provider (Sumsub)',
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
                  title: 'Deployer sur Coolify/Hetzner',
                  icon: Server,
                  helper: 'CLAUDE',
                  needsAttention: false,
                },
              ] as const).map((item) => (
                <div
                  key={item.title}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <Square className={`h-4 w-4 shrink-0 ${item.needsAttention ? 'text-[#D4AF37]/60' : 'text-gray-200'}`} />
                  <item.icon className={`h-4 w-4 shrink-0 ${item.needsAttention ? 'text-[#D4AF37]' : 'text-gray-300'}`} />
                  <span className={`text-sm flex-1 min-w-0 ${item.needsAttention ? 'text-gray-700' : 'text-gray-400'}`}>
                    {item.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1.5 py-0 h-4 shrink-0 ${
                      item.helper === 'CLAUDE'
                        ? 'border-purple-200 text-purple-500'
                        : item.helper === 'HUMAN'
                        ? 'border-orange-200 text-orange-500'
                        : 'border-blue-200 text-blue-500'
                    }`}
                  >
                    {item.helper === 'CLAUDE' ? 'Claude' : item.helper === 'HUMAN' ? 'Humain' : 'Les deux'}
                  </Badge>
                  {'link' in item && item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors sm:opacity-0 sm:group-hover:opacity-100 shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
