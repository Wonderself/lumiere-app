import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Flame,
  Upload,
  User,
  EyeOff,
  Sparkles,
  Clock,
  Eye,
  TrendingUp,
  Clapperboard,
  Wand2,
  Coins,
  Smile,
  Heart,
  Drama,
  GraduationCap,
  CalendarClock,
  Zap,
  Play,
} from 'lucide-react'
import { generateTrendingVideoAction } from '@/app/actions/creator'

export const dynamic = 'force-dynamic'

// ========== TREND DATA ==========
const TRENDS = [
  {
    id: 'face-movie',
    name: 'Mon visage dans un film IA',
    description: 'Votre visage intégré dans des scènes de films iconiques. Époustouflant.',
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    estimatedViews: '50K-200K',
    difficulty: 'Facile',
    duration: '30s',
    trendScore: 97,
    cost: 20,
    emoji: '🎬',
  },
  {
    id: 'pov-director',
    name: 'POV: Je suis réalisateur IA',
    description: 'Racontez votre histoire de création en format POV immersif.',
    platforms: ['TikTok', 'Instagram'],
    estimatedViews: '20K-80K',
    difficulty: 'Facile',
    duration: '15s',
    trendScore: 92,
    cost: 15,
    emoji: '🎥',
  },
  {
    id: 'before-after',
    name: 'Before/After VFX IA',
    description: 'Split-screen comparant le brut et le rendu IA. Ultra viral.',
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    estimatedViews: '30K-150K',
    difficulty: 'Moyen',
    duration: '15s',
    trendScore: 95,
    cost: 15,
    emoji: '✨',
  },
  {
    id: 'storytime',
    name: 'Storytime: Comment j\'ai produit un film',
    description: 'Talking head avec B-roll IA. Format authentique qui convertit.',
    platforms: ['TikTok', 'YouTube'],
    estimatedViews: '10K-50K',
    difficulty: 'Facile',
    duration: '60s',
    trendScore: 85,
    cost: 10,
    emoji: '📖',
  },
  {
    id: 'reaction',
    name: 'Réaction à mon film IA',
    description: 'Format réaction face caméra avec le film IA en incrustation.',
    platforms: ['TikTok', 'YouTube'],
    estimatedViews: '15K-60K',
    difficulty: 'Facile',
    duration: '30s',
    trendScore: 83,
    cost: 10,
    emoji: '😱',
  },
  {
    id: '3-scenes',
    name: '3 scènes, 1 acteur (moi)',
    description: 'Même personne dans 3 rôles différents. Effet split screen ou transition.',
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    estimatedViews: '40K-180K',
    difficulty: 'Moyen',
    duration: '30s',
    trendScore: 91,
    cost: 25,
    emoji: '🎭',
  },
  {
    id: 'film-60s',
    name: 'Film en 60 secondes',
    description: 'Un court-métrage IA compressé en 60s. Narratif, punchy, mémorable.',
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    estimatedViews: '25K-100K',
    difficulty: 'Moyen',
    duration: '60s',
    trendScore: 88,
    cost: 20,
    emoji: '🎞️',
  },
  {
    id: 'casting-family',
    name: 'Casting ma famille dans un film',
    description: 'Face swap familial dans un blockbuster. Humour garanti, partage viral.',
    platforms: ['TikTok', 'Instagram'],
    estimatedViews: '60K-300K',
    difficulty: 'Facile',
    duration: '30s',
    trendScore: 96,
    cost: 25,
    emoji: '👨‍👩‍👧‍👦',
  },
  {
    id: 'future-cinema',
    name: 'Le futur du cinéma',
    description: 'Thought leadership sur l\'avenir du cinéma IA. Position d\'expert.',
    platforms: ['YouTube', 'Instagram'],
    estimatedViews: '5K-30K',
    difficulty: 'Facile',
    duration: '60s',
    trendScore: 72,
    cost: 10,
    emoji: '🔮',
  },
  {
    id: 'making-of',
    name: 'Making-of: De l\'idée au film',
    description: 'Montrez le processus créatif étape par étape. Éducatif et inspirant.',
    platforms: ['YouTube', 'TikTok', 'Instagram'],
    estimatedViews: '10K-40K',
    difficulty: 'Moyen',
    duration: '60s',
    trendScore: 78,
    cost: 15,
    emoji: '🛠️',
  },
] as const

