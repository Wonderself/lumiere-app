import Link from 'next/link'
import type { Metadata } from 'next'
import {
  TrendingUp,
  Film,
  Shield,
  Globe,
  Cpu,
  Users,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Zap,
  BookOpen,
  Landmark,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Investisseurs — Lumiere Brothers Pictures',
  description:
    'Investissez dans le cinema de demain. Lumiere Brothers Pictures : studio IA, micro-taches collaboratives, tokenisation blockchain.',
}

const highlights = [
  { value: '25K€', label: 'Budget moyen par film', icon: Film },
  { value: '20+', label: 'Films en pipeline', icon: BarChart3 },
  { value: '500+', label: 'Micro-taches par film', icon: Zap },
  { value: '3', label: 'Continents couverts', icon: Globe },
]

const advantages = [
  {
    icon: Cpu,
    title: 'IA comme levier de production',
    desc: "Notre workflow proprietaire utilise l'IA pour reduire les couts de production de 95% par rapport a Hollywood, tout en maintenant une qualite cinematographique.",
  },
  {
    icon: Users,
    title: 'Communaute de contributeurs',
    desc: "Plus de 500 micro-taches par film, realisees par une communaute mondiale de createurs. Chaque contribution est validee par IA + humain.",
  },
  {
    icon: Shield,
    title: 'Blockchain & Tracabilite',
    desc: "Chaque contribution hashee SHA-256 et horodatee. Pret pour la tokenisation sur Polygon : co-production, gouvernance, revenus partages.",
  },
  {
    icon: BookOpen,
    title: 'IP co-detenue (Editions Ruppin)',
    desc: "Participation de 33% dans Editions Ruppin. First-look deal exclusif sur chaque biographie et recit historique. Pipeline book-to-screen integre.",
  },
  {
    icon: TrendingUp,
    title: 'Double moteur de croissance',
    desc: "Studio Services (cash-flow court terme via commerciaux pour marques) + Original Pictures (IP long terme via films originaux). Deux flux de revenus complementaires.",
  },
  {
    icon: Landmark,
    title: 'Cadre legal structure',
    desc: "SAS francaise. Credits d'impot cinema (CNC). Advisory Board FinTech. Cadre israelien pour la tokenisation (IL_EXEMPT / IL_SANDBOX).",
  },
]

const timeline = [
  { phase: 'Phase 1', title: 'Plateforme & Pipeline', desc: '20 films en pre-production, communaute active, IA operationnelle', status: 'done' },
  { phase: 'Phase 2', title: 'Premiers Films', desc: 'Sortie des 3 premiers films, streaming en ligne, premieres revenues', status: 'current' },
  { phase: 'Phase 3', title: 'Tokenisation', desc: 'Lancement des tokens film sur Polygon, co-production decentralisee', status: 'next' },
  { phase: 'Phase 4', title: 'Scale International', desc: 'Distribution mondiale, partenariats Hollywood, 50+ films par an', status: 'next' },
]

