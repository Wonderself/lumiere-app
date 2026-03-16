import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { microToCredits } from '@/lib/ai-pricing'
import Link from 'next/link'
import {
  Users, Crown, Star, Shield, Eye, Search,
  ArrowUpRight, ChevronRight, Zap, CreditCard,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'User Management — Admin CINEGEN' }

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ADMIN: { label: 'Admin', color: 'text-red-600', bg: 'bg-red-50' },
  MODERATOR: { label: 'Moderator', color: 'text-purple-600', bg: 'bg-purple-50' },
  CONTRIBUTOR: { label: 'Contributor', color: 'text-blue-600', bg: 'bg-blue-50' },
  VIEWER: { label: 'Viewer', color: 'text-gray-600', bg: 'bg-gray-50' },
}

const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  ROOKIE: { label: 'Rookie', color: 'text-gray-500' },
  INTERMEDIATE: { label: 'Intermediate', color: 'text-blue-500' },
  ADVANCED: { label: 'Advanced', color: 'text-purple-500' },
  EXPERT: { label: 'Expert', color: 'text-orange-500' },
  MASTER: { label: 'Master', color: 'text-red-500' },
}

export default async function UserManagementPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  const [
    totalUsers, users, roleDistribution, levelDistribution,
    topConsumers, recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true, email: true, displayName: true, role: true, level: true,
        isVerified: true, lumenBalance: true, createdAt: true,
        creditAccount: { select: { balance: true, totalUsed: true } },
        _count: { select: { agentExecutions: true, conversations: true } },
      },
    }),
    prisma.user.groupBy({ by: ['role'], _count: true }),
    prisma.user.groupBy({ by: ['level'], _count: true }),
    prisma.aIUsageLog.groupBy({
      by: ['userId'],
      _sum: { billedCredits: true },
      _count: true,
      orderBy: { _sum: { billedCredits: 'desc' } },
      take: 20,
    }).then(async (groups) => {
      const userIds = groups.map((g: any) => g.userId)
      const usersData = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, displayName: true, email: true },
      })
      const userMap = new Map(usersData.map(u => [u.id, u]))
      return groups.map((g: any) => ({
        userId: g.userId,
        user: userMap.get(g.userId),
        totalSpent: g._sum.billedCredits ?? 0,
        requestCount: g._count,
      }))
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, email: true, displayName: true, createdAt: true },
    }),
  ])

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
          Gestion Utilisateurs
        </h1>
        <p className="text-sm text-gray-500 mt-1">{totalUsers} utilisateurs inscrits</p>
      </div>

      {/* Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Roles */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-500" /> Distribution rôles
          </h3>
          <div className="space-y-3">
            {roleDistribution.map(r => {
              const config = ROLE_CONFIG[r.role] || ROLE_CONFIG.CONTRIBUTOR
              const pct = Math.round((r._count / totalUsers) * 100)
              return (
                <div key={r.role}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={config.color}>{config.label}</span>
                    <span className="text-gray-500">{r._count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div className={`h-full rounded-full ${config.bg} border ${config.color.replace('text-', 'border-')}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Levels */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" /> Distribution niveaux
          </h3>
          <div className="space-y-3">
            {levelDistribution.map(l => {
              const config = LEVEL_CONFIG[l.level] || LEVEL_CONFIG.ROOKIE
              const pct = Math.round((l._count / totalUsers) * 100)
              return (
                <div key={l.level}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={config.color}>{config.label}</span>
                    <span className="text-gray-500">{l._count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full">
                    <div className="h-full rounded-full bg-yellow-400" style={{ width: `${Math.max(pct, 2)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top 20 Consumers */}
      <div>
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Top 20 consommateurs IA
        </h2>
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="divide-y divide-gray-100">
            {topConsumers.map((c, i) => (
              <Link
                key={c.userId}
                href={`/admin/users/${c.userId}`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs font-bold text-gray-500 w-6">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A2E] truncate">{c.user?.displayName || c.user?.email || 'Anonymous'}</p>
                  <p className="text-[10px] text-gray-500">{c.requestCount} requests</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#E50914]">{microToCredits(c.totalSpent).toFixed(2)} cr</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </Link>
            ))}
            {topConsumers.length === 0 && (
              <div className="p-8 text-center text-sm text-gray-500">Pas encore de données de consommation</div>
            )}
          </div>
        </div>
      </div>

      {/* All Users Table */}
      <div>
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Tous les utilisateurs
        </h2>
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Utilisateur</th>
                <th className="text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Rôle</th>
                <th className="text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Level</th>
                <th className="text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Balance</th>
                <th className="text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Activity</th>
                <th className="text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Inscrit</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => {
                const roleConf = ROLE_CONFIG[user.role] || ROLE_CONFIG.CONTRIBUTOR
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#1A1A2E]">{user.displayName || '—'}</p>
                        <p className="text-[10px] text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${roleConf.bg} ${roleConf.color}`}>
                        {roleConf.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-500">{user.level}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-xs font-medium text-[#1A1A2E]">
                        {user.creditAccount ? microToCredits(user.creditAccount.balance).toFixed(1) : '0'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-[10px] text-gray-500">
                        {user._count.agentExecutions} exec · {user._count.conversations} chats
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-[10px] text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/users/${user.id}`} className="text-xs text-blue-500 hover:underline">
                        Détail
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
