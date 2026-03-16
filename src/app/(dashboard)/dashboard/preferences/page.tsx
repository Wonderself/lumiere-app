'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Settings, Sun, Moon, Globe, Bell, BellOff,
  Save, Loader2, Monitor, Smartphone,
} from 'lucide-react'

export default function PreferencesPage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [language, setLanguage] = useState('fr')
  const [pushNotifs, setPushNotifs] = useState(true)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true)
  const [taskAlerts, setTaskAlerts] = useState(true)
  const [voteAlerts, setVoteAlerts] = useState(true)
  const [saving, setSaving] = useState(false)

  async function savePreferences() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    toast.success('Préférences sauvegardées')
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">Préférences</h1>
        <p className="text-sm text-gray-500 mt-1">Personnalisez votre expérience CineGen</p>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2"><Settings className="h-4 w-4 text-gray-500" /> Apparence</h2>
        <div className="flex gap-3">
          {[
            { value: 'light' as const, label: 'Clair', icon: Sun },
            { value: 'dark' as const, label: 'Sombre', icon: Moon },
            { value: 'system' as const, label: 'Système', icon: Monitor },
          ].map(opt => {
            const OIcon = opt.icon
            return (
              <button key={opt.value} onClick={() => setTheme(opt.value)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-colors ${theme === opt.value ? 'border-[#E50914] bg-red-50 text-[#E50914]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                <OIcon className="h-4 w-4" /> <span className="text-sm">{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Language */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2"><Globe className="h-4 w-4 text-blue-500" /> Langue</h2>
        <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none">
          <option value="fr">🇫🇷 Français</option>
          <option value="en">🇬🇧 English</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#1A1A2E] flex items-center gap-2"><Bell className="h-4 w-4 text-yellow-500" /> Notifications</h2>
        {[
          { label: 'Notifications push', desc: 'Recevoir les notifications dans le navigateur', value: pushNotifs, set: setPushNotifs, icon: Smartphone },
          { label: 'Notifications email', desc: 'Recevoir les résumés par email', value: emailNotifs, set: setEmailNotifs, icon: Bell },
          { label: 'Alerte solde bas', desc: 'Alerte quand les crédits sont faibles', value: lowBalanceAlert, set: setLowBalanceAlert, icon: Bell },
          { label: 'Tâches & missions', desc: 'Notifications pour les nouvelles tâches', value: taskAlerts, set: setTaskAlerts, icon: Bell },
          { label: 'Résultats des votes', desc: 'Résultats des votes communautaires', value: voteAlerts, set: setVoteAlerts, icon: Bell },
        ].map(notif => {
          const NIcon = notif.icon
          return (
            <div key={notif.label} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <NIcon className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-[#1A1A2E]">{notif.label}</p>
                  <p className="text-[10px] text-gray-500">{notif.desc}</p>
                </div>
              </div>
              <button onClick={() => notif.set(!notif.value)} className={`relative h-6 w-11 rounded-full transition-colors ${notif.value ? 'bg-[#E50914]' : 'bg-gray-300'}`}>
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${notif.value ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          )
        })}
      </div>

      <button onClick={savePreferences} disabled={saving} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
        Sauvegarder les préférences
      </button>
    </div>
  )
}
