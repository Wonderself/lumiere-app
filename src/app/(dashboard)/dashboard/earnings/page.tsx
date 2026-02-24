import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  TrendingUp,
  Clock,
  CheckCircle,
  CreditCard,
  Wallet,
  ArrowUpRight,
  Banknote,
  CalendarDays,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Mes Revenus — Lumiere' }

export default async function EarningsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [payments, user] = await Promise.all([
    prisma.payment.findMany({
      where: { userId: session.user.id },
      include: {
        task: { select: { title: true, type: true, film: { select: { title: true, slug: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lumenBalance: true, tasksCompleted: true, tasksValidated: true },
    }),
  ])

  const totalEarned = payments.filter(p => p.status === 'COMPLETED').reduce((s, p) => s + p.amountEur, 0)
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((s, p) => s + p.amountEur, 0)
  const completedCount = payments.filter(p => p.status === 'COMPLETED').length
  const pendingCount = payments.filter(p => p.status === 'PENDING').length

  // Monthly breakdown (last 6 months)
  const monthlyData: { month: string; amount: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthLabel = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
    const monthTotal = payments
      .filter(p => p.status === 'COMPLETED' && p.paidAt)
      .filter(p => {
        const pd = new Date(p.paidAt!)
        return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth()
      })
      .reduce((s, p) => s + p.amountEur, 0)
    monthlyData.push({ month: monthLabel, amount: monthTotal })
  }
  const maxMonthly = Math.max(...monthlyData.map(m => m.amount), 1)

  const statusColors: Record<string, string> = {
    COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    PROCESSING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  const statusLabels: Record<string, string> = {
    COMPLETED: 'Paye',
    PENDING: 'En attente',
    PROCESSING: 'En cours',
    FAILED: 'Echoue',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl sm:text-4xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Mes Revenus
        </h1>
        <p className="text-gray-500 mt-1">
          Historique de vos gains, previsions et demandes de retrait.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total gagne', value: formatPrice(totalEarned), icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50 border-green-100' },
          { label: 'En attente', value: formatPrice(totalPending), icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-100' },
          { label: 'Paiements recus', value: String(completedCount), icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Lumens', value: String(user?.lumenBalance || 0), icon: Wallet, color: 'text-[#D4AF37]', bg: 'bg-amber-50 border-amber-100' },
        ].map((stat) => (
          <div key={stat.label} className={`p-4 rounded-xl border ${stat.bg}`}>
            <stat.icon className={`h-4 w-4 mb-2 ${stat.color}`} />
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly Chart (simple bar chart) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Revenus mensuels
            </h2>
            <p className="text-gray-400 text-sm">6 derniers mois</p>
          </div>
        </div>
        <div className="flex items-end gap-3 h-32">
          {monthlyData.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400 font-medium">
                {m.amount > 0 ? formatPrice(m.amount) : ''}
              </span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-[#D4AF37] to-[#F0D060] transition-all duration-500"
                style={{ height: `${Math.max((m.amount / maxMonthly) * 100, 4)}%` }}
              />
              <span className="text-[10px] text-gray-400">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Payment History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Banknote className="h-5 w-5 text-gray-500" />
            </div>
            <h2
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Historique des paiements
            </h2>
          </div>
        </div>

        <div className="px-6 pb-6">
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">Aucun paiement pour le moment.</p>
              <p className="text-gray-400 text-sm mt-1">
                Completez des taches pour recevoir vos premiers paiements.
              </p>
              <Link
                href="/tasks"
                className="inline-flex items-center gap-1.5 mt-4 text-sm text-[#D4AF37] hover:text-[#C5A028] font-medium"
              >
                Trouver des taches <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.task.title}</p>
                    <p className="text-xs text-gray-400 truncate">{p.task.film.title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-green-600">+{formatPrice(p.amountEur)}</div>
                    <div className="text-[10px] text-gray-300 mt-0.5">{formatDate(p.createdAt)}</div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${statusColors[p.status] || ''}`}>
                    {statusLabels[p.status] || p.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
