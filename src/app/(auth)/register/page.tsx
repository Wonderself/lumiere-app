'use client'

import { useActionState, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { registerAction } from '@/app/actions/auth'
import { SKILLS, LANGUAGES } from '@/lib/constants'
import { CheckCircle, UserPlus, User, Mail, Lock, Link2, Briefcase } from 'lucide-react'

const VALID_ROLES = ['CONTRIBUTOR', 'ARTIST', 'STUNT_PERFORMER', 'SCREENWRITER', 'VIEWER']

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, action, isPending] = useActionState(registerAction, {})
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Français'])

  // Auto-select role from URL param (e.g. ?role=SCREENWRITER)
  const urlRole = searchParams.get('role')?.toUpperCase() || ''
  const [role, setRole] = useState(VALID_ROLES.includes(urlRole) ? urlRole : 'CONTRIBUTOR')

  useEffect(() => {
    if (state.success) {
      setTimeout(() => router.push('/login?registered=1'), 2000)
    }
  }, [state.success, router])

  if (state.success) {
    return (
      <div className="text-center space-y-5 sm:rounded-3xl rounded-2xl border border-green-500/20 bg-green-500/[0.05] backdrop-blur-sm p-10 sm:p-12 shadow-2xl shadow-green-500/5">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Compte créé !</h2>
        <p className="text-white/50 leading-relaxed">
          Votre compte est en attente de validation par notre équipe. Vous recevrez un email dès que votre compte sera activé.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-white/30">
          <div className="w-4 h-4 border-2 border-white/20 border-t-[#D4AF37] rounded-full animate-spin" />
          Redirection vers la connexion...
        </div>
      </div>
    )
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-2">
          <UserPlus className="h-8 w-8 text-[#D4AF37]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
          <span className="text-shimmer">{role === 'SCREENWRITER' ? 'Devenez Scenariste' : 'Rejoindre Lumière'}</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base">
          {role === 'SCREENWRITER'
            ? 'Rejoignez nos 100 scenaristes et participez a la creation du cinema de demain.'
            : 'Créez votre compte et commencez à contribuer.'}
        </p>
      </div>

      {/* Form Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-b from-[#D4AF37]/10 via-transparent to-[#D4AF37]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 shadow-2xl shadow-black/20">
          <form action={action} className="space-y-6">
            {/* Hidden fields for arrays */}
            {selectedSkills.map((skill) => (
              <input key={skill} type="hidden" name="skills" value={skill} />
            ))}
            {selectedLanguages.map((lang) => (
              <input key={lang} type="hidden" name="languages" value={lang} />
            ))}
            <input type="hidden" name="role" value={role} />

            {state.error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 backdrop-blur-sm">
                {state.error}
              </div>
            )}

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-white/70 text-sm font-medium">Nom / Pseudo</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <Input
                    id="displayName"
                    name="displayName"
                    placeholder="Jean Dupont"
                    required
                    minLength={2}
                    className="pl-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#D4AF37]/40 focus:ring-[#D4AF37]/20 transition-all duration-300"
                  />
                </div>
              </div>
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
                    className="pl-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#D4AF37]/40 focus:ring-[#D4AF37]/20 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70 text-sm font-medium">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 caractères"
                  required
                  minLength={8}
                  className="pl-11 h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#D4AF37]/40 focus:ring-[#D4AF37]/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Role */}
            <div className="space-y-2">
              <Label className="text-white/70 text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-[#D4AF37]/60" />
                Rôle souhaité
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white focus:border-[#D4AF37]/40 focus:ring-[#D4AF37]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONTRIBUTOR">Contributeur Créatif</SelectItem>
                  <SelectItem value="ARTIST">Artiste / Directeur Artistique</SelectItem>
                  <SelectItem value="STUNT_PERFORMER">Cascadeur / Performer</SelectItem>
                  <SelectItem value="SCREENWRITER">Scénariste</SelectItem>
                  <SelectItem value="VIEWER">Spectateur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Portfolio URL */}
            <div className="space-y-2">
              <Label htmlFor="portfolioUrl" className="text-white/70 text-sm font-medium flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5 text-[#D4AF37]/60" />
                Portfolio URL <span className="text-white/25">(optionnel)</span>
              </Label>
              <Input
                id="portfolioUrl"
                name="portfolioUrl"
                type="url"
                placeholder="https://votre-portfolio.com"
                className="h-12 rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#D4AF37]/40 focus:ring-[#D4AF37]/20 transition-all duration-300"
              />
            </div>

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Skills */}
            <div className="space-y-3">
              <Label className="text-white/70 text-sm font-medium">
                Compétences <span className="text-[#D4AF37]/60">({selectedSkills.length})</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-300 ${
                      selectedSkills.includes(skill)
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37] shadow-sm shadow-[#D4AF37]/10 scale-[1.02]'
                        : 'bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/15 hover:text-white/60 hover:bg-white/[0.05]'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-3">
              <Label className="text-white/70 text-sm font-medium">Langues maîtrisées</Label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-300 ${
                      selectedLanguages.includes(lang)
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37] shadow-sm shadow-[#D4AF37]/10 scale-[1.02]'
                        : 'bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/15 hover:text-white/60 hover:bg-white/[0.05]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#D4AF37] hover:bg-[#F0D060] text-black font-semibold shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              size="lg"
              loading={isPending}
            >
              {isPending ? 'Création du compte...' : 'Créer mon Compte'}
            </Button>

            <p className="text-xs text-white/25 text-center leading-relaxed">
              En créant un compte, vous acceptez nos{' '}
              <Link href="/legal/terms" className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors duration-300">CGU</Link>
              {' '}et notre{' '}
              <Link href="/legal/privacy" className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors duration-300">politique de confidentialité</Link>.
            </p>
          </form>
        </div>
      </div>

      <p className="text-center text-sm text-white/40">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-[#D4AF37] hover:text-[#F0D060] transition-colors duration-300 font-medium">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
