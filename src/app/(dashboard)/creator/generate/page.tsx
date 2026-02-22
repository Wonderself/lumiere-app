import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Wand2,
  Sparkles,
  SlidersHorizontal,
  Coins,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'
import { generateVideoAction } from '@/app/actions/creator'

const PLATFORMS = [
  { value: 'TIKTOK', label: 'TikTok', color: 'bg-pink-500/10 border-pink-500/30 text-pink-400 peer-checked:bg-pink-500/20 peer-checked:border-pink-500' },
  { value: 'INSTAGRAM', label: 'Instagram', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400 peer-checked:bg-purple-500/20 peer-checked:border-purple-500' },
  { value: 'YOUTUBE', label: 'YouTube', color: 'bg-red-500/10 border-red-500/30 text-red-400 peer-checked:bg-red-500/20 peer-checked:border-red-500' },
  { value: 'X', label: 'X (Twitter)', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400 peer-checked:bg-blue-500/20 peer-checked:border-blue-500' },
] as const

const DURATIONS = [
  { value: '15', label: '15s', desc: 'Short / Reel' },
  { value: '30', label: '30s', desc: 'Standard' },
  { value: '60', label: '60s', desc: 'Long form' },
  { value: '90', label: '90s', desc: 'Extended' },
] as const

const MODES = [
  {
    id: 'auto',
    label: 'Auto',
    desc: "L'IA fait tout en un clic",
    icon: Sparkles,
    color: '#D4AF37',
  },
  {
    id: 'assisted',
    label: 'Assisté',
    desc: 'Validez chaque étape',
    icon: CheckCircle2,
    color: '#3b82f6',
  },
  {
    id: 'expert',
    label: 'Expert',
    desc: 'Contrôle total',
    icon: SlidersHorizontal,
    color: '#a855f7',
  },
] as const

export default async function GeneratePage() {
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/creator"
            className="h-10 w-10 rounded-xl border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Générer une Vidéo
            </h1>
            <p className="text-white/30 text-sm mt-1">Créez du contenu en quelques clics</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] self-start sm:self-auto">
          <Coins className="h-4 w-4 text-[#D4AF37]" />
          <span className="text-white font-semibold">{tokenBalance}</span>
          <span className="text-white/30 text-sm">Lumens</span>
        </div>
      </div>

      <form action={async (formData: FormData) => {
        'use server'
        await generateVideoAction(null, formData)
      }}>
        {/* Mode Selection */}
        <div className="grid grid-cols-3 gap-3">
          {MODES.map((mode, index) => (
            <label key={mode.id} className="cursor-pointer group">
              <input
                type="radio"
                name="mode"
                value={mode.id}
                defaultChecked={index === 0}
                className="peer sr-only"
              />
              <div className="flex flex-col items-center gap-2.5 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all duration-200 peer-checked:border-[color:var(--mode-color)] peer-checked:bg-[color:var(--mode-color)]/[0.08] hover:bg-white/[0.04]" style={{ '--mode-color': mode.color } as React.CSSProperties}>
                <div className="h-12 w-12 rounded-xl bg-white/[0.04] flex items-center justify-center peer-checked:bg-white/10">
                  <mode.icon className="h-6 w-6" style={{ color: mode.color }} />
                </div>
                <p className="text-white font-semibold text-sm">{mode.label}</p>
                <p className="text-white/30 text-xs text-center">{mode.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Video Details */}
        <div className="space-y-6 mt-8">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/60 text-sm">Titre de la vidéo</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: 5 secrets que personne ne vous dit sur..."
              required
              className="h-12 text-base"
            />
          </div>

          {/* Script */}
          <div className="space-y-2">
            <Label htmlFor="script" className="text-white/60 text-sm">Script / Contenu</Label>
            <Textarea
              id="script"
              name="script"
              placeholder="Ecrivez votre script ici ou laissez vide pour que l'IA le génère..."
              rows={5}
              className="min-h-[120px]"
            />
            <p className="text-white/20 text-xs">
              Laissez vide en mode Auto pour une génération complète par l&apos;IA.
            </p>
          </div>

          {/* Platforms */}
          <div className="space-y-3">
            <Label className="text-white/60 text-sm">Plateformes</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PLATFORMS.map((platform) => (
                <label key={platform.value} className="cursor-pointer">
                  <input
                    type="checkbox"
                    name="platforms"
                    value={platform.value}
                    className="peer sr-only"
                  />
                  <div
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${platform.color}`}
                  >
                    <span className="text-sm font-medium">{platform.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <Label className="text-white/60 text-sm">Durée</Label>
            <div className="grid grid-cols-4 gap-3">
              {DURATIONS.map((dur, i) => (
                <label key={dur.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="duration"
                    value={dur.value}
                    defaultChecked={i === 1}
                    className="peer sr-only"
                  />
                  <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all duration-200 peer-checked:border-[#D4AF37] peer-checked:bg-[#D4AF37]/10">
                    <span className="text-white font-bold text-sm">{dur.label}</span>
                    <span className="text-white/30 text-xs">{dur.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 4K Toggle */}
        <div className="mt-8">
          <label className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] cursor-pointer group hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-white text-sm font-medium">Qualité 4K Ultra</p>
                <p className="text-white/25 text-xs">Résolution maximale (+15 Lumens)</p>
              </div>
            </div>
            <div className="relative">
              <input type="checkbox" name="quality4k" value="true" className="peer sr-only" />
              <div className="w-11 h-6 bg-white/10 rounded-full peer-checked:bg-[#D4AF37] transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        </div>

        {/* Generate Button Area */}
        <div className="mt-10 flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-2 text-white/30 text-sm">
            <Coins className="h-4 w-4 text-[#D4AF37]" />
            <span>Coût : <strong className="text-white/60">10 Lumens</strong> (HD) ou <strong className="text-white/60">25 Lumens</strong> (4K)</span>
          </div>

          {tokenBalance < 10 ? (
            <div className="space-y-3">
              <p className="text-white/40 text-sm">
                Votre solde est de <span className="text-amber-400 font-medium">{tokenBalance} Lumens</span>.
                Rechargez pour continuer.
              </p>
              <Link
                href="/lumens"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#F0D060] transition-colors"
              >
                <Coins className="h-4 w-4" />
                Recharger mes Lumens
              </Link>
            </div>
          ) : (
            <button
              type="submit"
              className="relative inline-flex items-center justify-center gap-3 px-12 py-4 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#F0D060] transition-all text-lg shadow-[0_0_40px_rgba(212,175,55,0.35)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Wand2 className="h-5 w-5" />
              Générer ma Vidéo
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F0D060]" />
              </span>
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
