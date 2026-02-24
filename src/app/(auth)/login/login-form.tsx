'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction } from '@/app/actions/auth'
import { Mail, Lock, Sparkles } from 'lucide-react'

export function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [state, action, isPending] = useActionState(loginAction, {})

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-2">
          <Sparkles className="h-8 w-8 text-[#D4AF37]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
          <span className="text-shimmer">Bienvenue</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base">Connectez-vous à votre compte Lumière.</p>
      </div>

      {/* Form Card */}
      <div className="relative group">
        {/* Gold glow behind card */}
        <div className="absolute -inset-1 bg-gradient-to-b from-[#D4AF37]/10 via-transparent to-[#D4AF37]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 shadow-2xl shadow-black/20">
          <form action={action} className="space-y-5">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            {state.error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 backdrop-blur-sm">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70 text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  required
                  autoComplete="email"
                  className="pl-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#D4AF37]/40 focus:ring-[#D4AF37]/20 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/70 text-sm font-medium">Mot de passe</Label>
                <Link href="/forgot-password" className="text-xs text-white/30 hover:text-[#D4AF37] transition-colors duration-300">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pl-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#D4AF37]/40 focus:ring-[#D4AF37]/20 transition-all duration-300"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#D4AF37] hover:bg-[#F0D060] text-black font-semibold shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              size="lg"
              loading={isPending}
            >
              {isPending ? 'Connexion...' : 'Se Connecter'}
            </Button>
          </form>

          {/* Separator */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
            <span className="text-xs text-white/20 uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
          </div>

          {/* Demo accounts hint */}
          <div className="mt-5 rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
            <p className="text-[11px] text-white/30 text-center leading-relaxed">
              Comptes demo : <span className="text-[#D4AF37]/60">admin@lumiere.film</span> / Admin1234!
              <br />
              <span className="text-[#D4AF37]/60">contributeur@lumiere.film</span> / Test1234!
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-white/40">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-[#D4AF37] hover:text-[#F0D060] transition-colors duration-300 font-medium">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
