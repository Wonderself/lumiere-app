import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Coins, TrendingUp, TrendingDown, Clock,
  Sparkles, Zap, Crown, ArrowRight,
  CheckCircle2, Info, CreditCard,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Crédits IA — Lumière',
  description: 'Gérez vos crédits pour la génération IA',
}

const CREDIT_PACKS = [
  {
    name: 'Découverte',
    credits: 100,
    bonus: 0,
    price: 4.99,
    features: ['~2 scènes vidéo', 'Storyboards inclus', 'Support standard'],
    popular: false,
  },
  {
    name: 'Créateur',
    credits: 500,
    bonus: 50,
    price: 19.99,
    features: ['~1 bande-annonce complète', 'Toutes les fonctionnalités', 'Support prioritaire'],
    popular: true,
  },
  {
    name: 'Studio',
    credits: 2000,
    bonus: 400,
    price: 69.99,
    features: ['~4 bandes-annonces', 'Qualité premium', 'Support dédié', 'Exports illimités'],
    popular: false,
  },
  {
    name: 'Production',
    credits: 10000,
    bonus: 3000,
    price: 299.99,
    features: ['Production intensive', 'Tous les modèles IA', 'Account manager', 'API access'],
    popular: false,
  },
]

const TX_TYPE_CONFIG: Record<string, { label: string; icon: typeof TrendingUp; color: string }> = {
  PACK_PURCHASE: { label: 'Achat de pack', icon: CreditCard, color: 'text-green-600' },
  ADMIN_GRANT: { label: 'Crédit admin', icon: Crown, color: 'text-purple-600' },
  SUBSCRIPTION_GRANT: { label: 'Crédit abonnement', icon: Sparkles, color: 'text-blue-600' },
  AI_USAGE: { label: 'Utilisation IA', icon: Zap, color: 'text-orange-600' },
  REFUND: { label: 'Remboursement', icon: TrendingUp, color: 'text-green-600' },
  CONTEST_PRIZE: { label: 'Prix concours', icon: Crown, color: 'text-[#D4AF37]' },
  REFERRAL_BONUS: { label: 'Bonus parrainage', icon: TrendingUp, color: 'text-emerald-600' },
  PROMO_CODE: { label: 'Code promo', icon: Sparkles, color: 'text-pink-600' },
}

export default async function CreditsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [creditAccount, transactions, subscription] = await Promise.all([
    prisma.creditAccount.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.creditTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
    }),
  ])

  const balance = creditAccount?.balance ?? 0
  const totalUsed = creditAccount?.totalUsed ?? 0
  const totalPurchased = creditAccount?.totalPurchased ?? 0
  const isPremium = subscription?.plan === 'PREMIUM' && (subscription?.status === 'ACTIVE' || subscription?.status === 'active')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
          Crédits IA
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez vos crédits pour la création de bandes-annonces et contenu IA
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/5 to-transparent p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
              <Coins className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Solde actuel</p>
              <p className="text-2xl font-bold text-[#D4AF37]">{balance.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total acheté</p>
              <p className="text-2xl font-bold text-[#1A1A2E]">{totalPurchased.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total utilisé</p>
              <p className="text-2xl font-bold text-[#1A1A2E]">{totalUsed.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Banner */}
      {isPremium && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-semibold text-purple-800">Abonnement Premium</p>
              <p className="text-xs text-purple-600">1 bande-annonce gratuite par semaine incluse — {creditAccount?.weeklyFreeUsed ?? 0}/1 utilisée</p>
            </div>
          </div>
        </div>
      )}

      {/* Credit Packs */}
      <div>
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Acheter des crédits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.name}
              className={`relative rounded-2xl border p-6 transition-all hover:shadow-md ${
                pack.popular
                  ? 'border-[#D4AF37] bg-gradient-to-b from-[#D4AF37]/5 to-transparent shadow-sm'
                  : 'border-gray-200 bg-white hover:border-[#D4AF37]/30'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#D4AF37] text-black text-[10px] font-semibold px-3">
                    POPULAIRE
                  </Badge>
                </div>
              )}
              <div className="text-center mb-4">
                <h3 className="text-base font-bold text-[#1A1A2E]">{pack.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-[#1A1A2E]">{pack.price}€</span>
                </div>
                <p className="text-sm text-[#D4AF37] font-semibold mt-1">
                  {pack.credits.toLocaleString()} crédits
                  {pack.bonus > 0 && <span className="text-green-600"> +{pack.bonus} bonus</span>}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {(pack.price / (pack.credits + pack.bonus) * 100).toFixed(1)} centimes/crédit
                </p>
              </div>
              <ul className="space-y-2 mb-5">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  pack.popular
                    ? 'bg-[#D4AF37] hover:bg-[#F0D060] text-black font-semibold'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
                disabled
              >
                Bientôt disponible
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <Info className="h-3.5 w-3.5" />
          <span>Les paiements seront activés prochainement. Contactez l&apos;admin pour un crédit manuel.</span>
        </div>
      </div>

      {/* Commission Info */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Transparence des coûts</p>
            <p className="text-xs text-blue-600 mt-1 leading-relaxed">
              Nous facturons le coût réel des tokens IA + 20% de commission de service.
              Par exemple : si la génération d&apos;une scène coûte 1€ en tokens IA, vous payez 1.20€ (12 crédits).
              Aucun surcoût caché.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Historique</h2>
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <Clock className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Aucune transaction pour le moment</p>
            <p className="text-xs text-gray-400 mt-1">Vos achats et utilisations de crédits apparaîtront ici</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => {
                const config = TX_TYPE_CONFIG[tx.type] || TX_TYPE_CONFIG.AI_USAGE
                const TxIcon = config.icon
                const isPositive = tx.amount > 0
                return (
                  <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${isPositive ? 'bg-green-50' : 'bg-orange-50'}`}>
                      <TxIcon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A2E]">{config.label}</p>
                      {tx.description && <p className="text-xs text-gray-500 truncate">{tx.description}</p>}
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-orange-600'}`}>
                        {isPositive ? '+' : ''}{tx.amount}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
