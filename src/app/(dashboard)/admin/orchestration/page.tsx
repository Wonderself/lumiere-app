'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { ORCHESTRATION_AGENTS, APPROVAL_LEVELS, AUTO_APPROVAL_RULES, EVENT_TYPES, SSE_CONFIG, ORCHESTRATOR_CONFIG, REPORT_SCHEDULES } from '@/data/orchestration'
import {
  CheckSquare, Radio, Wifi, Cog, FileBarChart, ArrowUpCircle,
  GitBranch, Bot, RefreshCcw, Send, Shield, AlertTriangle,
  Clock, Activity, Zap, CheckCircle2, XCircle, Play,
  BarChart3, Loader2, Users,
} from 'lucide-react'

export default function OrchestrationPage() {
  const [tab, setTab] = useState<'approval' | 'events' | 'sse' | 'orchestrator' | 'reports'>('approval')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [sseStats, setSSEStats] = useState<{ connected: number; max: number; capacityPercent: number; status: 'ok' | 'warning' | 'critical' }>({ connected: 12, max: SSE_CONFIG.maxClients, capacityPercent: 2, status: 'ok' })

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      // Simulate SSE stats update
      const connected = Math.floor(Math.random() * 30) + 5
      setSSEStats({
        connected, max: SSE_CONFIG.maxClients,
        capacityPercent: Math.round((connected / SSE_CONFIG.maxClients) * 100),
        status: connected >= SSE_CONFIG.criticalThreshold ? 'critical' : connected >= SSE_CONFIG.warningThreshold ? 'warning' : 'ok',
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">Orchestration & Events</h1>
          <p className="text-sm text-gray-500 mt-1">Approval workflow · Event bus · SSE · Orchestrator · Reports</p>
        </div>
        <button onClick={() => setAutoRefresh(!autoRefresh)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${autoRefresh ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          <Radio className={`h-3.5 w-3.5 ${autoRefresh ? 'animate-pulse' : ''}`} />{autoRefresh ? 'Live' : 'Paused'}
        </button>
      </div>

      {/* Agents */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {ORCHESTRATION_AGENTS.map(a => (
          <div key={a.slug} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 bg-white shrink-0">
            <Bot className="h-3.5 w-3.5" style={{ color: a.color }} />
            <div><p className="text-[10px] font-medium text-[#1A1A2E]">{a.name}</p><p className="text-[9px] text-gray-500">{a.role}</p></div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'approval' as const, label: 'Approval', icon: CheckSquare },
          { key: 'events' as const, label: 'Event Bus', icon: Radio },
          { key: 'sse' as const, label: 'SSE Manager', icon: Wifi },
          { key: 'orchestrator' as const, label: 'Orchestrator', icon: Cog },
          { key: 'reports' as const, label: 'Reports', icon: FileBarChart },
        ].map(t => {
          const TIcon = t.icon
          return <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium shrink-0 ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><TIcon className="h-3.5 w-3.5" />{t.label}</button>
        })}
      </div>

      {/* APPROVAL */}
      {tab === 'approval' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {APPROVAL_LEVELS.map(level => (
              <div key={level.level} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: level.color }} />
                  <h3 className="text-sm font-bold text-[#1A1A2E]">{level.label}</h3>
                  <span className="text-[10px] text-gray-500 ml-auto">{level.level}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{level.description}</p>
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between"><span className="text-gray-500">Auto-expire</span><span className="text-[#1A1A2E] font-medium">{level.autoExpireHours}h</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Auto-approval</span><span className={level.autoApprovalEnabled ? 'text-green-600' : 'text-red-500'}>{level.autoApprovalEnabled ? 'Oui' : 'Non'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Canaux</span><span className="text-[#1A1A2E]">{level.channels.join(', ')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Rôle requis</span><span className="text-[#1A1A2E]">{level.requiredRole}</span></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-4">Règles auto-approval</h3>
            <div className="space-y-2">
              {AUTO_APPROVAL_RULES.map(rule => {
                const level = APPROVAL_LEVELS.find(l => l.level === rule.level)
                return (
                  <div key={rule.actionType} className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-100 hover:bg-gray-50">
                    {rule.autoApprove ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Shield className="h-4 w-4 text-orange-500" />}
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[#1A1A2E]">{rule.actionType.replace(/_/g, ' ')}</p>
                      <p className="text-[10px] text-gray-500">{rule.condition}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${level?.color}15`, color: level?.color }}>{level?.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* EVENTS */}
      {tab === 'events' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{EVENT_TYPES.length}</p><p className="text-[10px] text-gray-500">Event types</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{EVENT_TYPES.filter(e => e.severity === 'info').length}</p><p className="text-[10px] text-gray-500">Info</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{EVENT_TYPES.filter(e => e.severity === 'warning').length}</p><p className="text-[10px] text-gray-500">Warning</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{EVENT_TYPES.filter(e => e.severity === 'error' || e.severity === 'critical').length}</p><p className="text-[10px] text-gray-500">Error/Critical</p>
            </div>
          </div>

          <div className="rounded-xl shadow-sm border border-gray-100 bg-white overflow-hidden">
            <div className="divide-y divide-gray-100">
              {EVENT_TYPES.map(event => {
                const sevColor = event.severity === 'critical' ? 'bg-red-500' : event.severity === 'error' ? 'bg-red-400' : event.severity === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                return (
                  <div key={event.type} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                    <div className={`h-2.5 w-2.5 rounded-full ${sevColor}`} />
                    <div className="flex-1">
                      <code className="text-xs font-mono text-[#1A1A2E]">{event.type}</code>
                      <p className="text-[10px] text-gray-500">{event.description}</p>
                    </div>
                    <span className="text-[10px] text-gray-500">{event.category}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${event.severity === 'critical' ? 'bg-red-100 text-red-600' : event.severity === 'error' ? 'bg-red-50 text-red-500' : event.severity === 'warning' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-500'}`}>{event.severity}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* SSE */}
      {tab === 'sse' && (
        <div className="space-y-6">
          {/* Capacity Gauge */}
          <div className={`rounded-2xl border p-8 text-center ${sseStats.status === 'critical' ? 'border-red-200 bg-red-50' : sseStats.status === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
            <Wifi className={`h-10 w-10 mx-auto mb-3 ${sseStats.status === 'critical' ? 'text-red-500' : sseStats.status === 'warning' ? 'text-yellow-500' : 'text-green-500'}`} />
            <p className="text-4xl font-bold text-[#1A1A2E]">{sseStats.connected}<span className="text-lg text-gray-500">/{sseStats.max}</span></p>
            <p className="text-sm text-gray-500 mt-1">Clients SSE connectés ({sseStats.capacityPercent}%)</p>
            <div className="w-full max-w-md mx-auto h-4 bg-gray-200 rounded-full mt-4 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${sseStats.status === 'critical' ? 'bg-red-500' : sseStats.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${sseStats.capacityPercent}%` }} />
            </div>
            <div className="flex justify-between max-w-md mx-auto mt-1 text-[10px] text-gray-500">
              <span>0</span>
              <span className="text-yellow-500">⚠️ {SSE_CONFIG.warningThreshold}</span>
              <span className="text-red-500">🚨 {SSE_CONFIG.criticalThreshold}</span>
              <span>{SSE_CONFIG.maxClients}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[10px] text-gray-500">Heartbeat</p>
              <p className="text-lg font-bold text-[#1A1A2E]">{SSE_CONFIG.heartbeatIntervalMs / 1000}s</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[10px] text-gray-500">Dead client timeout</p>
              <p className="text-lg font-bold text-[#1A1A2E]">{SSE_CONFIG.deadClientTimeoutMs / 1000}s</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[10px] text-gray-500">Max queue/client</p>
              <p className="text-lg font-bold text-[#1A1A2E]">{SSE_CONFIG.backpressureMaxQueue}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[10px] text-gray-500">Cleanup interval</p>
              <p className="text-lg font-bold text-[#1A1A2E]">{SSE_CONFIG.cleanupIntervalMs / 1000}s</p>
            </div>
          </div>

          {/* Alert thresholds */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-4">Seuils d&apos;alerte</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-100">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#1A1A2E]">Warning à {SSE_CONFIG.warningThreshold} clients (60%)</p>
                  <p className="text-[10px] text-gray-500">Notification Telegram — envisager d&apos;augmenter maxClients</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-100">
                <XCircle className="h-4 w-4 text-red-500" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#1A1A2E]">Critical à {SSE_CONFIG.criticalThreshold} clients (80%)</p>
                  <p className="text-[10px] text-gray-500">Alerte urgente — augmenter maxClients IMMÉDIATEMENT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORCHESTRATOR */}
      {tab === 'orchestrator' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2"><Cog className="h-4 w-4 text-yellow-500" />Configuration Orchestrator</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Main loop', value: `${ORCHESTRATOR_CONFIG.mainLoopIntervalMs / 1000}s` },
                { label: 'Task scheduler', value: ORCHESTRATOR_CONFIG.taskSchedulerEnabled ? '✅ Actif' : '❌ Inactif' },
                { label: 'Recurring scheduler', value: ORCHESTRATOR_CONFIG.recurringSchedulerEnabled ? '✅ Actif' : '❌ Inactif' },
                { label: 'Event-driven', value: ORCHESTRATOR_CONFIG.eventDrivenEnabled ? '✅ Actif' : '❌ Inactif' },
                { label: 'Max concurrent', value: `${ORCHESTRATOR_CONFIG.maxConcurrentTasks} tâches` },
                { label: 'Retry', value: `${ORCHESTRATOR_CONFIG.retryAttempts}x (${ORCHESTRATOR_CONFIG.retryDelayMs / 1000}s)` },
              ].map(item => (
                <div key={item.label} className="rounded-lg border border-gray-100 p-3">
                  <p className="text-[10px] text-gray-500">{item.label}</p>
                  <p className="text-sm font-bold text-[#1A1A2E]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-4">Boucle principale (30s)</h3>
            <div className="space-y-2">
              {[
                { step: '1', label: 'Check expired approvals', desc: 'Auto-deny les propositions expirées', icon: Clock },
                { step: '2', label: 'SSE heartbeat', desc: 'Ping tous les clients connectés', icon: Wifi },
                { step: '3', label: 'Task scheduler', desc: 'Exécuter les tâches planifiées', icon: Zap },
                { step: '4', label: 'Event processing', desc: 'Traiter les événements en queue', icon: Activity },
                { step: '5', label: 'Metrics update', desc: 'Mettre à jour les métriques système', icon: BarChart3 },
              ].map(item => {
                const SIcon = item.icon
                return (
                  <div key={item.step} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-100">
                    <span className="h-6 w-6 rounded-full bg-[#E50914]/10 text-[#E50914] flex items-center justify-center text-[10px] font-bold">{item.step}</span>
                    <SIcon className="h-4 w-4 text-gray-500" />
                    <div className="flex-1"><p className="text-xs font-medium text-[#1A1A2E]">{item.label}</p><p className="text-[10px] text-gray-500">{item.desc}</p></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* REPORTS */}
      {tab === 'reports' && (
        <div className="space-y-4">
          {REPORT_SCHEDULES.map(report => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileBarChart className="h-5 w-5 text-[#E50914]" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1A2E]">{report.label}</h3>
                    <p className="text-[10px] text-gray-500">{report.schedule} · via {report.channel}</p>
                  </div>
                </div>
                <button onClick={() => toast.success(`${report.label} envoyé`)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
                  <Send className="h-3.5 w-3.5" />Envoyer maintenant
                </button>
              </div>
              <p className="text-xs text-gray-500">{report.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