export default function InvestPage() {
  return (
    <div className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative py-28 sm:py-36 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-radial-gold opacity-60" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/[0.02] blur-[200px]" />
        <div className="container mx-auto max-w-5xl relative text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06] text-[#D4AF37] text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
            <TrendingUp className="h-3.5 w-3.5" />
            Investisseurs & Partenaires
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Investissez dans le{' '}
            <span className="text-shimmer">Cinema de Demain</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/45 max-w-3xl mx-auto leading-relaxed mb-10">
            Lumiere Brothers Pictures reinvente la production cinematographique avec l&apos;IA,
            la blockchain et une communaute mondiale de createurs.
          </p>

          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-center"
              >
                <h.icon className="h-5 w-5 text-[#D4AF37] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#D4AF37]">{h.value}</div>
                <div className="text-xs text-white/35 mt-1">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent" />

      {/* ═══ POURQUOI INVESTIR ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Pourquoi Investir
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight"
            >
              Un Modele <span className="text-gold-gradient">Unique au Monde</span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto">
              La combinaison IA + micro-taches + blockchain cree un avantage competitif ineditable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {advantages.map((adv) => (
              <div
                key={adv.title}
                className="group p-7 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#D4AF37]/15 transition-all duration-500"
              >
                <div className="h-12 w-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                  <adv.icon className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{adv.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ COMPARAISON MARCHE ═══ */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-4xl relative">
          <div className="text-center mb-14">
            <p className="text-[#D4AF37] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Comparaison
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
            >
              Lumiere vs Le <span className="text-gold-gradient">Marche</span>
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left p-4 text-white/40 font-medium" />
                  <th className="p-4 text-white/40 font-medium text-center">Hollywood</th>
                  <th className="p-4 text-white/40 font-medium text-center">Netflix</th>
                  <th className="p-4 text-center font-bold text-[#D4AF37] bg-[#D4AF37]/[0.05]">Lumiere</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {[
                  ['Budget moyen', '$50-200M', '$5-30M', '25K€'],
                  ['Delai production', '2-5 ans', '1-2 ans', '3-6 mois'],
                  ['Participation', 'Fermee', 'Fermee', 'Ouverte a tous'],
                  ['IA', 'Minimale', 'Recommandation', 'Production integrale'],
                  ['Blockchain', 'Non', 'Non', 'Tracabilite totale'],
                  ['Partage revenus', 'Studios only', 'Netflix only', 'Tous les contributeurs'],
                ].map(([label, hollywood, netflix, lumiere]) => (
                  <tr key={label}>
                    <td className="p-4 text-white/60 font-medium">{label}</td>
                    <td className="p-4 text-white/30 text-center">{hollywood}</td>
                    <td className="p-4 text-white/30 text-center">{netflix}</td>
                    <td className="p-4 text-[#D4AF37] text-center font-semibold bg-[#D4AF37]/[0.03]">
                      {lumiere}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent" />

      {/* ═══ TIMELINE ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-[#D4AF37] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Feuille de Route
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
            >
              <span className="text-gold-gradient">Ou en Sommes-Nous</span>
            </h2>
          </div>

          <div className="space-y-4">
            {timeline.map((step, i) => (
              <div
                key={step.phase}
                className={`flex gap-5 p-6 rounded-2xl border transition-all duration-300 ${
                  step.status === 'done'
                    ? 'border-green-500/20 bg-green-500/[0.03]'
                    : step.status === 'current'
                      ? 'border-[#D4AF37]/20 bg-[#D4AF37]/[0.05]'
                      : 'border-white/[0.06] bg-white/[0.02]'
                }`}
              >
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      step.status === 'done'
                        ? 'bg-green-500/20 text-green-400'
                        : step.status === 'current'
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                          : 'bg-white/5 text-white/30'
                    }`}
                  >
                    {step.status === 'done' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-px h-full min-h-[20px] bg-white/[0.06] mt-2" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white/30 uppercase tracking-wider">
                      {step.phase}
                    </span>
                    {step.status === 'current' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold">
                        EN COURS
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-sm text-white/40">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ CTA ═══ */}
      <section className="py-24 sm:py-32 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#D4AF37]/[0.03] blur-[200px]" />
        </div>
        <div className="container mx-auto max-w-3xl relative text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          >
            Parlons de{' '}
            <span className="text-shimmer">Votre Investissement</span>
          </h2>
          <p className="text-white/40 leading-relaxed mb-10 max-w-xl mx-auto">
            Que vous soyez investisseur, partenaire ou distributeur, nous serions ravis
            d&apos;echanger sur les opportunites de collaboration.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:invest@lumiere.film"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#C5A028] text-black font-semibold transition-all duration-500 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 hover:scale-[1.02]"
            >
              Nous Contacter
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-300 text-sm font-medium"
            >
              En savoir plus sur l&apos;equipe
            </Link>
          </div>
          <p className="mt-8 text-xs text-white/20">
            invest@lumiere.film &middot; Paris &middot; Jerusalem
          </p>
        </div>
      </section>
    </div>
  )
}
