import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Users,
  Eye,
  TrendingUp,
  Crown,
  ArrowUpRight,
  Clock,
  BarChart3,
  Zap,
  Sparkles,
  CalendarDays,
  Target,
  LinkIcon,
  ChevronRight,
  Activity,
  Hash,
  MessageCircle,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

// ========== PLATFORM CONFIG ==========
const PLATFORM_CONFIG: Record<string, {
  label: string
  color: string
  bgColor: string
  borderColor: string
  textColor: string
}> = {
  TIKTOK: {
    label: 'TikTok',
    color: '#ff0050',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    textColor: 'text-pink-400',
  },
  INSTAGRAM: {
    label: 'Instagram',
    color: '#E4405F',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    textColor: 'text-purple-400',
  },
  YOUTUBE: {
    label: 'YouTube',
    color: '#FF0000',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    textColor: 'text-red-400',
  },
  FACEBOOK: {
    label: 'Facebook',
    color: '#1877F2',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-400',
  },
  X: {
    label: 'X',
    color: '#1DA1F2',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/20',
    textColor: 'text-sky-400',
  },
}

const ALL_PLATFORMS = ['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'X', 'FACEBOOK'] as const

// ========== AI INSIGHTS (mock data — will connect to Claude API later) ==========
const AI_INSIGHTS = [
  {
    type: 'clock' as const,
    title: 'Postez a 19h le mardi sur TikTok',
    explanation: 'Votre audience est 3x plus active entre 18h et 20h en semaine. Le mardi montre le meilleur taux d\'engagement.',
    action: 'Planifier un post',
    actionHref: '/creator/schedule',
  },
  {
    type: 'chart' as const,
    title: 'Les videos Before/After performent 2.5x mieux',
    explanation: 'Vos contenus de type comparaison generent 2.5x plus de vues que la moyenne. Doublez ce format.',
    action: 'Creer une video',
    actionHref: '/creator/trending',
  },
  {
    type: 'hash' as const,
    title: 'Hashtags tendance : #IAcinema #FilmIA2027',
    explanation: 'Ces hashtags ont +340% de recherches cette semaine dans votre niche. Integrez-les dans vos prochains posts.',
    action: 'Voir les tendances',
    actionHref: '/creator/trending',
  },
  {
    type: 'users' as const,
    title: '67% de votre audience a 18-34 ans',
    explanation: 'Ciblez un ton decontracte et du contenu court (15-30s). Cette tranche prefere le format vertical.',
    action: null,
    actionHref: null,
  },
  {
    type: 'zap' as const,
    title: 'Cross-postez sur Instagram Reels',
    explanation: 'Vos videos TikTok pourraient toucher +40% d\'audience supplementaire sur Instagram Reels sans effort.',
    action: 'Configurer le cross-post',
    actionHref: '/creator/accounts',
  },
  {
    type: 'message' as const,
    title: 'Repondez aux commentaires dans l\'heure',
    explanation: 'Les createurs qui repondent en <1h voient +25% d\'engagement. Activez les notifications push.',
    action: 'Notifications',
    actionHref: '/notifications',
  },
]

const INSIGHT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  chart: BarChart3,
  hash: Hash,
  users: Users,
  zap: Zap,
  message: MessageCircle,
}

// ========== SPARKLINE COMPONENT ==========
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 120
  const height = 32
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((val - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="opacity-60">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  )
}

// ========== CALENDAR DOT COMPONENT ==========
function CalendarDot({ platform }: { platform: string }) {
  const config = PLATFORM_CONFIG[platform]
  return (
    <div
      className="h-2 w-2 rounded-full"
      style={{ backgroundColor: config?.color || '#666' }}
      title={config?.label || platform}
    />
  )
}

