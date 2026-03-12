'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  UserCircle,
  Sparkles,
  Plus,
  Search,
  Camera,
  Upload,
  Wand2,
  Star,
  Lock,
  Check,
  ChevronRight,
  ArrowRight,
  Users,
  Heart,
  Mic,
  UserPlus,
} from 'lucide-react'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { cn } from '@/lib/utils'

/* ── Data ── */

const AI_ACTORS = [
  { id: 1, name: 'Marcus Kane', style: 'Dramatic', gender: 'Male', age: '30-40', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.9 },
  { id: 2, name: 'Elena Vasquez', style: 'Comedy', gender: 'Female', age: '25-35', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.8 },
  { id: 3, name: 'James Alderton', style: 'Action', gender: 'Male', age: '35-45', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.7 },
  { id: 4, name: 'Sophia Ren', style: 'Dramatic', gender: 'Female', age: '20-30', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.9 },
  { id: 5, name: 'Ethan Cross', style: 'Action', gender: 'Male', age: '25-35', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.6 },
  { id: 6, name: 'Ava Mitchell', style: 'Comedy', gender: 'Female', age: '30-40', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.8 },
  { id: 7, name: 'Daniel Reyes', style: 'Dramatic', gender: 'Male', age: '40-50', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.5 },
  { id: 8, name: 'Clara Dubois', style: 'Action', gender: 'Female', age: '25-35', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=400&q=80', rating: 4.7 },
]

const STYLE_OPTIONS = ['All', 'Dramatic', 'Comedy', 'Action'] as const
const GENDER_OPTIONS = ['All', 'Male', 'Female'] as const
const AGE_OPTIONS = ['All', '20-30', '25-35', '30-40', '35-45', '40-50'] as const
const CHARACTER_STYLES = ['Realistic', 'Stylized', 'Animated'] as const
const ROLE_OPTIONS = ['Lead', 'Supporting', 'Cameo'] as const

type CastMember = {
  id: number
  name: string
  characterName: string
  role: (typeof ROLE_OPTIONS)[number]
  image: string
}

type Tab = 'browse' | 'create' | 'yourself'

/* ── Component ── */

export default function CastingPage() {
  const { completedSteps, markComplete, loaded } = useCreateProgress()

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>('browse')

  // Browse tab state
  const [searchQuery, setSearchQuery] = useState('')
  const [styleFilter, setStyleFilter] = useState<string>('All')
  const [genderFilter, setGenderFilter] = useState<string>('All')
  const [ageFilter, setAgeFilter] = useState<string>('All')

  // Create tab state
  const [charName, setCharName] = useState('')
  const [charAge, setCharAge] = useState('')
  const [charTraits, setCharTraits] = useState('')
  const [charAppearance, setCharAppearance] = useState('')
  const [charStyle, setCharStyle] = useState<(typeof CHARACTER_STYLES)[number]>('Realistic')

  // Insert yourself tab state
  const [isDragging, setIsDragging] = useState(false)

  // Cast list
  const [castList, setCastList] = useState<CastMember[]>([])

  // Lock check
  const isLocked = !loaded || !isStepUnlocked('casting')

  function isStepUnlocked(stepId: string) {
    const idx = CREATE_STEPS.findIndex((s) => s.id === stepId)
    if (idx === 0) return true
    for (let i = 0; i < idx; i++) {
      if (!completedSteps.includes(CREATE_STEPS[i].id)) return false
    }
    return true
  }

  // Filter actors
  const filteredActors = AI_ACTORS.filter((actor) => {
    if (searchQuery && !actor.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (styleFilter !== 'All' && actor.style !== styleFilter) return false
    if (genderFilter !== 'All' && actor.gender !== genderFilter) return false
    if (ageFilter !== 'All' && actor.age !== ageFilter) return false
    return true
  })

  function castActor(actor: (typeof AI_ACTORS)[0]) {
    if (castList.find((c) => c.id === actor.id)) return
    setCastList((prev) => [
      ...prev,
      { id: actor.id, name: actor.name, characterName: '', role: 'Supporting', image: actor.image },
    ])
  }

  function removeCast(id: number) {
    setCastList((prev) => prev.filter((c) => c.id !== id))
  }

  function updateCast(id: number, field: keyof CastMember, value: string) {
    setCastList((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  if (!loaded) return null

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: 'browse', label: 'Browse AI Actors', icon: Users },
    { id: 'create', label: 'Create Custom Character', icon: UserPlus },
    { id: 'yourself', label: 'Insert Yourself', icon: Camera },
  ]

  return (
    <CreateLayout
      currentStepId="casting"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('casting')}
    >
      {/* ── Hero ── */}
      <section className="relative text-center mb-12">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#E50914]/[0.04] blur-[100px]" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-5">
            <UserCircle className="h-7 w-7 text-[#E50914]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Cast Your <span className="text-[#E50914]">Characters</span>
          </h1>
          <p className="text-sm sm:text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            Build your dream cast. Browse AI actors, create custom characters from scratch, or insert yourself into your film.
          </p>
        </div>
      </section>

      {/* ── Tab Navigation ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !isLocked && setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border',
              activeTab === tab.id
                ? 'bg-[#E50914]/10 border-[#E50914]/30 text-[#E50914]'
                : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="relative">
        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 z-30 bg-[#0A0A0A]/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center p-8">
              <Lock className="h-10 w-10 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-sm">Complete previous steps to unlock casting</p>
            </div>
          </div>
        )}

        {/* ─── Browse AI Actors ─── */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search AI actors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Style filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/30">Style</span>
                  <div className="flex gap-1">
                    {STYLE_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStyleFilter(s)}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                          styleFilter === s
                            ? 'bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30'
                            : 'bg-white/[0.03] text-white/35 border border-white/[0.06] hover:text-white/50'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Gender filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/30">Gender</span>
                  <div className="flex gap-1">
                    {GENDER_OPTIONS.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGenderFilter(g)}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                          genderFilter === g
                            ? 'bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30'
                            : 'bg-white/[0.03] text-white/35 border border-white/[0.06] hover:text-white/50'
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Age filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/30">Age</span>
                  <div className="flex gap-1">
                    {AGE_OPTIONS.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAgeFilter(a)}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                          ageFilter === a
                            ? 'bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30'
                            : 'bg-white/[0.03] text-white/35 border border-white/[0.06] hover:text-white/50'
                        )}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actor Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredActors.map((actor) => {
                const alreadyCast = castList.some((c) => c.id === actor.id)
                return (
                  <div
                    key={actor.id}
                    className="group relative rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={actor.image}
                        alt={actor.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Rating */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] text-white/80 font-medium">{actor.rating}</span>
                      </div>

                      {/* Style badge */}
                      <div className="absolute top-2 left-2">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-medium border backdrop-blur-sm',
                          actor.style === 'Dramatic' && 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                          actor.style === 'Comedy' && 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                          actor.style === 'Action' && 'bg-red-500/20 text-red-300 border-red-500/30',
                        )}>
                          {actor.style}
                        </span>
                      </div>

                      {/* Bottom info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h4 className="text-sm font-semibold text-white mb-0.5">{actor.name}</h4>
                        <p className="text-[10px] text-white/50">{actor.gender} &middot; {actor.age}</p>
                      </div>
                    </div>

                    {/* Cast button */}
                    <div className="p-2.5">
                      <button
                        onClick={() => castActor(actor)}
                        disabled={alreadyCast}
                        className={cn(
                          'w-full py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5',
                          alreadyCast
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-[#E50914] text-white hover:bg-[#FF2D2D] hover:shadow-[0_0_16px_rgba(229,9,20,0.25)]'
                        )}
                      >
                        {alreadyCast ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Cast
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            Cast
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredActors.length === 0 && (
              <div className="text-center py-12 text-white/30 text-sm">
                No actors match your filters. Try adjusting your search.
              </div>
            )}

            {/* Browse all link */}
            <div className="text-center pt-2">
              <Link
                href="/actors"
                className="inline-flex items-center gap-2 text-sm text-[#E50914] hover:text-[#FF2D2D] transition-colors font-medium"
              >
                Browse all actors
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ─── Create Custom Character ─── */}
        {activeTab === 'create' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Form */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-[#E50914]" />
                Character Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">Character Name</label>
                  <input
                    type="text"
                    value={charName}
                    onChange={(e) => setCharName(e.target.value)}
                    placeholder="e.g. Detective Noir"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">Age</label>
                  <input
                    type="text"
                    value={charAge}
                    onChange={(e) => setCharAge(e.target.value)}
                    placeholder="e.g. 35"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">Personality Traits</label>
                  <input
                    type="text"
                    value={charTraits}
                    onChange={(e) => setCharTraits(e.target.value)}
                    placeholder="e.g. Brooding, intelligent, haunted by past"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">Appearance Description</label>
                  <textarea
                    value={charAppearance}
                    onChange={(e) => setCharAppearance(e.target.value)}
                    placeholder="Describe the character's physical appearance, clothing style, distinguishing features..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors resize-none"
                  />
                </div>

                {/* Style options */}
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-2">Visual Style</label>
                  <div className="flex gap-2">
                    {CHARACTER_STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => setCharStyle(style)}
                        className={cn(
                          'flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200',
                          charStyle === style
                            ? 'bg-[#E50914]/10 border-[#E50914]/30 text-[#E50914]'
                            : 'bg-white/[0.02] border-white/[0.06] text-white/35 hover:text-white/50'
                        )}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate button */}
              <button className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#E50914] hover:bg-[#FF2D2D] transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(229,9,20,0.3)]">
                <Sparkles className="h-4 w-4" />
                Generate Character
                <span className="text-[10px] ml-1 px-2 py-0.5 rounded-full bg-white/10">Included</span>
              </button>
            </div>

            {/* Preview area */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-24 h-24 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                  <UserCircle className="h-12 w-12 text-white/10" />
                </div>
                <h4 className="text-sm font-semibold text-white/50 mb-2">Character Preview</h4>
                <p className="text-xs text-white/25 max-w-[200px]">
                  Fill in the character details and click Generate to see your character appear here.
                </p>
                {charName && (
                  <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left">
                    <p className="text-xs text-white/30 mb-1">Preview summary</p>
                    <p className="text-sm text-white/70 font-medium">{charName}</p>
                    {charAge && <p className="text-xs text-white/40 mt-1">Age: {charAge}</p>}
                    {charTraits && <p className="text-xs text-white/40 mt-1">Traits: {charTraits}</p>}
                    <p className="text-[10px] text-white/20 mt-2">Style: {charStyle}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Insert Yourself ─── */}
        {activeTab === 'yourself' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upload zone */}
              <div className="space-y-5">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false) }}
                  className={cn(
                    'relative p-10 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] cursor-pointer',
                    isDragging
                      ? 'border-[#E50914]/50 bg-[#E50914]/5'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
                  )}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
                    <Upload className="h-7 w-7 text-white/25" />
                  </div>
                  <h4 className="text-sm font-semibold text-white/60 mb-1">Upload Your Photo</h4>
                  <p className="text-xs text-white/30 text-center max-w-[240px] mb-4">
                    Drag and drop a clear headshot, or click to browse. For best results, use a well-lit, front-facing photo.
                  </p>
                  <button className="px-5 py-2 rounded-lg text-xs font-semibold bg-white/[0.06] text-white/50 border border-white/[0.08] hover:bg-white/[0.1] transition-colors">
                    Choose File
                  </button>
                </div>

                {/* Face scan explanation */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Camera className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white/70 mb-1">AI Face Scanning</h4>
                      <p className="text-xs text-white/35 leading-relaxed">
                        Our AI will analyze your photo to create a realistic digital likeness. The scan captures facial structure, skin tone, and unique features to generate a consistent character model across all scenes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Voice recording */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <h4 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                    <Mic className="h-4 w-4 text-[#E50914]" />
                    Record Your Voice
                  </h4>
                  <p className="text-xs text-white/35 mb-4 leading-relaxed">
                    Record a short voice sample so the AI can clone your voice for dialogue. Read the sample text naturally for best results.
                  </p>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4">
                    <p className="text-xs text-white/25 italic leading-relaxed">
                      &ldquo;The rain fell softly on the empty streets. I turned up my collar and kept walking, knowing this night would change everything.&rdquo;
                    </p>
                  </div>
                  <button className="w-full py-3 rounded-xl text-sm font-semibold border border-[#E50914]/30 bg-[#E50914]/10 text-[#E50914] hover:bg-[#E50914]/20 transition-all duration-200 flex items-center justify-center gap-2">
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </button>
                </div>

                {/* Preview placeholder */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center min-h-[140px]">
                  <UserCircle className="h-10 w-10 text-white/10 mb-2" />
                  <p className="text-xs text-white/25 text-center">
                    Your AI likeness preview will appear here after uploading a photo.
                  </p>
                </div>

                {/* Disclaimer */}
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <p className="text-[11px] text-amber-400/60 leading-relaxed">
                    <strong className="text-amber-400/80">AI Likeness Rights:</strong> By uploading your photo and voice, you consent to the creation of an AI-generated likeness for use in your film. Your data is processed securely and never shared with third parties. You retain full ownership of your digital likeness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Cast List ── */}
      <section className="mt-12 relative">
        {isLocked && (
          <div className="absolute inset-0 z-30 bg-[#0A0A0A]/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center p-6">
              <Lock className="h-8 w-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-xs">Locked</p>
            </div>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-[#E50914]" />
              Your Cast
              {castList.length > 0 && (
                <span className="text-xs font-normal text-white/30 ml-1">({castList.length} member{castList.length !== 1 ? 's' : ''})</span>
              )}
            </h3>
          </div>

          {castList.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle className="h-12 w-12 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30 mb-1">No characters cast yet</p>
              <p className="text-xs text-white/20">Browse AI actors or create custom characters to build your cast.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {castList.map((member, idx) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors group"
                >
                  {/* Drag handle indicator */}
                  <div className="flex flex-col gap-0.5 text-white/15 cursor-grab">
                    <div className="w-4 h-0.5 bg-current rounded" />
                    <div className="w-4 h-0.5 bg-current rounded" />
                    <div className="w-4 h-0.5 bg-current rounded" />
                  </div>

                  {/* Photo */}
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>

                  {/* Name */}
                  <div className="min-w-[100px]">
                    <p className="text-sm font-medium text-white/80">{member.name}</p>
                  </div>

                  {/* Role select */}
                  <select
                    value={member.role}
                    onChange={(e) => updateCast(member.id, 'role', e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/60 focus:outline-none focus:border-[#E50914]/40 appearance-none cursor-pointer"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r} className="bg-[#1a1a1a]">{r}</option>
                    ))}
                  </select>

                  {/* Character name */}
                  <input
                    type="text"
                    value={member.characterName}
                    onChange={(e) => updateCast(member.id, 'characterName', e.target.value)}
                    placeholder="Character name..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/60 placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 transition-colors"
                  />

                  {/* Remove */}
                  <button
                    onClick={() => removeCast(member.id)}
                    className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from cast"
                  >
                    <Plus className="h-4 w-4 rotate-45" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Character Relationships ── */}
      <section className="mt-8 relative">
        {isLocked && (
          <div className="absolute inset-0 z-30 bg-[#0A0A0A]/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center p-6">
              <Lock className="h-8 w-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-xs">Locked</p>
            </div>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-5">
            <Heart className="h-5 w-5 text-[#E50914]" />
            Character Relationships
          </h3>

          {castList.length < 2 ? (
            <div className="text-center py-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-white/10" />
                </div>
                <div className="w-8 h-px bg-white/[0.06]" />
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-dashed border-white/[0.08] flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white/10" />
                </div>
              </div>
              <p className="text-sm text-white/30 mb-1">Add at least two characters</p>
              <p className="text-xs text-white/20">Cast multiple characters to define their relationships and dynamics.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {castList.map((a) =>
                castList
                  .filter((b) => b.id !== a.id)
                  .map((b) => {
                    // Only show each pair once
                    if (a.id > b.id) return null
                    return (
                      <div
                        key={`${a.id}-${b.id}`}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0">
                            <Image src={a.image} alt={a.name} fill className="object-cover" sizes="28px" />
                          </div>
                          <div className="w-4 h-px bg-white/[0.1]" />
                          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0">
                            <Image src={b.image} alt={b.name} fill className="object-cover" sizes="28px" />
                          </div>
                        </div>
                        <p className="text-[10px] text-white/40 truncate">{a.name} &amp; {b.name}</p>
                        <select className="mt-1.5 w-full px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/35 focus:outline-none appearance-none cursor-pointer">
                          <option className="bg-[#1a1a1a]">Define relationship...</option>
                          <option className="bg-[#1a1a1a]">Allies</option>
                          <option className="bg-[#1a1a1a]">Rivals</option>
                          <option className="bg-[#1a1a1a]">Lovers</option>
                          <option className="bg-[#1a1a1a]">Siblings</option>
                          <option className="bg-[#1a1a1a]">Mentor &amp; Student</option>
                          <option className="bg-[#1a1a1a]">Enemies</option>
                          <option className="bg-[#1a1a1a]">Strangers</option>
                        </select>
                      </div>
                    )
                  })
              )}
            </div>
          )}
        </div>
      </section>
    </CreateLayout>
  )
}
