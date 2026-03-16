import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { microToCredits } from '@/lib/ai-pricing'
import {
  DollarSign, TrendingUp, TrendingDown, Wallet,
  CreditCard, ArrowUpRight, Activity, BarChart3,
  Users, Percent, Zap,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Financial — Admin CINEGEN' }

export default async function FinancialPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(Date.now() - 7 * 86400000)
  const monthAgo = new Date(Date.now() - 30 * 86400000)

  const [
    totalRevenue, revenueToday, revenueWeek, revenueMonth,
    totalCost, totalMargin,
    totalDeposits, totalRefunds,
    avgPerUser,
    requestsToday, requestsWeek,
    activeWallets, totalBalance,
  ] = await Promise.all([
    prisma.aIUsageLog.aggregate({ _sum: { billedCredits: true } }),
    prisma.aIUsageLog.aggregate({ where: { createdAt: { gte: today } }, _sum: { billedCredits: true } }),
    prisma.aIUsageLog.aggregate({ where: { createdAt: { gte: weekAgo } }, _sum: { billedCredits: true } }),
    prisma.aIUsageLog.aggregate({ where: { createdAt: { gte: monthAgo } }, _sum: { billedCredits: true } }),
    prisma.aIUsageLog.aggregate({ _sum: { costCredits: true } }),
    prisma.aIUsageLog.aggregate({ _sum: { marginCredits: true } }),
    prisma.creditTransaction.aggregate({ where: { amount: { gt: 0 } }, _sum: { amount: true } }),
    prisma.creditTransaction.aggregate({ where: { type: 'REFUND' as any }, _sum: { amount: true } }),
    prisma.aIUsageLog.groupBy({
      by: ['userId'],
      _sum: { billedCredits: true },
    }).then(groups => {
      if (groups.length === 0) return 0
      const total = groups.reduce((sum: number, g: any) => sum + (g._sum.billedCredits ?? 0), 0)
      return total / groups.length
    }),
    prisma.aIUsageLog.count({ where: { createdAt: { gte: today } } }),
    prisma.aIUsageLog.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.creditAccount.count({ where: { balance: { gt: 0 } } }),
    prisma.creditAccount.aggregate({ _sum: { balance: true } }),
  ])

  const rev = totalRevenue._sum.billedCredits ?? 0
  const cost = totalCost._sum.costCredits ?? 0
  const margin = totalMargin._sum.marginCredits ?? 0
  const marginRate = rev > 0 ? ((margin / rev) * 100).toFixed(1) : '0'

  const kpis = [
    { label: 'Revenue totale', value: microToCredits(rev).toFixed(2), unit: 'cr', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { label: "Aujourd'hui", value: microToCredits(revenueToday._sum.billedCredits ?? 0).toFixed(2), unit: 'cr', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Cette semaine', value: microToCredits(revenueWeek._sum.billedCredits ?? 0).toFixed(2), unit: 'cr', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Ce mois', value: microToCredits(revenueMonth._sum.billedCredits ?? 0).toFixed(2), unit: 'cr', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { label: 'Coût total', value: microToCredits(cost).toFixed(2), unit: 'cr', icon: TrendingDown, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    { label: 'Marge', value: `${marginRate}%`, unit: '', icon: Percent, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { label: 'Total déposé', value: microToCredits(totalDeposits._sum.amount ?? 0).toFixed(2), unit: 'cr', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Total remboursé', value: microToCredits(totalRefunds._sum.amount ?? 0).toFixed(2), unit: 'cr', icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    { label: 'Moy/utilisateur', value: microToCredits(avgPerUser).toFixed(2), unit: 'cr', icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
    { label: 'Wallets actifs', value: activeWallets, unit: '', icon: Wallet, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
    { label: 'Req today', value: requestsToday, unit: '', icon: Zap, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
    { label: 'Req semaine', value: requestsWeek, unit: '', icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
          Financial Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">KPIs financiers détaillés et ventilation des coûts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className={`rounded-2xl border ${kpi.border} ${kpi.bg} p-5`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className="text-xl font-bold text-[#1A1A2E]">
                {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                {kpi.unit && <span className="text-xs text-gray-500 ml-1">{kpi.unit}</span>}
              </p>
            </div>
          )
        })}
      </div>

      {/* Balance détaillée */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-orange-500" /> Solde plateforme
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total en circulation</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">{microToCredits(totalBalance._sum.balance ?? 0).toFixed(2)} <span className="text-sm text-gray-500">cr</span></p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Wallets actifs</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">{activeWallets}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Revenue nette</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{microToCredits(margin).toFixed(2)} <span className="text-sm text-gray-500">cr</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
