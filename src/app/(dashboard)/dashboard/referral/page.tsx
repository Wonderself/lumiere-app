'use client'

import { useState, useEffect, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { getReferralCode, getReferralStats } from '@/app/actions/referral'
import {
  Users, Copy, Check, Share2, Gift, TrendingUp, Link2, Clock, CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ReferralData = Awaited<ReturnType<typeof getReferralStats>>

export default function ReferralPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<ReferralData>(null)
  const [code, setCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const [statsResult, codeResult] = await Promise.all([
        getReferralStats(),
        getReferralCode(),
      ])
      setData(statsResult)
      setCode(codeResult.code)
    })
  }, [])

  const referralLink = code
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${code}`
    : null

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-playfair">
          Parrainage
        </h1>
        <p className="text-gray-400 mt-1">
          Invitez des amis et gagnez des Lumens ensemble.
        </p>
      </div>

      {/* How it works */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50">
        <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Gift className="h-4 w-4 text-[#D4AF37]" />
          Comment ca marche
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Partagez votre lien', desc: 'Envoyez votre lien unique a vos amis', icon: Share2 },
            { step: '2', title: 'Ils s\'inscrivent', desc: 'Votre filleul cree son compte Lumiere', icon: Users },
            { step: '3', title: 'Bonus pour tous', desc: '+30 Lumens pour vous, +10 pour eux', icon: TrendingUp },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-sm font-bold text-[#D4AF37] shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Code & Link */}
      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-[#D4AF37]" />
          Votre lien de parrainage
        </h2>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Code */}
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 font-mono text-sm text-gray-700 truncate">
                {code || '...'}
              </div>
              <button
                onClick={() => code && handleCopy(code)}
                className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* Link */}
            {referralLink && (
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-gray-700 truncate">
                  {referralLink}
                </div>
                <button
                  onClick={() => handleCopy(referralLink)}
                  className="px-4 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] transition-colors text-black font-semibold text-sm whitespace-nowrap"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      {data && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Filleuls', value: data.total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Actives', value: data.completed, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
              { label: 'Lumens Gagnes', value: data.totalEarned, icon: TrendingUp, color: 'text-[#D4AF37]', bg: 'bg-amber-50' },
            ].map((stat) => (
              <div key={stat.label} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
                <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${stat.bg} mb-3`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-playfair">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Referral list */}
          {data.referrals.length > 0 && (
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Vos filleuls</h2>
              <div className="space-y-2">
                {data.referrals.map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center text-xs',
                        r.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      )}>
                        {r.status === 'COMPLETED' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {r.referred?.displayName || 'Utilisateur'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Inscrit le {new Intl.DateTimeFormat('fr-FR').format(new Date(r.createdAt))}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-medium',
                        r.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      )}>
                        {r.status === 'COMPLETED' ? `+${r.tokensEarned} Lumens` : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
