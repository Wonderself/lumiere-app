import Link from 'next/link'
import type { Metadata } from 'next'
import { Clapperboard, Film, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lumiere — Choisissez votre experience',
  description: 'Plateforme de co-production cinematographique par IA',
}

export default function SelectorPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient blurs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/[0.03] rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#D4AF37]/[0.02] rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/[0.015] rounded-full blur-[180px]" />

      {/* Logo / Title */}
      <div className="text-center mb-16 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Clapperboard className="h-10 w-10 text-[#D4AF37]" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight font-[family-name:var(--font-playfair)]">
          LUMI<span className="text-[#D4AF37]">E</span>RE
        </h1>
        <p className="mt-4 text-white/40 text-lg">
          Choisissez votre experience
        </p>
      </div>

      {/* Two Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-4xl w-full relative z-10">
        {/* Option 1 — Lumiere Brothers */}
        <Link
          href="/home"
          className="group relative block rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-8 md:p-10 transition-all duration-500 hover:border-[#D4AF37]/30 hover:bg-white/[0.04] hover:shadow-[0_0_60px_rgba(212,175,55,0.08)]"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4AF37]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium uppercase tracking-wider">
                Option 1
              </span>
              <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                <Film className="h-7 w-7 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  Lumiere Brothers
                </h2>
              </div>
            </div>
            <p className="text-white/40 leading-relaxed">
              La plateforme complete de co-production cinematographique par IA.
              Streaming, acteurs IA, communaute, tokenisation.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors text-sm font-medium">
              Explorer <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Option 2 — Lumiere App */}
        <Link
          href="/films"
          className="group relative block rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-8 md:p-10 transition-all duration-500 hover:border-[#D4AF37]/30 hover:bg-white/[0.04] hover:shadow-[0_0_60px_rgba(212,175,55,0.08)]"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4AF37]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 text-xs font-medium uppercase tracking-wider">
                Option 2
              </span>
              <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                <Clapperboard className="h-7 w-7 text-white/50" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  Lumiere App
                </h2>
              </div>
            </div>
            <p className="text-white/40 leading-relaxed">
              L&apos;application de micro-taches creatives.
              Films, taches, leaderboard, profil contributeur.
            </p>
            <div className="mt-6 flex items-center gap-2 text-white/30 group-hover:text-[#D4AF37] transition-colors text-sm font-medium">
              Explorer <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Subtle footer */}
      <p className="mt-16 text-white/15 text-xs relative z-10">
        Lumiere Brothers Pictures &copy; {new Date().getFullYear()}
      </p>
    </div>
  )
}
