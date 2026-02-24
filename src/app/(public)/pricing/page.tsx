import { CheckCircle, Zap, Star, Crown, Film, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Abonnements — Lumiere Cinema',
  description: 'Choisissez votre plan pour acceder au cinema IA. Gratuit, Basic ou Premium.',
}

const PLANS = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    period: 'pour toujours',
    description: 'Decouvrez le cinema IA sans engagement.',
    icon: Film,
    color: 'text-white/60',
    borderColor: 'border-white/10',
    bgColor: 'bg-white/[0.02]',
    features: [
      'Acces au catalogue (5 films/mois)',
      'Qualite 720p',
      'Publicites',
      'Profil contributeur de base',
      'Participation aux concours',
    ],
    cta: 'Commencer gratuitement',
    ctaStyle: 'border border-white/10 text-white/60 hover:border-white/20 hover:text-white',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 4.99,
    period: '/mois',
    description: 'Pour les cinephiles qui veulent plus.',
    icon: Star,
    color: 'text-[#D4AF37]',
    borderColor: 'border-[#D4AF37]/30',
    bgColor: 'bg-[#D4AF37]/[0.03]',
    popular: true,
    features: [
      'Catalogue illimite',
      'Qualite 1080p Full HD',
      'Sans publicites',
      'Sous-titres multi-langues',
      'Telechargement hors-ligne (5 films)',
      'Acces anticipé aux premieres',
      'Badge "Supporter" sur le profil',
    ],
    cta: 'Choisir Basic',
    ctaStyle: 'bg-[#D4AF37] hover:bg-[#C5A028] text-black font-semibold shadow-lg shadow-[#D4AF37]/20',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    period: '/mois',
    description: 'L\'experience cinema ultime.',
    icon: Crown,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/[0.03]',
    features: [
      'Tout Basic inclus',
      'Qualite 4K Ultra HD',
      'Audio spatial Dolby Atmos',
      'Telechargement illimite',
      'Acces aux making-of exclusifs',
      'Vote prioritaire sur les projets',
      'Invitation aux avant-premieres',
      'Badge "VIP" dore sur le profil',
      'Support prioritaire',
    ],
    cta: 'Choisir Premium',
    ctaStyle: 'bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-600/20',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#D4AF37]/[0.03] blur-[200px]" />
      </div>

      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#D4AF37]/[0.06] border border-[#D4AF37]/15 text-[#D4AF37] text-xs sm:text-sm font-medium mb-7">
            <Sparkles className="h-3.5 w-3.5" />
            Plans & Tarifs
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 tracking-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Le cinema IA,{' '}
            <span className="text-shimmer">accessible a tous</span>
          </h1>
          <p className="text-white/40 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Regardez des films crees par l&apos;intelligence artificielle. Contribuez, investissez, et faites partie du futur du cinema.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl sm:rounded-3xl border p-6 sm:p-8 ${plan.borderColor} ${plan.bgColor} transition-all duration-500 hover:scale-[1.02] hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D4AF37] text-black text-xs font-bold">
                  Le plus populaire
                </div>
              )}

              <div className="mb-6">
                <plan.icon className={`h-8 w-8 mb-3 ${plan.color}`} />
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {plan.name}
                </h3>
                <p className="text-white/40 text-sm mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.color}`}>
                  {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
                </span>
                {plan.price > 0 && (
                  <span className="text-white/30 text-sm ml-1">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${plan.color}`} />
                    <span className="text-sm text-white/60">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.price === 0 ? '/register' : '/register?plan=' + plan.id}
                className={`block w-full text-center py-3.5 rounded-xl text-sm transition-all duration-300 ${plan.ctaStyle}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ / Compare */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <Users className="h-8 w-8 text-[#D4AF37]" />
            <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
              Vous etes createur ?
            </h3>
            <p className="text-white/40 text-sm max-w-md">
              Tous les plans incluent l&apos;acces au studio de creation. Soumettez vos films, contribuez aux projets, et gagnez des revenus.
            </p>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#F0D060] font-medium"
            >
              <Zap className="h-4 w-4" /> Explorer les taches disponibles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
