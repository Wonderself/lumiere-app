import Link from 'next/link'
import Image from 'next/image'
import { Film, Tv, Users, Award, Pen, BarChart3, MapPin, Code2, Tag } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] bg-[#060606] pt-16 pb-10 mt-20">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

      <div className="mx-auto max-w-[1400px] px-8 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand — 5 cols */}
          <div className="lg:col-span-5 space-y-5">
            <Image
              src="/images/lumiere-brothers-logo-cinema-dark.webp"
              alt="Lumiere Brothers Pictures"
              width={180}
              height={50}
              className="h-10 w-auto object-contain opacity-80"
            />
            <p className="text-[13px] text-white/30 leading-[1.8] max-w-sm">
              Le studio de cinema aux possibilites infinies.
              Nous dirigeons l&apos;IA pour creer le cinema de demain —
              production collaborative, tokenisation, blockchain.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <span className="text-[10px] text-white/15 uppercase tracking-[0.2em] font-medium">Paris</span>
              <div className="h-1 w-1 rounded-full bg-[#D4AF37]/30" />
              <span className="text-[10px] text-white/15 uppercase tracking-[0.2em] font-medium">Jerusalem</span>
            </div>
          </div>

          {/* Plateforme — 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Plateforme</h4>
            <ul className="space-y-2.5">
              <li><Link href="/films" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#D4AF37] transition-colors"><Film className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />Films</Link></li>
              <li><Link href="/streaming" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#D4AF37] transition-colors"><Tv className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />Streaming</Link></li>
              <li><Link href="/community" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#D4AF37] transition-colors"><Users className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />Communaute</Link></li>
              <li><Link href="/leaderboard" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#D4AF37] transition-colors"><BarChart3 className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />Classement</Link></li>
              <li><Link href="/roadmap" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#D4AF37] transition-colors"><MapPin className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />Roadmap</Link></li>
              <li><Link href="/pricing" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#D4AF37] transition-colors"><Tag className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />Tarifs</Link></li>
              <li><Link href="/developers" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#D4AF37] transition-colors"><Code2 className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />API Developpeurs</Link></li>
            </ul>
          </div>

          {/* Contribuer — 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Contribuer</h4>
            <ul className="space-y-2.5">
              <li><Link href="/register" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#D4AF37] transition-colors"><Users className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />Creer un compte</Link></li>
              <li><Link href="/register?role=SCREENWRITER" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#D4AF37] transition-colors"><Pen className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />Soumettre un scenario</Link></li>
              <li><Link href="/tasks" className="group flex items-center gap-2 text-[13px] text-white/25 hover:text-[#D4AF37] transition-colors"><Award className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />Taches disponibles</Link></li>
            </ul>
          </div>

          {/* Legal — 3 cols */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link href="/legal/terms" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">Conditions Generales</Link></li>
              <li><Link href="/legal/privacy" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">Politique de Confidentialite</Link></li>
              <li><Link href="/legal/cookies" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">Cookies</Link></li>
              <li><Link href="/about" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">A Propos</Link></li>
              <li><Link href="/invest" className="text-[13px] text-white/25 hover:text-[#D4AF37] transition-colors font-medium">Investisseurs</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/15">
            &copy; 2026 Lumiere Brothers Pictures SAS. Tous droits reserves.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/10 tracking-wider">Powered by</span>
            <span className="text-[10px] text-white/20 font-medium">Next.js</span>
            <span className="text-[10px] text-white/10">&middot;</span>
            <span className="text-[10px] text-white/20 font-medium">Claude AI</span>
            <span className="text-[10px] text-white/10">&middot;</span>
            <span className="text-[10px] text-white/20 font-medium">Blockchain</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
