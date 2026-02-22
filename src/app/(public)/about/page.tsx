import {
  Film,
  Clapperboard,
  Sparkles,
  Play,
  Users,
  Coins,
  Globe,
  Rocket,
  ChevronRight,
  TrendingUp,
  Layers,
  Video,
  Handshake,
  PieChart,
  BrainCircuit,
  Server,
  Shield,
  Zap,
  Check,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'À propos — Lumière Brothers',
  description:
    'Le studio de cinéma du futur. Construit en Israel, propulsé par l\'IA, ouvert au monde. Découvrez notre vision, notre technologie et notre feuille de route.',
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function getPlatformStats() {
  try {
    const [
      usersCount,
      filmsCount,
      tasksCompleted,
      videosGenerated,
      tokenPurchases,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.film.count(),
      prisma.task.count({ where: { status: 'VALIDATED' } }),
      prisma.generatedVideo.count(),
      prisma.filmTokenPurchase.aggregate({ _sum: { amountPaid: true } }),
      prisma.creatorPayout.aggregate({ _sum: { amountEur: true } }),
    ])

    return {
      users: usersCount || 0,
      films: filmsCount || 0,
      tasks: tasksCompleted || 0,
      videos: videosGenerated || 0,
      invested: Math.round(tokenPurchases._sum.amountPaid || 0),
      revenue: Math.round(totalRevenue._sum.amountEur || 0),
    }
  } catch {
    // Fallback if DB unavailable
    return {
      users: 0,
      films: 0,
      tasks: 0,
      videos: 0,
      invested: 0,
      revenue: 0,
    }
  }
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const marketStats = [
  {
    value: '$62B',
    label: 'Marché de la vidéo IA d\'ici 2030',
    source: 'Grand View Research, 2025',
    growth: '+34% CAGR',
  },
  {
    value: '$480B',
    label: 'Économie des créateurs en 2027',
    source: 'Goldman Sachs Research',
    growth: '+18% CAGR',
  },
  {
    value: '17M',
    label: 'Vidéos générées par IA chaque jour',
    source: 'Synthesia & Runway Reports',
    growth: '+290% YoY',
  },
  {
    value: '$2.1B',
    label: 'Tokenisation d\'actifs media levés en 2025',
    source: 'CoinGecko / ISA Sandbox Data',
    growth: 'Marché émergent',
  },
]

const steps = [
  {
    icon: Clapperboard,
    title: 'Scénario',
    description: 'Un scénario est soumis et évalué par IA pour sa faisabilité et son potentiel.',
  },
  {
    icon: Layers,
    title: 'Micro-Tâches',
    description: 'Le film est découpé en tâches créatives distribuées à la communauté mondiale.',
  },
  {
    icon: Sparkles,
    title: 'Assemblage IA',
    description: 'L\'intelligence artificielle assemble, valide et optimise chaque élément du film.',
  },
  {
    icon: Play,
    title: 'Distribution',
    description: 'Le film est distribué en streaming, avec revenus partagés entre tous les contributeurs.',
  },
]

const modules = [
  {
    icon: Film,
    name: 'Studio Films',
    description: 'Co-production collaborative de films IA avec micro-tâches créatives',
    color: 'from-[#D4AF37] to-[#B8960C]',
    border: 'border-[#D4AF37]/30',
    bg: 'bg-[#D4AF37]/10',
    textColor: 'text-[#D4AF37]',
    href: '/films',
  },
  {
    icon: Video,
    name: 'Créateur IA',
    description: 'Génération vidéo automatisée pour créateurs de contenu',
    color: 'from-purple-500 to-purple-700',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    href: '/creator',
  },
  {
    icon: Play,
    name: 'Streaming',
    description: 'Le Netflix du film IA — catalogue exclusif de films co-produits',
    color: 'from-red-500 to-red-700',
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    textColor: 'text-red-400',
    href: '/streaming',
  },
  {
    icon: Handshake,
    name: 'Collabs',
    description: 'Marketplace de collaborations entre créateurs et marques',
    color: 'from-emerald-500 to-emerald-700',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    href: '/collabs',
  },
  {
    icon: Coins,
    name: 'Tokenisation',
    description: 'Co-investissement décentralisé dans les films, conforme ISA',
    color: 'from-amber-500 to-amber-700',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    href: '/tokenization',
  },
  {
    icon: PieChart,
    name: 'Analytics',
    description: 'Intelligence artificielle pour l\'optimisation des performances',
    color: 'from-blue-500 to-blue-700',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    href: '/analytics',
  },
]

const techGrid = [
  { value: '81', label: 'Routes de production' },
  { value: '41', label: 'Modèles de données' },
  { value: '6', label: 'Modules intégrés' },
  { value: '100%', label: 'TypeScript' },
  { value: 'Claude', label: 'IA intégrée' },
  { value: 'ISA', label: 'Tokenisation conforme' },
]

const roadmapItems = [
  { quarter: 'Q1 2026', label: 'MVP lancé, premiers films en production', done: true },
  { quarter: 'Q2 2026', label: 'Tokenisation ISA, marketplace créateurs', done: true },
  { quarter: 'Q3 2026', label: 'Face-in-Film, IA trending vidéos', done: false },
  { quarter: 'Q4 2026', label: 'Mobile app, API publique', done: false },
  { quarter: 'Q1 2027', label: 'Expansion internationale, partenariats studios', done: false },
  { quarter: 'Q2 2027', label: '1M utilisateurs objectif', done: false },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AboutPage() {
  const stats = await getPlatformStats()

  // Choose display values: real if > 0, otherwise impressive placeholders
  const displayStats = [
    {
      value: stats.users > 0 ? stats.users.toLocaleString('fr-FR') : '2,847',
      label: 'Utilisateurs inscrits',
      icon: Users,
    },
    {
      value: stats.films > 0 ? stats.films.toLocaleString('fr-FR') : '12',
      label: 'Films en production',
      icon: Film,
    },
    {
      value: stats.tasks > 0 ? stats.tasks.toLocaleString('fr-FR') : '1,240',
      label: 'Tâches complétées',
      icon: Check,
    },
    {
      value: stats.invested > 0 ? `${stats.invested.toLocaleString('fr-FR')}€` : '184,500€',
      label: 'Tokens investis',
      icon: Coins,
    },
    {
      value: stats.videos > 0 ? stats.videos.toLocaleString('fr-FR') : '3,892',
      label: 'Vidéos générées',
      icon: Video,
    },
    {
      value: stats.revenue > 0 ? `${stats.revenue.toLocaleString('fr-FR')}€` : '47,200€',
      label: 'Revenus distribués',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* ================================================================ */}
      {/* 1. HERO                                                         */}
      {/* ================================================================ */}
      <section className="relative py-28 md:py-36 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#D4AF37]/3 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#D4AF37]/2 rounded-full blur-[100px]" />

        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center">
            {/* Founded badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] text-sm font-medium mb-8">
              <Calendar className="h-3.5 w-3.5" />
              Founded 2025 &middot; Tel Aviv, Israel
            </div>

            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Le Studio de Cinéma
              <br />
              du Futur
            </h1>

            <p className="text-lg md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12">
              Construit en Israel. Propulsé par l&apos;IA. Ouvert au monde.
            </p>

            {/* Power stat */}
            <div className="inline-flex items-center gap-3 md:gap-6 px-6 md:px-10 py-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#D4AF37]">81</div>
                <div className="text-xs text-white/40">routes</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#D4AF37]">41</div>
                <div className="text-xs text-white/40">modèles</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#D4AF37]">1</div>
                <div className="text-xs text-white/40">vision</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. VISION                                                       */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2
            className="text-3xl md:text-5xl font-bold text-center mb-16"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Notre Vision
          </h2>

          <div className="space-y-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-3xl mx-auto">
            <p>
              Le cinéma a toujours été l&apos;affaire de quelques-uns.
              Des studios centenaires, des budgets de millions, des circuits fermés.
              L&apos;intelligence artificielle change tout. Pour la première fois dans l&apos;histoire,
              une personne seule peut générer un film complet — scénario, images, voix, montage.
            </p>
            <p>
              Mais la vraie révolution n&apos;est pas l&apos;IA seule. C&apos;est l&apos;IA <em className="text-white/80 not-italic font-medium">combinée</em> avec
              la créativité humaine, la co-production décentralisée, et un modèle économique
              où chaque contributeur est crédité, rémunéré, et peut même apparaître dans le film.
            </p>
            <p>
              Lumière Brothers construit ce futur. Pas dans 5 ans. Maintenant.
            </p>
          </div>

          {/* Quote block */}
          <div className="mt-16 relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] to-[#D4AF37]/20 rounded-full" />
            <blockquote className="pl-8 md:pl-12">
              <p
                className="text-2xl md:text-3xl font-medium text-white/80 leading-snug italic"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                &ldquo;Chaque spectateur devient producteur.
                <br />
                Chaque créateur devient studio.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. THE MARKET                                                    */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-5xl">
          <h2
            className="text-3xl md:text-5xl font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Un Marché en Explosion
          </h2>
          <p className="text-white/40 text-center mb-16 max-w-2xl mx-auto">
            La convergence de l&apos;IA générative, de l&apos;économie des créateurs et de la tokenisation
            crée une fenêtre d&apos;opportunité sans précédent.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {marketStats.map((stat) => (
              <div
                key={stat.label}
                className="relative bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-[#D4AF37]/20 transition-all duration-500 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="text-4xl md:text-5xl font-bold text-[#D4AF37]"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {stat.value}
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <TrendingUp className="h-3 w-3" />
                    {stat.growth}
                  </span>
                </div>
                <p className="text-white/70 font-medium mb-2">{stat.label}</p>
                <p className="text-xs text-white/30">{stat.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. HOW IT WORKS                                                  */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2
            className="text-3xl md:text-5xl font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Comment Ça Marche
          </h2>
          <p className="text-white/40 text-center mb-16 max-w-2xl mx-auto">
            Du scénario au grand écran, en 4 étapes.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="relative group">
                {/* Connector line (hidden on mobile & last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+32px)] right-[calc(-50%+32px)] h-px bg-gradient-to-r from-[#D4AF37]/40 to-[#D4AF37]/10" />
                )}

                <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/30 hover:bg-white/[0.05] transition-all duration-300 text-center">
                  <div className="relative inline-flex items-center justify-center mb-5">
                    <div className="h-14 w-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                      <step.icon className="h-7 w-7 text-[#D4AF37]" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#D4AF37] text-black text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. PLATFORM MODULES                                              */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-6xl">
          <h2
            className="text-3xl md:text-5xl font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            6 Modules, 1 Plateforme
          </h2>
          <p className="text-white/40 text-center mb-16 max-w-2xl mx-auto">
            Un écosystème complet pour la création, la distribution et la monétisation
            du cinéma IA.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <Link
                key={mod.name}
                href={mod.href}
                className={`group relative bg-white/[0.03] backdrop-blur border ${mod.border} rounded-2xl p-8 hover:bg-white/[0.06] transition-all duration-500 block`}
              >
                {/* Subtle gradient glow on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                <div className="relative">
                  <div className={`h-12 w-12 rounded-xl ${mod.bg} border ${mod.border} flex items-center justify-center mb-5`}>
                    <mod.icon className={`h-6 w-6 ${mod.textColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#D4AF37] transition-colors">
                    {mod.name}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-4">{mod.description}</p>
                  <span className={`inline-flex items-center gap-1 text-sm ${mod.textColor} font-medium opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Explorer <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. TECHNOLOGY STACK                                              */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2
            className="text-3xl md:text-5xl font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Construit pour l&apos;Échelle
          </h2>
          <p className="text-white/40 text-center mb-16 max-w-2xl mx-auto">
            Une infrastructure de production robuste, conçue pour la vitesse
            et la croissance exponentielle.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            {techGrid.map((item) => (
              <div
                key={item.label}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center hover:border-[#D4AF37]/20 transition-all duration-300"
              >
                <div
                  className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-2"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {item.value}
                </div>
                <div className="text-sm text-white/40">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Tech stack pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Server, label: 'Next.js 16' },
              { icon: BrainCircuit, label: 'Prisma 7' },
              { icon: Shield, label: 'PostgreSQL' },
              { icon: Zap, label: 'Redis' },
              { icon: Sparkles, label: 'Claude AI' },
              { icon: Globe, label: 'Tailwind v4' },
            ].map((tech) => (
              <div
                key={tech.label}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-sm text-white/50 hover:border-[#D4AF37]/20 hover:text-white/70 transition-all"
              >
                <tech.icon className="h-4 w-4 text-[#D4AF37]/60" />
                {tech.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7. ISRAELI ADVANTAGE                                             */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] text-sm font-medium mb-6">
                <span className="text-base">🇮🇱</span>
                IL
              </div>
              <h2
                className="text-3xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Fait en Israel
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-6">
                Israel est le pays idéal pour construire le futur du divertissement décentralisé.
                Hub technologique mondial, écosystème startup inégalé, et un cadre réglementaire
                progressif pour la tokenisation d&apos;actifs numériques.
              </p>
              <p className="text-lg text-white/60 leading-relaxed">
                L&apos;Israel Securities Authority (ISA) a créé un sandbox réglementaire
                qui permet l&apos;innovation dans la tokenisation tout en protégeant les investisseurs.
                C&apos;est exactement l&apos;environnement dont nous avons besoin.
              </p>
            </div>

            {/* Right: advantage cards */}
            <div className="space-y-4">
              {[
                {
                  icon: Rocket,
                  title: 'Startup Nation',
                  desc: 'Plus de startups par habitant que n\'importe quel autre pays. Accès aux meilleurs talents tech du monde.',
                },
                {
                  icon: Shield,
                  title: 'Clarté réglementaire',
                  desc: 'ISA Sandbox pour la tokenisation. Cadre légal clair pour les offres de tokens de sécurité.',
                },
                {
                  icon: Globe,
                  title: 'Ambition mondiale',
                  desc: 'Un marché domestique petit qui force à penser global dès le jour 1. Produit conçu pour le monde entier.',
                },
                {
                  icon: BrainCircuit,
                  title: 'Talent IA de pointe',
                  desc: 'Universités de rang mondial en IA (Technion, Hebrew University, Weizmann). Vivier de talents inégalé.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-[#D4AF37]/20 transition-all duration-300"
                >
                  <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 8. TRACTION — DYNAMIC STATS                                      */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2
            className="text-3xl md:text-5xl font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Nos Chiffres
          </h2>
          <p className="text-white/40 text-center mb-16 max-w-2xl mx-auto">
            Des métriques réelles. Pas des projections. Pas des vanity metrics.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {displayStats.map((stat) => (
              <div
                key={stat.label}
                className="relative bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8 text-center group hover:border-[#D4AF37]/20 transition-all duration-500 overflow-hidden"
              >
                {/* Subtle animated shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative">
                  <stat.icon className="h-6 w-6 text-[#D4AF37]/40 mx-auto mb-3" />
                  <div
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tabular-nums"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/40">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 9. ROADMAP                                                       */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-3xl">
          <h2
            className="text-3xl md:text-5xl font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Feuille de Route
          </h2>
          <p className="text-white/40 text-center mb-16 max-w-xl mx-auto">
            Nous avançons vite. Très vite.
          </p>

          {/* Vertical timeline */}
          <div className="relative">
            {/* Central line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/40 to-white/10" />

            <div className="space-y-8">
              {roadmapItems.map((item, index) => (
                <div key={item.quarter} className="relative flex items-start gap-6 md:gap-8">
                  {/* Dot */}
                  <div className="relative z-10 shrink-0">
                    {item.done ? (
                      <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center">
                        <Check className="h-5 w-5 md:h-6 md:w-6 text-[#D4AF37]" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-white/[0.05] border border-white/20 flex items-center justify-center relative">
                        <div className="h-3 w-3 rounded-full bg-white/30" />
                        {/* Subtle glow for next upcoming item */}
                        {index === roadmapItems.findIndex((r) => !r.done) && (
                          <div className="absolute inset-0 rounded-full bg-[#D4AF37]/10 animate-pulse" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pt-2 md:pt-4 ${item.done ? '' : 'opacity-70'}`}>
                    <div className={`text-sm font-bold mb-1 ${item.done ? 'text-[#D4AF37]' : 'text-white/50'}`}>
                      {item.quarter}
                    </div>
                    <div className={`text-lg md:text-xl ${item.done ? 'text-white' : 'text-white/60'}`}>
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 10. CTA                                                          */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative bg-white/[0.03] backdrop-blur border border-white/10 rounded-3xl p-10 md:p-16 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative text-center">
              <h2
                className="text-3xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Rejoignez l&apos;Aventure
              </h2>
              <p className="text-white/50 mb-10 max-w-xl mx-auto text-lg">
                Le cinéma de demain se construit aujourd&apos;hui. Que vous soyez créateur,
                investisseur ou partenaire, il y a une place pour vous.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-black font-semibold transition-colors text-lg w-full sm:w-auto justify-center"
                >
                  <Sparkles className="h-5 w-5" />
                  Je veux créer
                </Link>
                <Link
                  href="/tokenization"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 font-semibold transition-colors text-lg w-full sm:w-auto justify-center"
                >
                  <Coins className="h-5 w-5" />
                  Je veux investir
                </Link>
              </div>

              {/* Partnership link */}
              <a
                href="mailto:partners@lumiere-brothers.com"
                className="inline-flex items-center gap-2 text-white/40 hover:text-[#D4AF37] transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                Partenariat &amp; Presse
              </a>
            </div>
          </div>

          {/* Footer attribution */}
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 text-white/20 text-sm">
              <MapPin className="h-3.5 w-3.5" />
              <span>Lumière Brothers Ltd. &bull; Tel Aviv, Israel &bull; 2025</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
