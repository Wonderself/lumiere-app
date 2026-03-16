'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  User, Camera, Film, Music, Palette, PenTool, Scissors,
  Save, CheckCircle2, Circle, ArrowRight, Plus, X,
  Globe, Briefcase, Award, Star, Loader2,
} from 'lucide-react'

const SPECIALTIES = [
  { id: 'screenwriting', label: 'Scénariste', icon: PenTool },
  { id: 'directing', label: 'Réalisateur', icon: Film },
  { id: 'cinematography', label: 'Dir Photo', icon: Camera },
  { id: 'editing', label: 'Monteur', icon: Scissors },
  { id: 'music', label: 'Compositeur', icon: Music },
  { id: 'vfx', label: 'VFX Artist', icon: Palette },
  { id: 'acting', label: 'Acteur', icon: Star },
  { id: 'producing', label: 'Producteur', icon: Briefcase },
]

const ONBOARDING_STEPS = [
  { id: 'profile', label: 'Informations de base' },
  { id: 'specialties', label: 'Spécialités' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'bio', label: 'Bio & Présentation' },
]

export default function CreatorProfilePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)

  // Form state
  const [displayName, setDisplayName] = useState('')
  const [email] = useState('user@example.com')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([''])
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [experience, setExperience] = useState('beginner')

  function toggleSpecialty(id: string) {
    setSelectedSpecialties(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  function addPortfolioLink() {
    setPortfolioLinks(prev => [...prev, ''])
  }

  function updatePortfolioLink(index: number, value: string) {
    setPortfolioLinks(prev => prev.map((l, i) => i === index ? value : l))
  }

  function removePortfolioLink(index: number) {
    setPortfolioLinks(prev => prev.filter((_, i) => i !== index))
  }

  async function saveProfile() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1500))
    setSaving(false)
    toast.success('Profil sauvegardé')
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">Profil Créateur</h1>
        <p className="text-sm text-gray-500 mt-1">Complétez votre profil pour maximiser votre visibilité</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {ONBOARDING_STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setCurrentStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full ${
                i === currentStep ? 'bg-[#E50914] text-white' :
                i < currentStep ? 'bg-green-50 text-green-600' :
                'bg-gray-100 text-gray-500'
              }`}
            >
              {i < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
              {step.label}
            </button>
            {i < ONBOARDING_STEPS.length - 1 && <ArrowRight className="h-4 w-4 text-gray-500 shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        {currentStep === 0 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-[#1A1A2E]">Informations de base</h2>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Nom d&apos;affichage</label>
              <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Votre nom de créateur" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Localisation</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Paris, France" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Site web</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Expérience</label>
              <select value={experience} onChange={e => setExperience(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm">
                <option value="beginner">Débutant (0-2 ans)</option>
                <option value="intermediate">Intermédiaire (2-5 ans)</option>
                <option value="advanced">Avancé (5-10 ans)</option>
                <option value="expert">Expert (10+ ans)</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-[#1A1A2E]">Spécialités</h2>
            <p className="text-xs text-gray-500">Sélectionnez vos domaines d&apos;expertise (plusieurs possibles)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SPECIALTIES.map(s => {
                const SIcon = s.icon
                const selected = selectedSpecialties.includes(s.id)
                return (
                  <button key={s.id} onClick={() => toggleSpecialty(s.id)} className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${selected ? 'border-[#E50914] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <SIcon className={`h-6 w-6 ${selected ? 'text-[#E50914]' : 'text-gray-500'}`} />
                    <span className={`text-xs font-medium ${selected ? 'text-[#E50914]' : 'text-gray-600'}`}>{s.label}</span>
                    {selected && <CheckCircle2 className="h-3.5 w-3.5 text-[#E50914]" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-[#1A1A2E]">Portfolio</h2>
            <p className="text-xs text-gray-500">Ajoutez des liens vers vos travaux (Vimeo, YouTube, Behance, etc.)</p>
            {portfolioLinks.map((link, i) => (
              <div key={i} className="flex gap-2">
                <input value={link} onChange={e => updatePortfolioLink(i, e.target.value)} placeholder="https://..." className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
                {portfolioLinks.length > 1 && (
                  <button onClick={() => removePortfolioLink(i)} className="text-gray-500 hover:text-red-400"><X className="h-5 w-5" /></button>
                )}
              </div>
            ))}
            <button onClick={addPortfolioLink} className="flex items-center gap-1.5 text-sm text-[#E50914] hover:underline"><Plus className="h-4 w-4" /> Ajouter un lien</button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-[#1A1A2E]">Bio & Présentation</h2>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Parlez de vous, de vos projets, de votre vision du cinéma..." rows={8} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#E50914] focus:outline-none resize-none" />
            <p className="text-[10px] text-gray-500">{bio.length}/1000 caractères</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="px-4 py-2 text-sm text-gray-500 hover:text-[#1A1A2E] disabled:opacity-30">Précédent</button>
          <div className="flex gap-2">
            {currentStep < ONBOARDING_STEPS.length - 1 ? (
              <button onClick={() => setCurrentStep(currentStep + 1)} className="px-6 py-2 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-medium rounded-lg transition-colors">Suivant</button>
            ) : (
              <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Sauvegarder
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
