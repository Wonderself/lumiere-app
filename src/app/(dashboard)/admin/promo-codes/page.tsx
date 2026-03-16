'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { SAMPLE_PROMO_CODES, PROMO_TYPES, GROWTH_AGENTS } from '@/data/growth'
import type { PromoCodeConfig, PromoType } from '@/data/growth'
import { microToCredits } from '@/lib/ai-pricing'
import {
  Ticket, Plus, Search, Copy, Check, Trash2, Eye, EyeOff,
  Bot, Clock, Users, Percent, Zap, Coins,
  CheckCircle2, XCircle, BarChart3,
} from 'lucide-react'

export default function PromoCodesPage() {
  const [codes, setCodes] = useState<PromoCodeConfig[]>(SAMPLE_PROMO_CODES)
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [newCode, setNewCode] = useState({ code: '', type: 'credits' as PromoType, value: 0, maxUses: 100, expiresAt: '', onePerUser: true, description: '' })

  const filtered = codes.filter(c => !search || c.code.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
  const totalUsed = codes.reduce((s, c) => s + c.usedCount, 0)
  const activeCount = codes.filter(c => c.isActive).length

  function createCode() {
    if (!newCode.code.trim()) { toast.error('Code requis'); return }
    if (codes.find(c => c.code === newCode.code.toUpperCase())) { toast.error('Code déjà existant'); return }
    setCodes(prev => [...prev, { ...newCode, code: newCode.code.toUpperCase(), usedCount: 0, isActive: true, expiresAt: newCode.expiresAt || null, createdAt: new Date().toISOString().split('T')[0], createdBy: 'admin' }])
    setNewCode({ code: '', type: 'credits', value: 0, maxUses: 100, expiresAt: '', onePerUser: true, description: '' })
    setShowCreate(false)
    toast.success('Code promo créé')
  }

  function toggleCode(code: string) {
    setCodes(prev => prev.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c))
  }

  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const TYPE_ICONS: Record<string, typeof Coins> = { coins: Coins, percent: Percent, clock: Clock, zap: Zap }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">Codes Promo</h1>
          <p className="text-sm text-gray-500 mt-1">{codes.length} codes · {activeCount} actifs · {totalUsed} utilisations</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] text-white text-xs font-medium rounded-lg hover:bg-[#FF2D2D]"><Plus className="h-4 w-4" />Nouveau code</button>
      </div>

      {/* Agent */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 bg-white w-fit">
        <Bot className="h-3.5 w-3.5" style={{ color: GROWTH_AGENTS[0].color }} />
        <div><p className="text-[10px] font-medium text-[#1A1A2E]">{GROWTH_AGENTS[0].name}</p><p className="text-[9px] text-gray-500">{GROWTH_AGENTS[0].role}</p></div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-green-50 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{activeCount}</p><p className="text-[10px] text-gray-500">Actifs</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-blue-50 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalUsed}</p><p className="text-[10px] text-gray-500">Utilisations</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-purple-50 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{codes.length}</p><p className="text-[10px] text-gray-500">Total codes</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{codes.filter(c => !c.isActive).length}</p><p className="text-[10px] text-gray-500">Inactifs</p>
        </div>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#1A1A2E]">Nouveau code promo</h2>
          <div className="grid grid-cols-2 gap-3">
            <input value={newCode.code} onChange={e => setNewCode(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="CODE (ex: CINEMA50)" className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono uppercase focus:border-[#E50914] focus:outline-none" />
            <select value={newCode.type} onChange={e => setNewCode(p => ({ ...p, type: e.target.value as PromoType }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">{Object.entries(PROMO_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
            <input type="number" value={newCode.value || ''} onChange={e => setNewCode(p => ({ ...p, value: parseInt(e.target.value) || 0 }))} placeholder={`Valeur (${PROMO_TYPES[newCode.type].unit})`} className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none" />
            <input type="number" value={newCode.maxUses || ''} onChange={e => setNewCode(p => ({ ...p, maxUses: parseInt(e.target.value) || 0 }))} placeholder="Max utilisations (0=illimité)" className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none" />
            <input type="date" value={newCode.expiresAt} onChange={e => setNewCode(p => ({ ...p, expiresAt: e.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            <input value={newCode.description} onChange={e => setNewCode(p => ({ ...p, description: e.target.value }))} placeholder="Description" className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none" />
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-600"><input type="checkbox" checked={newCode.onePerUser} onChange={e => setNewCode(p => ({ ...p, onePerUser: e.target.checked }))} className="accent-[#E50914]" />Un seul usage par utilisateur</label>
          <div className="flex gap-2">
            <button onClick={createCode} className="px-4 py-2 bg-[#E50914] text-white text-xs rounded-lg">Créer</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-100 text-gray-600 text-xs rounded-lg">Annuler</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un code..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-[#E50914] focus:outline-none" />
      </div>

      {/* Codes Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filtered.map(code => {
            const typeConf = PROMO_TYPES[code.type]
            const TIcon = TYPE_ICONS[typeConf.icon] || Ticket
            const usagePct = code.maxUses > 0 ? Math.round((code.usedCount / code.maxUses) * 100) : 0
            return (
              <div key={code.code} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
                <TIcon className="h-5 w-5 shrink-0" style={{ color: typeConf.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono font-bold text-[#1A1A2E]">{code.code}</code>
                    <button onClick={() => copyCode(code.code)} className="text-gray-500 hover:text-gray-600">{copied === code.code ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}</button>
                    {code.isActive ? <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-600">Actif</span> : <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactif</span>}
                    {code.onePerUser && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-500">1/user</span>}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">{code.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                    <span>{typeConf.label}: {code.type === 'credits' ? microToCredits(code.value).toFixed(0) + ' cr' : code.value + ' ' + typeConf.unit}</span>
                    <span>·</span>
                    <span>{code.usedCount}/{code.maxUses || '∞'} utilisations ({usagePct}%)</span>
                    {code.expiresAt && <><span>·</span><span>Expire: {code.expiresAt}</span></>}
                  </div>
                </div>
                <button onClick={() => toggleCode(code.code)} className={`p-1.5 rounded-lg ${code.isActive ? 'hover:bg-red-50' : 'hover:bg-green-50'}`}>
                  {code.isActive ? <EyeOff className="h-4 w-4 text-red-400" /> : <Eye className="h-4 w-4 text-green-600" />}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
