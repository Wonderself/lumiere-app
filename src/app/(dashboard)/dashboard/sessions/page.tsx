'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Key, Monitor, Smartphone, Globe, Clock, MapPin,
  Shield, Trash2, AlertTriangle, CheckCircle2,
} from 'lucide-react'

interface Session {
  id: string
  device: string
  browser: string
  ip: string
  location: string
  lastActive: Date
  current: boolean
  icon: typeof Monitor
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([
    { id: 'sess-1', device: 'Desktop', browser: 'Chrome 120', ip: '127.0.0.1', location: 'Paris, FR', lastActive: new Date(), current: true, icon: Monitor },
    { id: 'sess-2', device: 'Mobile', browser: 'Safari iOS', ip: '82.64.12.xxx', location: 'Paris, FR', lastActive: new Date(Date.now() - 7200000), current: false, icon: Smartphone },
    { id: 'sess-3', device: 'Tablet', browser: 'Firefox', ip: '192.168.1.xxx', location: 'Lyon, FR', lastActive: new Date(Date.now() - 86400000), current: false, icon: Smartphone },
  ])

  function revokeSession(id: string) {
    setSessions(prev => prev.filter(s => s.id !== id))
    toast.success('Session révoquée')
  }

  function revokeAll() {
    setSessions(prev => prev.filter(s => s.current))
    toast.success('Toutes les autres sessions révoquées')
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Sessions Actives</h1>
        <p className="text-sm text-white/50 mt-1">Gérez vos sessions de connexion</p>
      </div>

      {/* JWT Info */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-center gap-3">
          <Key className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Authentification JWT</p>
            <p className="text-xs text-blue-600">Tokens signés côté serveur · Expiration automatique · Révocation instantanée</p>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="divide-y divide-white/10">
          {sessions.map(sess => {
            const SIcon = sess.icon
            return (
              <div key={sess.id} className="flex items-center gap-4 px-5 py-4">
                <SIcon className="h-5 w-5 text-white/50 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{sess.device} — {sess.browser}</p>
                    {sess.current && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">Session actuelle</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-white/50 mt-0.5">
                    <span className="flex items-center gap-0.5"><Globe className="h-3 w-3" />{sess.ip}</span>
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{sess.location}</span>
                    <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{sess.lastActive.toLocaleString('fr-FR')}</span>
                  </div>
                </div>
                {!sess.current && (
                  <button onClick={() => revokeSession(sess.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" /> Révoquer
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {sessions.filter(s => !s.current).length > 0 && (
        <button onClick={revokeAll} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium">
          <AlertTriangle className="h-4 w-4" /> Révoquer toutes les autres sessions
        </button>
      )}

      {/* Security Tips */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-green-500" /> Conseils sécurité</h3>
        <ul className="space-y-2 text-xs text-white/50">
          <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />Révoquez les sessions que vous ne reconnaissez pas</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />Activez le 2FA pour une sécurité renforcée</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />Utilisez un mot de passe unique et fort</li>
        </ul>
      </div>
    </div>
  )
}
