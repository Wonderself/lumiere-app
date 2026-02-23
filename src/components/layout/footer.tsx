import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0A0A0A] py-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Image
              src="/images/lumiere-brothers-logo-cinema-dark.png"
              alt="Lumière Brothers Pictures"
              width={180}
              height={50}
              className="h-10 w-auto object-contain"
            />
            <p className="text-sm text-white/40 leading-relaxed max-w-sm">
              Cinema & Creative Studio. Le studio aux possibilités infinies.
              Nous dirigeons l&apos;IA pour créer le cinéma de demain.
            </p>
            <p className="text-xs text-white/25">Paris · Tel Aviv · Hollywood</p>
            <p className="text-xs text-white/20">
              © 2026 Lumière Brothers Pictures. Tous droits réservés.
            </p>
          </div>

          {/* Plateforme */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Plateforme</h4>
            <ul className="space-y-2.5">
              <li><Link href="/films" className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">Catalogue Films</Link></li>
              <li><Link href="/streaming" className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">Streaming</Link></li>
              <li><Link href="/tasks" className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">Tâches Disponibles</Link></li>
              <li><Link href="/leaderboard" className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">Classement</Link></li>
              <li><Link href="/roadmap" className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          {/* Contribuer */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Contribuer</h4>
            <ul className="space-y-2.5">
              <li><Link href="/register" className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">Créer un compte</Link></li>
              <li><Link href="/about" className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">À Propos</Link></li>
              <li><Link href="/register?role=SCREENWRITER" className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">Soumettre un scénario</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Légal</h4>
            <ul className="space-y-2.5">
              <li><Link href="/legal/terms" className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">CGU</Link></li>
              <li><Link href="/legal/privacy" className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">Confidentialité</Link></li>
              <li><Link href="/legal/cookies" className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            Construit avec passion à Paris, Tel Aviv & Hollywood
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/20">Next.js · PostgreSQL · Claude IA</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