const TONES = [
  { id: 'funny', label: 'Drôle', icon: Smile },
  { id: 'inspiring', label: 'Inspirant', icon: Heart },
  { id: 'dramatic', label: 'Dramatique', icon: Drama },
  { id: 'educational', label: 'Éducatif', icon: GraduationCap },
] as const

const PLATFORMS_FORM = [
  { value: 'TIKTOK', label: 'TikTok', color: 'bg-pink-500/10 border-pink-500/30 text-pink-400' },
  { value: 'INSTAGRAM', label: 'Instagram', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
  { value: 'YOUTUBE', label: 'YouTube', color: 'bg-red-500/10 border-red-500/30 text-red-400' },
  { value: 'X', label: 'X', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
] as const

function TrendScoreBar({ score }: { score: number }) {
  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${score}%`,
          background: score >= 90
            ? 'linear-gradient(90deg, #D4AF37, #F0D060)'
            : score >= 75
              ? 'linear-gradient(90deg, #22c55e, #4ade80)'
              : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
        }}
      />
    </div>
  )
}

function PlatformBadge({ name }: { name: string }) {
  const colors: Record<string, string> = {
    TikTok: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    Instagram: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    YouTube: 'bg-red-500/10 text-red-400 border-red-500/20',
    X: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${colors[name] || 'bg-white/5 text-white/40 border-white/10'}`}>
      {name}
    </span>
  )
}

