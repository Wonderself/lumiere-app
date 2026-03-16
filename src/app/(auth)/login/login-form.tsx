'use client'

import { useActionState, useRef, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction } from '@/app/actions/auth'
import type { LoginFormState } from '@/app/actions/auth'
import { signIn as nextAuthSignIn } from 'next-auth/react'
import { Mail, Lock, Sparkles, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

// Demo buttons always visible until production launch
const SHOW_DEMO = true

function sanitizeCallbackUrl(url: string | null): string {
  if (!url) return '/dashboard'
  if (url.startsWith('/') && !url.startsWith('//') && !url.includes('\\')) {
    return url
  }
  return '/dashboard'
}

export function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations('auth')
  const callbackUrl = sanitizeCallbackUrl(searchParams.get('callbackUrl'))
  const [state, action, isPending] = useActionState<LoginFormState, FormData>(loginAction, {})
  const formRef = useRef<HTMLFormElement>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Fallback redirect: if signIn's redirect() didn't propagate through the framework,
  // redirect via client-side router. This is a safety net for Next.js 16 compatibility.
  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo)
      router.refresh()
    }
  }, [state.redirectTo, router])

  const loginAsDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setTimeout(() => formRef.current?.requestSubmit(), 0)
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-4">
          <Sparkles className="h-8 w-8 text-[#E50914]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair">
          <span className="text-shimmer">{t('welcome')}</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base">{t('studio_subtitle')}</p>
      </div>

      {/* Form Card */}
      <div className="relative group">
        {/* Gold glow behind card */}
        <div className="absolute -inset-1 bg-gradient-to-b from-[#E50914]/10 via-transparent to-[#E50914]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-10 sm:p-12 shadow-2xl shadow-black/20">
          <form ref={formRef} action={action} className="space-y-8">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            {state.error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-400 backdrop-blur-sm">
                {state.error}
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-white/70 text-sm font-medium">{t('email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  autoComplete="email"
                  className="pl-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#E50914]/40 focus:ring-[#E50914]/20 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/70 text-sm font-medium">{t('password')}</Label>
                <Link href="/forgot-password" className="text-xs text-white/30 hover:text-[#E50914] transition-colors duration-300">
                  {t('forgot_password')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pl-11 pr-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#E50914]/40 focus:ring-[#E50914]/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                  aria-label={showPassword ? t('hide_password') : t('show_password')}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                size="lg"
                loading={isPending}
              >
                {isPending ? t('signing_in') : t('sign_in')}
              </Button>
            </div>
          </form>

          {/* Demo accounts — only visible in dev or when NEXT_PUBLIC_SHOW_DEMO=true */}
          {SHOW_DEMO && (
            <>
              <div className="mt-10 flex items-center gap-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
                <span className="text-xs text-white/20 uppercase tracking-widest">{t('demo_accounts')}</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
              </div>
              <div className="mt-5 space-y-3.5">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => loginAsDemo('admin@admin.com', 'adminadmin')}
                  className="w-full rounded-xl bg-[#E50914]/[0.06] border border-[#E50914]/15 hover:border-[#E50914]/30 hover:bg-[#E50914]/10 p-3.5 text-left transition-all duration-300 group cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#E50914]/80 group-hover:text-[#E50914]">Admin</p>
                      <p className="text-[11px] text-white/35 mt-0.5">admin@admin.com</p>
                    </div>
                    <span className="text-[10px] text-[#E50914]/40 group-hover:text-[#E50914]/70 uppercase tracking-wider font-medium">
                      {isPending ? t('signing_in') : t('quick_login')}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => loginAsDemo('admin@admin.com', 'adminadmin')}
                  className="w-full rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] p-3.5 text-left transition-all duration-300 group cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white/50 group-hover:text-white/70">Demo User</p>
                      <p className="text-[11px] text-white/25 mt-0.5">admin@admin.com</p>
                    </div>
                    <span className="text-[10px] text-white/20 group-hover:text-white/40 uppercase tracking-wider font-medium">
                      {isPending ? t('signing_in') : t('quick_login')}
                    </span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-sm text-white/40">
        {t('no_account_yet')}{' '}
        <Link href="/register" className="text-[#E50914] hover:text-[#FF2D2D] transition-colors duration-300 font-medium">
          {t('create_account')}
        </Link>
      </p>
    </div>
  )
}
