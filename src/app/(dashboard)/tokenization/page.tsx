import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Coins, TrendingUp, Film, Clock, Shield,
  ArrowRight, Vote,
  Briefcase, Sparkles, CheckCircle2,
} from 'lucide-react'
import type { Metadata } from 'next'
import {
  formatEur, getOfferingProgress, getTimeRemaining,
  RISK_LABELS, OFFERING_STATUS_LABELS,
} from '@/lib/tokenization'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tokenization — Investissez dans le Cinéma IA',
  description: 'Co-produisez des films IA en acquérant des tokens. Revenus partagés, gouvernance communautaire.',
}

// Sub-navigation tabs
function TokenizationNav({ active }: { active: string }) {
  const tabs = [
    { key: 'marketplace', label: 'Marketplace', href: '/tokenization', icon: Coins },
    { key: 'portfolio', label: 'Mon Portfolio', href: '/tokenization/portfolio', icon: Briefcase },
    { key: 'governance', label: 'Gouvernance', href: '/tokenization/governance', icon: Vote },
  ]

  return (
    <nav className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/5 w-fit">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
            active === tab.key
              ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20 shadow-[0_0_12px_rgba(212,175,55,0.1)]'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          <tab.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default async function TokenizationMarketplacePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // Fetch active offerings with their films
  const offerings = await prisma.filmTokenOffering.findMany({
    where: { status: { in: ['OPEN', 'FUNDED'] } },
    include: {
      film: true,
      _count: { select: { purchases: true, proposals: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Recently funded
  const recentlyFunded = await prisma.filmTokenOffering.findMany({
    where: { status: 'FUNDED' },
    include: { film: true },
    orderBy: { fundedAt: 'desc' },
    take: 4,
  })

  // Platform stats
  const totalRaised = await prisma.filmTokenOffering.aggregate({ _sum: { raised: true } })
  const totalOfferings = await prisma.filmTokenOffering.count({ where: { status: { in: ['OPEN', 'FUNDED'] } } })
  const totalInvestors = await prisma.filmTokenPurchase.groupBy({
    by: ['userId'],
    where: { status: 'CONFIRMED' },
  })

  const platformStats = {
    totalRaised: totalRaised._sum.raised || 0,
    activeOfferings: totalOfferings,
    totalInvestors: totalInvestors.length,
    avgROI: 18.5, // Demo value
  }

  return (
    <div className="space-y-8">
      {/* Sub-Nav */}
      <TokenizationNav active="marketplace" />

      {/* Hero — Clean Fintech Style */}
      <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/10 bg-gradient-to-br from-[#D4AF37]/[0.06] to-transparent p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1 space-y-4">
            <Badge className="border-[#D4AF37]/20 bg-[#D4AF37]/[0.08] text-[#D4AF37] text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Régulé ISA Israel
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Investissez dans le Cinéma IA
            </h1>
            <p className="text-white/35 max-w-lg text-sm leading-relaxed">
              Co-produisez des films IA. Achetez des tokens, votez sur les décisions créatives,
              percevez des revenus sur chaque exploitation.
            </p>
          </div>

          {/* Platform Stats — Clean Numbers */}
          <div className="grid grid-cols-2 gap-4 lg:w-72">
            {[
              { label: 'Total levé', value: formatEur(platformStats.totalRaised), color: 'text-[#D4AF37]' },
              { label: 'Offres actives', value: platformStats.activeOfferings.toString(), color: 'text-blue-400' },
              { label: 'Investisseurs', value: platformStats.totalInvestors.toString(), color: 'text-green-400' },
              { label: 'ROI moyen', value: `${platformStats.avgROI}%`, color: 'text-purple-400' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-white/25 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Offerings */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Offres en Cours
          </h2>
          <span className="text-white/25 text-sm">{offerings.filter(o => o.status === 'OPEN').length} ouvertes</span>
        </div>

        {offerings.length === 0 ? (
          <div className="py-16 text-center">
            <Sparkles className="h-10 w-10 text-[#D4AF37]/20 mx-auto mb-4" />
            <p className="text-white/40 text-sm">Aucune offre active pour le moment.</p>
            <p className="text-white/20 text-xs mt-1">De nouvelles opportunités arrivent bientôt.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offerings.map((offering) => {
              const progress = getOfferingProgress(offering)
              const timeLeft = getTimeRemaining(offering.closesAt)

              return (
                <Link key={offering.id} href={`/tokenization/${offering.filmId}`}>
                  <Card className="bg-white/[0.02] border-white/[0.06] hover:border-[#D4AF37]/20 transition-all h-full group overflow-hidden">
                    {/* Film Cover */}
                    <div className="relative h-36 bg-gradient-to-br from-[#D4AF37]/[0.06] to-purple-500/[0.04] overflow-hidden">
                      {offering.film.coverImageUrl ? (
                        <img
                          src={offering.film.coverImageUrl}
                          alt={offering.film.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-10 w-10 text-white/[0.06]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      {offering.status === 'FUNDED' && (
                        <Badge variant="success" className="absolute top-3 right-3 text-xs">
                          Financé
                        </Badge>
                      )}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-semibold text-sm line-clamp-1">{offering.film.title}</h3>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      {/* Progress Bar */}
                      <div>
                        <Progress value={progress} className="h-1.5" />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[#D4AF37] text-sm font-semibold">{formatEur(offering.raised)}</span>
                          <span className="text-white/25 text-xs">/ {formatEur(offering.hardCap)}</span>
                        </div>
                      </div>

                      {/* ROI + Time */}
                      <div className="flex items-center justify-between text-xs">
                        {offering.projectedROI && (
                          <span className="text-green-400 font-medium">ROI ~{offering.projectedROI}%</span>
                        )}
                        <span className="text-white/25 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeLeft}
                        </span>
                      </div>

                      {/* CTA */}
                      {offering.status === 'OPEN' && (
                        <Button className="w-full min-h-[44px]">
                          Investir
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Recently Funded */}
      {recentlyFunded.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
            Récemment Financés
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentlyFunded.map((offering) => (
              <Link key={offering.id} href={`/tokenization/${offering.filmId}`}>
                <Card className="bg-white/[0.03] border-white/10 hover:border-green-500/20 transition-all group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-semibold truncate">{offering.film.title}</p>
                      <p className="text-green-400 text-xs">{formatEur(offering.raised)} levés</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-green-400 transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How It Works — 4 Clean Steps */}
      <section>
        <h2 className="text-lg font-bold text-white font-[family-name:var(--font-playfair)] mb-5">
          Comment ça Marche
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Choisissez', desc: 'Parcourez les films en financement', icon: Film, color: 'text-blue-400' },
            { title: 'Investissez', desc: 'Tokens dès 10€ par film', icon: Coins, color: 'text-[#D4AF37]' },
            { title: 'Votez', desc: 'Décisions créatives partagées', icon: Vote, color: 'text-purple-400' },
            { title: 'Gagnez', desc: 'Dividendes sur les exploitations', icon: TrendingUp, color: 'text-green-400' },
          ].map((item) => (
            <div key={item.title} className="text-center p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <item.icon className={`h-6 w-6 ${item.color} mx-auto mb-3`} />
              <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-white/30 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Legal Disclaimer — Collapsible */}
      <details className="group">
        <summary className="flex items-center gap-2 cursor-pointer text-xs text-white/25 hover:text-white/40 transition-colors list-none py-2">
          <Shield className="h-3.5 w-3.5" />
          <span>Avertissement légal</span>
          <span className="text-[10px] ml-1 group-open:hidden">Cliquez pour lire</span>
        </summary>
        <div className="mt-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
          <p className="text-white/25 text-xs leading-relaxed">
            Les tokens proposés sur cette plateforme sont émis dans le cadre du régime d&apos;offres exemptées de l&apos;Israel Securities Authority (ISA), sous le seuil de 5 millions ILS.
            L&apos;investissement dans des projets cinématographiques comporte des risques significatifs, incluant la perte totale du capital investi.
          </p>
          <p className="text-white/25 text-xs leading-relaxed">
            Lumière Brothers Ltd. est enregistrée en Israël. Consultez un conseiller financier agréé avant tout investissement.
            Investissez uniquement des sommes que vous pouvez vous permettre de perdre.
          </p>
        </div>
      </details>
    </div>
  )
}
