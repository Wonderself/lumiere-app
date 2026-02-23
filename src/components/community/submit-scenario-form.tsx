'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
import { submitScenarioAction } from '@/app/actions/community'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PenTool, ChevronDown, ChevronUp, CheckCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const GENRES = [
  'Science-Fiction',
  'Drame',
  'Thriller',
  'Comedie',
  'Horreur',
  'Action',
  'Romance',
  'Fantastique',
  'Animation',
  'Documentaire',
  'Experimental',
]

export function SubmitScenarioForm() {
  const [state, formAction, isPending] = useActionState(submitScenarioAction, null)
  const [isOpen, setIsOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset()
      // Keep the form open for a moment to show success, then collapse
      setTimeout(() => setIsOpen(false), 2500)
    }
  }, [state?.success])

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
            <PenTool className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">Proposer un scenario</h3>
            <p className="text-sm text-white/40">Soumettez votre idee de film a la communaute</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-white/40" />
        ) : (
          <ChevronDown className="h-5 w-5 text-white/40" />
        )}
      </button>

      {/* Form */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-500',
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-white/5 pt-5">
            {/* Success message */}
            {state?.success && (
              <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-400">Proposition soumise avec succes !</p>
                  <p className="text-xs text-green-400/60 mt-0.5">Elle sera examinee par notre equipe.</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {state?.error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {state.error}
              </div>
            )}

            <form ref={formRef} action={formAction} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">
                  Titre du scenario *
                </label>
                <Input
                  name="title"
                  required
                  minLength={5}
                  maxLength={200}
                  placeholder="Ex: Les Echos du Silence"
                  className="bg-white/[0.03] border-white/10 focus:border-[#D4AF37]/40"
                />
              </div>

              {/* Logline */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">
                  Logline * <span className="text-white/30">(10-500 caracteres)</span>
                </label>
                <Textarea
                  name="logline"
                  required
                  minLength={10}
                  maxLength={500}
                  rows={2}
                  placeholder="Un resume accrocheur de votre histoire en une ou deux phrases..."
                  className="bg-white/[0.03] border-white/10 focus:border-[#D4AF37]/40"
                />
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">
                  Synopsis <span className="text-white/30">(optionnel)</span>
                </label>
                <Textarea
                  name="synopsis"
                  rows={5}
                  placeholder="Developpez votre histoire plus en detail..."
                  className="bg-white/[0.03] border-white/10 focus:border-[#D4AF37]/40"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">
                  Genre
                </label>
                <select
                  name="genre"
                  className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all duration-200"
                >
                  <option value="" className="bg-[#0A0A0A]">Choisir un genre...</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g} className="bg-[#0A0A0A]">{g}</option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  loading={isPending}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isPending ? 'Envoi en cours...' : 'Soumettre la proposition'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
