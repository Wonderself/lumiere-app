import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { L1_AGENTS, L2_AGENTS, L3_AGENTS } from '@/data/agents'
import * as circuitBreaker from '@/lib/guardrails/circuit-breaker'
import * as fallbackManager from '@/lib/guardrails/fallback-manager'
import { microToCredits } from '@/lib/ai-pricing'
import Link from 'next/link'
import {
  Users, Film, Bot, MessageSquare, CreditCard, Activity,
  Shield, Database, Server, Wifi, CheckCircle2, XCircle,
  AlertTriangle, TrendingUp, Zap, Brain, GitBranch,
  Clock, ArrowUpRight, ChevronRight, Lock, Crown,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin Overview — CINEGEN' }

export default async function AdminOverviewPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(Date.now() - 7 * 86400000)

  const [
    totalUsers, newUsersToday, newUsersWeek,
    totalFilms,
    totalConversations, conversationsToday,
    totalExecutions, executionsToday,
    totalAIRequests, aiRequestsToday,
    revenue,
    pendingProposals,
    failedExecutions,
    activeAccounts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.film.count(),
    prisma.conversation.count(),
    prisma.conversation.count({ where: { createdAt: { gte: today } } }),
    prisma.agentExecution.count(),
    prisma.agentExecution.count({ where: { createdAt: { gte: today } } }),
    prisma.aIUsageLog.count(),
    prisma.aIUsageLog.count({ where: { createdAt: { gte: today } } }),
    prisma.aIUsageLog.aggregate({ _sum: { billedCredits: true } }),
    prisma.autopilotProposal.count({ where: { status: 'PENDING_REVIEW' as any } }),
    prisma.agentExecution.count({ where: { status: 'FAILED', createdAt: { gte: today } } }),
    prisma.creditAccount.count({ where: { balance: { gt: 0 } } }),
  ])

  const circuitSummary = circuitBreaker.getSummary()
  const providerSummary = fallbackManager.getHealthSummary()
  const providers = fallbackManager.getAllProviders()

  const kpis = [
    { label: 'Users', value: totalUsers, sub: `+${newUsersToday} today`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Films', value: totalFilms, sub: 'Total catalog', icon: Film, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { label: 'Conversations', value: totalConversations, sub: `+${conversationsToday} today`, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'AI Requests', value: totalAIRequests, sub: `+${aiRequestsToday} today`, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    { label: 'Revenue', value: `${microToCredits(revenue._sum.billedCredits ?? 0).toFixed(0)} cr`, sub: 'Total earned', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Wallets actifs', value: activeAccounts, sub: 'With balance > 0', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  ]

  const agentTiers = [
    { label: 'L1 Execution', agents: L1_AGENTS, icon: Zap, color: '#3B82F6', model: 'Sonnet' },
    { label: 'L2 Management', agents: L2_AGENTS, icon: GitBranch, color: '#8B5CF6', model: 'Opus' },
    { label: 'L3 Strategy', agents: L3_AGENTS, icon: Brain, color: '#F59E0B', model: 'Opus+' },
  ]

  const infraHealth = [
    { name: 'PostgreSQL', status: 'healthy' as const, icon: Database },
    { name: 'Redis', status: process.env.REDIS_URL ? 'healthy' as const : 'degraded' as const, icon: Server },
    { name: 'Backend', status: 'healthy' as const, icon: Wifi },
    { name: 'Dashboard', status: 'healthy' as const, icon: Activity },
  ]

  const securityBadges = [
    { label: 'Auth Bypass', status: 'warning' as const, detail: 'admin@admin.com active' },
    { label: 'HTTPS', status: 'ok' as const, detail: 'Enabled' },
    { label: 'PII Masking', status: 'ok' as const, detail: '7 patterns active' },
    { label: 'Injection Guard', status: 'ok' as const, detail: '10 patterns' },
    { label: 'Circuit Breakers', status: circuitSummary.open > 0 ? 'warning' as const : 'ok' as const, detail: `${circuitSummary.healthy}/${circuitSummary.total} healthy` },
    { label: 'Providers', status: providerSummary.down > 0 ? 'error' as const : 'ok' as const, detail: `${providerSummary.healthy}/${providerSummary.total} up` },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
            Admin Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">Tableau de bord temps réel de la plateforme CineGen</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {pendingProposals > 0 && (
            <Link href="/admin/autopilot" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
              <Clock className="h-3.5 w-3.5" />
              {pendingProposals} pending
            </Link>
          )}
          {failedExecutions > 0 && (
            <Link href="/admin/guardrails" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200">
              <AlertTriangle className="h-3.5 w-3.5" />
              {failedExecutions} errors today
            </Link>
          )}
        </div>
      </div>

      {/* 6 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className={`rounded-2xl border ${kpi.border} ${kpi.bg} p-5`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}</p>
              <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" />
                {kpi.sub}
              </p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agents by Level */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#E50914]" />
            Agents par niveau
          </h2>
          <div className="space-y-4">
            {agentTiers.map(tier => {
              const TIcon = tier.icon
              return (
                <div key={tier.label} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TIcon className="h-4 w-4" style={{ color: tier.color }} />
                      <span className="text-sm font-semibold text-[#1A1A2E]">{tier.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{tier.model}</span>
                    </div>
                    <span className="text-xs text-gray-500">{tier.agents.length} agents</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tier.agents.map(agent => (
                      <div
                        key={agent.slug}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-100 bg-gray-50 text-xs text-gray-600"
                      >
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        {agent.name}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Infra Health */}
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
              <Server className="h-5 w-5 text-emerald-500" />
              Infrastructure
            </h2>
            <div className="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100">
              {infraHealth.map(infra => {
                const IIcon = infra.icon
                return (
                  <div key={infra.name} className="flex items-center gap-3 px-5 py-3">
                    <IIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-[#1A1A2E] flex-1">{infra.name}</span>
                    <div className={`h-2.5 w-2.5 rounded-full ${
                      infra.status === 'healthy' ? 'bg-green-500' :
                      infra.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Security Badges */}
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Sécurité
            </h2>
            <div className="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100">
              {securityBadges.map(badge => (
                <div key={badge.label} className="flex items-center gap-3 px-5 py-3">
                  {badge.status === 'ok' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : badge.status === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm text-[#1A1A2E] flex-1">{badge.label}</span>
                  <span className="text-[10px] text-gray-500">{badge.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Accès rapide</h2>
            <div className="space-y-2">
              {[
                { href: '/admin/users', label: 'Gestion utilisateurs', icon: Users },
                { href: '/admin/billing', label: 'Billing & Revenus', icon: CreditCard },
                { href: '/admin/guardrails', label: 'Guardrails Monitor', icon: Shield },
                { href: '/admin/autopilot', label: 'Autopilot & Gouvernance', icon: Bot },
                { href: '/admin/films', label: 'Gestion films', icon: Film },
              ].map(link => {
                const LIcon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 transition-colors"
                  >
                    <LIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-[#1A1A2E] flex-1">{link.label}</span>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