export default async function SocialHubPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile || !profile.wizardCompleted) {
    redirect('/creator/wizard')
  }

  // Fetch social accounts
  const socialAccounts = await prisma.socialAccount.findMany({
    where: { userId: session.user.id },
    orderBy: { followersCount: 'desc' },
  })

  // Fetch recent videos for stats
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentVideos = await prisma.generatedVideo.findMany({
    where: {
      profileId: profile.id,
      createdAt: { gte: thirtyDaysAgo },
    },
    select: {
      viewCount: true,
      likeCount: true,
      shareCount: true,
      platforms: true,
      status: true,
    },
  })

  // Aggregate videos stats
  const totalViewsThisMonth = recentVideos.reduce((sum, v) => sum + v.viewCount, 0)
  const totalLikesThisMonth = recentVideos.reduce((sum, v) => sum + v.likeCount, 0)

  // Fetch upcoming schedules for calendar
  const now = new Date()
  const sevenDaysLater = new Date()
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)

  const upcomingSchedules = await prisma.publishSchedule.findMany({
    where: {
      video: { profileId: profile.id },
      scheduledAt: { gte: now, lte: sevenDaysLater },
      status: 'SCHEDULED',
    },
    include: { video: { select: { title: true } } },
    orderBy: { scheduledAt: 'asc' },
  })

  // Compute aggregates
  const totalFollowers = socialAccounts.reduce((sum, acc) => sum + acc.followersCount, 0)
  const avgEngagement = socialAccounts.length > 0
    ? socialAccounts.reduce((sum, acc) => sum + acc.engagementRate, 0) / socialAccounts.length
    : 0
  const bestPlatform = socialAccounts.length > 0
    ? socialAccounts.reduce((best, acc) => acc.followersCount > best.followersCount ? acc : best, socialAccounts[0])
    : null

  // Create a map of connected platforms
  const connectedPlatforms = new Map(socialAccounts.map(a => [a.platform, a]))

  // Mock sparkline data (30 days of growth — will be real once we track daily stats)
  const sparklineData: Record<string, number[]> = {}
  for (const acc of socialAccounts) {
    const base = acc.followersCount
    sparklineData[acc.platform] = Array.from({ length: 30 }, (_, i) => {
      const variation = Math.sin(i * 0.3) * (base * 0.02) + (i / 30) * (base * 0.05)
      return Math.round(base - (base * 0.05) + variation)
    })
  }

  // Calendar: next 7 days
  const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date
  })

  // Group schedules by date
  const schedulesByDate = new Map<string, typeof upcomingSchedules>()
  for (const sched of upcomingSchedules) {
    const key = sched.scheduledAt.toISOString().split('T')[0]
    if (!schedulesByDate.has(key)) schedulesByDate.set(key, [])
    schedulesByDate.get(key)!.push(sched)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/creator"
            className="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-colors shrink-0 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Centre de Commande Social
            </h1>
            <p className="text-white/40 mt-1 text-sm sm:text-base">
              Tous vos reseaux, une seule vue
            </p>
          </div>
        </div>
        <Link
          href="/creator/accounts"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors text-sm min-h-[44px] self-start sm:self-auto"
        >
          <LinkIcon className="h-4 w-4" />
          Gerer les comptes
        </Link>
      </div>

      {/* ============ QUICK STATS ROW ============ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          {
            label: 'Followers total',
            value: totalFollowers.toLocaleString('fr-FR'),
            icon: Users,
            color: 'text-[#D4AF37]',
            iconBg: 'bg-[#D4AF37]/10',
          },
          {
            label: 'Vues ce mois',
            value: totalViewsThisMonth.toLocaleString('fr-FR'),
            icon: Eye,
            color: 'text-blue-400',
            iconBg: 'bg-blue-500/10',
          },
          {
            label: 'Engagement moyen',
            value: `${avgEngagement.toFixed(1)}%`,
            icon: Activity,
            color: 'text-green-400',
            iconBg: 'bg-green-500/10',
          },
          {
            label: 'Meilleur reseau',
            value: bestPlatform ? PLATFORM_CONFIG[bestPlatform.platform]?.label || bestPlatform.platform : '-',
            icon: Crown,
            color: 'text-purple-400',
            iconBg: 'bg-purple-500/10',
          },
          {
            label: 'Croissance',
            value: '+12.4%',
            icon: TrendingUp,
            color: 'text-emerald-400',
            iconBg: 'bg-emerald-500/10',
            subtext: 'vs mois dernier',
          },
        ].map((stat) => (
          <Card key={stat.label} className="bg-white/[0.02] border-white/[0.06]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-9 w-9 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-white/30 text-xs mt-0.5">{stat.label}</p>
              {stat.subtext && (
                <p className="text-white/15 text-[10px] mt-0.5">{stat.subtext}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ============ PLATFORM OVERVIEW ============ */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-white font-[family-name:var(--font-playfair)] mb-5">
          Vos Reseaux
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_PLATFORMS.map((platformKey) => {
            const account = connectedPlatforms.get(platformKey)
            const config = PLATFORM_CONFIG[platformKey]

            if (!account) {
              // Unconnected state
              return (
                <Card key={platformKey} className="bg-white/[0.01] border-white/[0.04] border-dashed">
                  <CardContent className="p-5 flex flex-col items-center justify-center text-center min-h-[180px]">
                    <div className={`h-12 w-12 rounded-xl ${config.bgColor} flex items-center justify-center mb-3 opacity-40`}>
                      <span className="text-lg font-bold" style={{ color: config.color }}>
                        {config.label.charAt(0)}
                      </span>
                    </div>
                    <p className="text-white/30 text-sm font-medium">{config.label}</p>
                    <p className="text-white/15 text-xs mt-1 mb-4">Non connecte</p>
                    <Link
                      href="/creator/accounts"
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border ${config.borderColor} ${config.textColor} text-xs font-medium hover:bg-white/5 transition-colors min-h-[44px]`}
                    >
                      <LinkIcon className="h-3 w-3" />
                      Connecter
                    </Link>
                  </CardContent>
                </Card>
              )
            }

            // Connected state
            return (
              <Card key={platformKey} className={`bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] transition-colors`}>
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                        <span className="text-base font-bold" style={{ color: config.color }}>
                          {config.label.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{config.label}</p>
                        <p className="text-white/30 text-xs">@{account.handle}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-green-500/20 text-green-400 text-[10px]">
                      Actif
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-white/20 text-[10px] uppercase tracking-wide">Followers</p>
                      <p className="text-white font-bold text-lg">{account.followersCount.toLocaleString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-white/20 text-[10px] uppercase tracking-wide">Engagement</p>
                      <p className="text-white font-bold text-lg">{account.engagementRate.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Sparkline */}
                  <div className="mb-3">
                    <Sparkline data={sparklineData[platformKey] || []} color={config.color} />
                  </div>

                  {/* Last synced */}
                  <div className="flex items-center justify-between text-[10px] text-white/15">
                    <span>Croissance 30j</span>
                    <span className="flex items-center gap-1 text-green-400">
                      <ArrowUpRight className="h-2.5 w-2.5" />
                      +{Math.round(account.followersCount * 0.05)}
                    </span>
                  </div>
                  {account.lastSyncAt && (
                    <p className="text-white/10 text-[10px] mt-2">
                      Synchro : {account.lastSyncAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ============ CLAUDE AI INSIGHTS ============ */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <Sparkles className="h-5 w-5 text-[#D4AF37]" />
          <h2 className="text-lg sm:text-xl font-semibold text-white font-[family-name:var(--font-playfair)]">
            Recommandations IA
          </h2>
        </div>

        <Card className="bg-white/[0.02] border-[#D4AF37]/15 shadow-[0_0_30px_rgba(212,175,55,0.04)]">
          <CardContent className="p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AI_INSIGHTS.map((insight, idx) => {
                const IconComponent = INSIGHT_ICONS[insight.type] || Zap
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors group"
                  >
                    {/* Icon + Type */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                        <IconComponent className="h-4 w-4 text-[#D4AF37]" />
                      </div>
                    </div>

                    {/* Title */}
                    <p className="text-white font-semibold text-sm leading-snug mb-2">
                      {insight.title}
                    </p>

                    {/* Explanation */}
                    <p className="text-white/30 text-xs leading-relaxed mb-3">
                      {insight.explanation}
                    </p>

                    {/* Action */}
                    {insight.action && insight.actionHref && (
                      <Link
                        href={insight.actionHref}
                        className="inline-flex items-center gap-1 text-[#D4AF37] text-xs font-medium hover:underline"
                      >
                        {insight.action}
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2 text-white/15 text-[10px]">
              <Sparkles className="h-3 w-3 text-[#D4AF37]/40" />
              <span>Analyse basee sur vos 30 derniers jours</span>
              <span className="text-white/10">|</span>
              <span>Powered by Claude</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============ CONTENT CALENDAR PREVIEW ============ */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-white/30" />
            <h2 className="text-lg sm:text-xl font-semibold text-white font-[family-name:var(--font-playfair)]">
              Calendrier de contenu
            </h2>
          </div>
          <Link href="/creator/schedule" className="text-[#D4AF37] text-sm hover:underline flex items-center gap-1">
            Voir le planning complet
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Card className="bg-white/[0.02] border-white/[0.06]">
          <CardContent className="p-5 sm:p-6">
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {calendarDays.map((date, idx) => {
                const dateKey = date.toISOString().split('T')[0]
                const daySchedules = schedulesByDate.get(dateKey) || []
                const isToday = idx === 0

                return (
                  <div
                    key={dateKey}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      isToday
                        ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/20'
                        : 'bg-white/[0.02] border border-white/[0.04]'
                    }`}
                  >
                    <p className={`text-[10px] uppercase font-medium ${isToday ? 'text-[#D4AF37]' : 'text-white/20'}`}>
                      {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </p>
                    <p className={`text-lg font-bold mt-1 ${isToday ? 'text-[#D4AF37]' : 'text-white/60'}`}>
                      {date.getDate()}
                    </p>

                    {/* Platform dots */}
                    <div className="flex items-center justify-center gap-1 mt-2 min-h-[10px]">
                      {daySchedules.map((sched, i) => (
                        <CalendarDot key={i} platform={sched.platform} />
                      ))}
                    </div>

                    {daySchedules.length > 0 && (
                      <p className="text-white/20 text-[9px] mt-1">
                        {daySchedules.length} post{daySchedules.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            {upcomingSchedules.length === 0 && (
              <div className="text-center py-4 mt-4 border-t border-white/5">
                <p className="text-white/20 text-sm">Aucun post programme cette semaine</p>
                <Link href="/creator/schedule" className="text-[#D4AF37] text-xs hover:underline mt-1 inline-block">
                  Planifier un post
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ============ GROWTH GOALS ============ */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <Target className="h-5 w-5 text-white/30" />
          <h2 className="text-lg sm:text-xl font-semibold text-white font-[family-name:var(--font-playfair)]">
            Objectifs de Croissance
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialAccounts.length > 0 ? (
            socialAccounts.slice(0, 4).map((account) => {
              const config = PLATFORM_CONFIG[account.platform]
              // Calculate milestone
              const milestones = [100, 500, 1000, 5000, 10000, 50000, 100000]
              const nextMilestone = milestones.find(m => m > account.followersCount) || 100000
              const prevMilestone = milestones.filter(m => m <= account.followersCount).pop() || 0
              const progress = ((account.followersCount - prevMilestone) / (nextMilestone - prevMilestone)) * 100

              // Badge rewards at milestones
              const milestoneLabels: Record<number, string> = {
                100: 'Debutant',
                500: 'Createur',
                1000: 'Influenceur',
                5000: 'Star',
                10000: 'Mega Star',
                50000: 'Legende',
                100000: 'Icone',
              }

              return (
                <Card key={account.platform} className="bg-white/[0.02] border-white/[0.06]">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-9 w-9 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                        <span className="text-sm font-bold" style={{ color: config.color }}>
                          {config.label.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">{config.label}</p>
                        <p className="text-white/30 text-xs">@{account.handle}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/50">
                          {account.followersCount.toLocaleString('fr-FR')} / {nextMilestone.toLocaleString('fr-FR')} followers
                        </span>
                        <span className="text-[#D4AF37] font-medium">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                            background: `linear-gradient(90deg, ${config.color}80, ${config.color})`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Milestone reward */}
                    <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <Crown className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <p className="text-white/40 text-xs">
                        Debloquez le badge &quot;<span className="text-[#D4AF37]">{milestoneLabels[nextMilestone] || 'Icone'}</span>&quot; a {nextMilestone.toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="bg-white/[0.02] border-white/[0.06] sm:col-span-2">
              <CardContent className="py-12 text-center">
                <Target className="h-10 w-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">Connectez vos reseaux pour suivre vos objectifs</p>
                <Link href="/creator/accounts" className="text-[#D4AF37] text-xs hover:underline mt-2 inline-block">
                  Connecter un reseau
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tip */}
        {socialAccounts.length > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-[#D4AF37]/[0.04] border border-[#D4AF37]/10">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
              <div>
                <p className="text-white/50 text-sm">
                  <span className="text-[#D4AF37] font-medium">Astuce :</span>{' '}
                  Invitez 3 amis pour +50 followers estimes via le programme de parrainage.
                </p>
                <Link href="/collabs/referrals" className="text-[#D4AF37] text-xs hover:underline mt-1 inline-block">
                  Voir le programme de parrainage
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
