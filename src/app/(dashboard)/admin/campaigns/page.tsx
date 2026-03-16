import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import {
  Target, CheckCircle2, XCircle, Clock, Play, Pause,
  Activity, TrendingUp, DollarSign, Eye,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Campaigns — Admin CINEGEN' }

export default async function AdminCampaignsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  // Simulated campaign stats (in production: from DB)
  const stats = {
    total: 0, draft: 0, pending: 0, active: 0, completed: 0, cancelled: 0,
  }

  const kpis = [
    { label: 'Total', value: stats.total, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Brouillons', value: stats.draft, icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
    { label: 'En attente', value: stats.pending, icon: Eye, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
    { label: 'Actives', value: stats.active, icon: Play, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Terminées', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Annulées', value: stats.cancelled, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">Campaigns Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Gestion et approbation des campagnes marketing</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className={`rounded-xl shadow-sm border ${kpi.border} ${kpi.bg} p-4 sm:p-5`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-[11px] text-gray-500 uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{kpi.value}</p>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl shadow-sm border border-gray-100 bg-white p-8 sm:p-12 text-center">
        <Target className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">Aucune campagne en cours</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Les campagnes créées depuis la page Marketing apparaîtront ici pour approbation.
          Vous pourrez approuver, rejeter, lancer et compléter les campagnes.
        </p>
      </div>
    </div>
  )
}