export default async function TrendingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile || !profile.wizardCompleted) {
    redirect('/creator/wizard')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lumenBalance: true },
  })

  const tokenBalance = user?.lumenBalance ?? 0

  // Recent trending videos by this user
  const recentTrendingVideos = await prisma.generatedVideo.findMany({
    where: {
      profileId: profile.id,
      title: { startsWith: '[Trend]' },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: {
      schedules: true,
    },
  })

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
              Videos Tendance IA
            </h1>
            <p className="text-white/40 mt-1 text-sm sm:text-base">
              Collez votre visage, choisissez un trend, on fait le reste
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 self-start sm:self-auto">
          <Coins className="h-4 w-4 text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-semibold">{tokenBalance}</span>
          <span className="text-white/40 text-sm">tokens</span>
        </div>
      </div>

      <form action={async (fd: FormData) => {
        'use server'
        await generateTrendingVideoAction(null, fd)
      }}>
        {/* ============ STEP 1: IDENTITY ============ */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-bold">
              1
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white font-[family-name:var(--font-playfair)]">
              Votre Identite
            </h2>
          </div>

          <Card className="bg-white/[0.02] border-white/[0.06]">
            <CardContent className="p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* Avatar Option */}
                {profile.avatarType && (
                  <label className="cursor-pointer group">
                    <input type="radio" name="identityType" value="avatar" className="peer sr-only" defaultChecked />
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] transition-all duration-200 peer-checked:border-[#D4AF37] peer-checked:bg-[#D4AF37]/[0.08] peer-checked:shadow-[0_0_20px_rgba(212,175,55,0.1)] min-h-[44px]">
                      <div className="h-12 w-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                        <Clapperboard className="h-5 w-5 text-[#D4AF37]" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Mon avatar NoFace</p>
                        <p className="text-white/30 text-xs">Style {profile.avatarType}</p>
                      </div>
                    </div>
                  </label>
                )}

                {/* Selfie Option */}
                <label className="cursor-pointer group">
                  <input
                    type="radio"
                    name="identityType"
                    value="selfie"
                    className="peer sr-only"
                    defaultChecked={!profile.avatarType}
                  />
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] transition-all duration-200 peer-checked:border-[#D4AF37] peer-checked:bg-[#D4AF37]/[0.08] peer-checked:shadow-[0_0_20px_rgba(212,175,55,0.1)] min-h-[44px]">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Photo selfie</p>
                      <p className="text-white/30 text-xs">Votre vrai visage</p>
                    </div>
                  </div>
                </label>

                {/* NoFace Option */}
                <label className="cursor-pointer group">
                  <input type="radio" name="identityType" value="noface" className="peer sr-only" />
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] transition-all duration-200 peer-checked:border-[#D4AF37] peer-checked:bg-[#D4AF37]/[0.08] peer-checked:shadow-[0_0_20px_rgba(212,175,55,0.1)] min-h-[44px]">
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <EyeOff className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Sans visage</p>
                      <p className="text-white/30 text-xs">Mode anonyme</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Drop zone for selfie */}
              <div className="mt-4 border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-[#D4AF37]/30 transition-colors cursor-pointer group">
                <Upload className="h-8 w-8 text-white/20 mx-auto mb-2 group-hover:text-[#D4AF37]/50 transition-colors" />
                <p className="text-white/30 text-sm">
                  Glissez votre photo ou selfie ici
                </p>
                <p className="text-white/15 text-xs mt-1">
                  JPG, PNG ou WEBP - 5 MB max
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============ STEP 2: CHOOSE A TREND ============ */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-bold">
                2
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white font-[family-name:var(--font-playfair)]">
                Tendances du moment
              </h2>
            </div>
            <div className="flex items-center gap-2 text-white/20 text-xs">
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              <span>Mis a jour il y a 2h</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRENDS.map((trend) => (
              <label key={trend.id} className="cursor-pointer group">
                <input
                  type="radio"
                  name="trendId"
                  value={trend.id}
                  className="peer sr-only"
                />
                <div className="relative h-full p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all duration-300 peer-checked:border-[#D4AF37]/50 peer-checked:bg-[#D4AF37]/[0.06] peer-checked:shadow-[0_0_30px_rgba(212,175,55,0.08)] hover:bg-white/[0.04] hover:border-white/10">
                  {/* Trend Score Indicator */}
                  {trend.trendScore >= 90 && (
                    <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30">
                      <Flame className="h-3 w-3 text-orange-400" />
                      <span className="text-orange-400 text-[10px] font-bold">HOT</span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-lg">
                      {trend.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm leading-tight">{trend.name}</p>
                      <p className="text-white/30 text-xs mt-1 line-clamp-2">{trend.description}</p>
                    </div>
                  </div>

                  {/* Platform Badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {trend.platforms.map((p) => (
                      <PlatformBadge key={p} name={p} />
                    ))}
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-3 mb-3 text-xs">
                    <div className="flex items-center gap-1 text-white/40">
                      <Eye className="h-3 w-3" />
                      <span>{trend.estimatedViews}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/40">
                      <Clock className="h-3 w-3" />
                      <span>{trend.duration}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] h-4 px-1.5 py-0 ${
                        trend.difficulty === 'Facile'
                          ? 'border-green-500/30 text-green-400'
                          : 'border-yellow-500/30 text-yellow-400'
                      }`}
                    >
                      {trend.difficulty}
                    </Badge>
                  </div>

                  {/* Trend Score Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-white/20">Score tendance</span>
                      <span className="text-white/40 font-medium">{trend.trendScore}%</span>
                    </div>
                    <TrendScoreBar score={trend.trendScore} />
                  </div>

                  {/* Cost */}
                  <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1 text-xs text-white/30">
                      <Coins className="h-3 w-3 text-[#D4AF37]" />
                      <span>{trend.cost} tokens</span>
                    </div>
                    <div className="text-[10px] text-white/20 peer-checked:text-[#D4AF37] transition-colors">
                      Selectionner
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* ============ STEP 3: CUSTOMIZE & GENERATE ============ */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-bold">
              3
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white font-[family-name:var(--font-playfair)]">
              Personnaliser & Generer
            </h2>
          </div>

          <Card className="bg-white/[0.02] border-white/[0.06]">
            <CardContent className="p-5 sm:p-6 space-y-6">
              {/* Tone Selector */}
              <div>
                <p className="text-white/50 text-sm font-medium mb-3">Ton de la video</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TONES.map((tone, i) => (
                    <label key={tone.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="tone"
                        value={tone.id}
                        defaultChecked={i === 1}
                        className="peer sr-only"
                      />
                      <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-200 peer-checked:border-[#D4AF37] peer-checked:bg-[#D4AF37]/10 min-h-[44px]">
                        <tone.icon className="h-4 w-4 text-white/40" />
                        <span className="text-white/60 text-sm font-medium">{tone.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Script Preview */}
              <div>
                <p className="text-white/50 text-sm font-medium mb-3">Apercu du script</p>
                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-white/50 text-sm italic leading-relaxed">
                        &quot;Selectionnez une tendance ci-dessus pour voir un apercu du script genere par l&apos;IA...&quot;
                      </p>
                      <p className="text-white/20 text-xs mt-2">
                        Le script sera personnalise selon votre profil et votre ton
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Checkboxes */}
              <div>
                <p className="text-white/50 text-sm font-medium mb-3">Plateformes de publication</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PLATFORMS_FORM.map((platform) => (
                    <label key={platform.value} className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="platforms"
                        value={platform.value}
                        className="peer sr-only"
                      />
                      <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${platform.color} peer-checked:ring-2 peer-checked:ring-current/20 min-h-[44px]`}>
                        <span className="text-sm font-medium">{platform.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <p className="text-white/50 text-sm font-medium mb-3">Planification</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="scheduleType"
                      value="now"
                      defaultChecked
                      className="peer sr-only"
                    />
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-200 peer-checked:border-[#D4AF37] peer-checked:bg-[#D4AF37]/10 min-h-[44px]">
                      <Zap className="h-5 w-5 text-white/40" />
                      <div>
                        <p className="text-white font-medium text-sm">Poster maintenant</p>
                        <p className="text-white/30 text-xs">Generation immediate</p>
                      </div>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="scheduleType"
                      value="schedule"
                      className="peer sr-only"
                    />
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-200 peer-checked:border-[#D4AF37] peer-checked:bg-[#D4AF37]/10 min-h-[44px]">
                      <CalendarClock className="h-5 w-5 text-white/40" />
                      <div>
                        <p className="text-white font-medium text-sm">Planifier</p>
                        <p className="text-white/30 text-xs">Choisir date & heure</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Token Cost + CTA */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-[#D4AF37]" />
                      <span className="text-white/60 text-sm">Cout estime :</span>
                      <span className="text-[#D4AF37] font-bold">10-25 tokens</span>
                    </div>
                    <p className="text-white/20 text-xs">
                      Depend de la tendance selectionnee. Votre solde : <span className={tokenBalance >= 25 ? 'text-green-400' : 'text-orange-400'}>{tokenBalance} tokens</span>
                    </p>
                  </div>

                  {tokenBalance < 10 ? (
                    <Link
                      href="/lumens"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#F0D060] transition-colors min-h-[44px]"
                    >
                      <Coins className="h-4 w-4" />
                      Recharger mes Tokens
                    </Link>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#F0D060] transition-all duration-200 text-base shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:shadow-[0_0_60px_rgba(212,175,55,0.35)] min-h-[44px]"
                    >
                      <Wand2 className="h-5 w-5" />
                      Generer ma Video Tendance
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* ============ RECENT TRENDING VIDEOS ============ */}
      {recentTrendingVideos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-semibold text-white font-[family-name:var(--font-playfair)]">
              Vos Videos Tendance Recentes
            </h2>
            <Link href="/creator/videos" className="text-[#D4AF37] text-sm hover:underline">
              Tout voir
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
            {recentTrendingVideos.map((video) => (
              <div
                key={video.id}
                className="flex-shrink-0 w-56 sm:w-64 rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] transition-colors"
              >
                {/* Video Thumbnail Placeholder */}
                <div className="aspect-[9/16] bg-white/[0.03] flex items-center justify-center max-h-36">
                  <Play className="h-8 w-8 text-white/10" />
                </div>

                <div className="p-3 space-y-2">
                  <p className="text-white text-sm font-medium truncate">
                    {video.title.replace('[Trend] ', '')}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-white/30">
                      <Eye className="h-3 w-3" />
                      <span>{video.viewCount.toLocaleString()}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] h-4 px-1.5 py-0 ${
                        video.status === 'PUBLISHED'
                          ? 'border-green-500/30 text-green-400'
                          : video.status === 'GENERATING'
                            ? 'border-yellow-500/30 text-yellow-400'
                            : video.status === 'READY'
                              ? 'border-blue-500/30 text-blue-400'
                              : 'border-white/10 text-white/40'
                      }`}
                    >
                      {video.status === 'PUBLISHED' ? 'Publiee' :
                       video.status === 'GENERATING' ? 'En cours' :
                       video.status === 'READY' ? 'Prete' : 'Brouillon'}
                    </Badge>
                  </div>

                  {/* Platforms */}
                  <div className="flex gap-1">
                    {video.platforms.map((p) => (
                      <span key={p} className="text-[9px] text-white/20 bg-white/5 px-1 py-0.5 rounded">
                        {p}
                      </span>
                    ))}
                  </div>

                  <p className="text-white/15 text-[10px]">
                    {video.createdAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for recent videos */}
      {recentTrendingVideos.length === 0 && (
        <Card className="bg-white/[0.02] border-white/[0.06]">
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-10 w-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">Aucune video tendance encore</p>
            <p className="text-white/15 text-xs mt-1">Selectionnez une tendance ci-dessus pour commencer</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
