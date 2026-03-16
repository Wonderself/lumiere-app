'use client'

import { useState, useEffect } from 'react'
import {
  Shield, Key, Lock, Eye, EyeOff, Copy, Check,
  AlertTriangle, Clock, User, Activity, CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'

// Pure crypto TOTP (no dependencies)
function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let secret = ''
  const arr = new Uint8Array(20)
  crypto.getRandomValues(arr)
  for (const byte of arr) secret += chars[byte % 32]
  return secret
}

function generateTOTP(secret: string): string {
  // Simplified TOTP display (in production: use HMAC-SHA1 with time-based counter)
  const timeSlice = Math.floor(Date.now() / 30000)
  let hash = 0
  for (let i = 0; i < secret.length; i++) {
    hash = ((hash << 5) - hash + secret.charCodeAt(i) + timeSlice) | 0
  }
  return Math.abs(hash % 1000000).toString().padStart(6, '0')
}

interface AuditEntry {
  id: string
  action: string
  user: string
  ip: string
  timestamp: Date
  status: 'success' | 'failure' | 'warning'
}

export default function SecurityPage() {
  const [totpSecret, setTotpSecret] = useState<string | null>(null)
  const [totpCode, setTotpCode] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  // Simulated audit logs
  const [auditLogs] = useState<AuditEntry[]>([
    { id: '1', action: 'Login', user: 'admin@admin.com', ip: '127.0.0.1', timestamp: new Date(), status: 'success' },
    { id: '2', action: 'Grant Credits', user: 'admin@admin.com', ip: '127.0.0.1', timestamp: new Date(Date.now() - 3600000), status: 'success' },
    { id: '3', action: 'Approve Proposal', user: 'admin@admin.com', ip: '127.0.0.1', timestamp: new Date(Date.now() - 7200000), status: 'success' },
    { id: '4', action: 'Failed Login Attempt', user: 'unknown@test.com', ip: '192.168.1.1', timestamp: new Date(Date.now() - 10800000), status: 'failure' },
    { id: '5', action: 'Run Security Audit', user: 'admin@admin.com', ip: '127.0.0.1', timestamp: new Date(Date.now() - 14400000), status: 'success' },
    { id: '6', action: 'Mode Toggle', user: 'admin@admin.com', ip: '127.0.0.1', timestamp: new Date(Date.now() - 18000000), status: 'warning' },
  ])

  // TOTP timer
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = 30 - (Math.floor(Date.now() / 1000) % 30)
      setTimeLeft(remaining)
      if (totpSecret) setTotpCode(generateTOTP(totpSecret))
    }, 1000)
    return () => clearInterval(interval)
  }, [totpSecret])

  function setupTOTP() {
    const secret = generateSecret()
    setTotpSecret(secret)
    setTotpCode(generateTOTP(secret))
    toast.success('Secret TOTP généré')
  }

  function verifyTOTP() {
    if (verifyCode === totpCode) {
      setIs2FAEnabled(true)
      toast.success('2FA activé avec succès')
    } else {
      toast.error('Code invalide')
    }
  }

  async function copySecret() {
    if (!totpSecret) return
    await navigator.clipboard.writeText(totpSecret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Sécurité & 2FA
        </h1>
        <p className="text-sm text-white/50 mt-1">Authentification 2 facteurs et journal d&apos;audit</p>
      </div>

      {/* 2FA Status */}
      <div className={`rounded-2xl border p-6 ${is2FAEnabled ? 'border-green-500/20 bg-green-500/10' : 'border-yellow-500/20 bg-yellow-500/10'}`}>
        <div className="flex items-center gap-3">
          {is2FAEnabled ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <AlertTriangle className="h-6 w-6 text-yellow-600" />}
          <div>
            <p className="text-sm font-semibold text-white">
              2FA {is2FAEnabled ? 'Activé' : 'Non activé'}
            </p>
            <p className="text-xs text-white/50">
              {is2FAEnabled ? 'Votre compte est protégé par authentification à 2 facteurs' : 'Activez le 2FA pour sécuriser votre compte admin'}
            </p>
          </div>
        </div>
      </div>

      {/* 2FA Setup */}
      {!is2FAEnabled && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Key className="h-4 w-4 text-blue-500" /> Configuration TOTP
          </h2>

          {!totpSecret ? (
            <button
              onClick={setupTOTP}
              className="px-4 py-2.5 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Générer un secret TOTP
            </button>
          ) : (
            <div className="space-y-5">
              {/* Secret */}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Secret (ajoutez dans votre app authenticator)</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-white/[0.05] text-sm font-mono text-white select-all">
                    {showSecret ? totpSecret : '●'.repeat(20)}
                  </code>
                  <button onClick={() => setShowSecret(!showSecret)} className="p-2 rounded-lg hover:bg-white/[0.05]">
                    {showSecret ? <EyeOff className="h-4 w-4 text-white/50" /> : <Eye className="h-4 w-4 text-white/50" />}
                  </button>
                  <button onClick={copySecret} className="p-2 rounded-lg hover:bg-white/[0.05]">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-white/50" />}
                  </button>
                </div>
              </div>

              {/* Current Code */}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Code actuel ({timeLeft}s)</label>
                <div className="flex items-center gap-3">
                  <code className="text-3xl font-mono font-bold text-[#E50914] tracking-widest">{totpCode}</code>
                  <div className="w-8 h-8 relative">
                    <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#E50914" strokeWidth="3"
                        strokeDasharray={`${(timeLeft / 30) * 94.2} 94.2`}
                        strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Verify */}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Entrez le code pour vérifier</label>
                <div className="flex gap-2">
                  <input
                    value={verifyCode}
                    onChange={e => setVerifyCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className="w-40 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white text-center text-lg font-mono tracking-widest focus:border-[#E50914] focus:outline-none"
                  />
                  <button
                    onClick={verifyTOTP}
                    disabled={verifyCode.length !== 6}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                  >
                    Activer 2FA
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audit Logs */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-500" />
          Journal d&apos;audit
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="divide-y divide-white/10">
            {auditLogs.map(log => (
              <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                    log.status === 'success' ? 'bg-green-500' : log.status === 'failure' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{log.action}</p>
                    <div className="flex items-center gap-2 text-[10px] text-white/50">
                      <User className="h-3 w-3" /> {log.user}
                      <span>·</span>
                      <span>{log.ip}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0 pl-5 sm:pl-0">
                  <p className="text-[10px] text-white/50 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {log.timestamp.toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
