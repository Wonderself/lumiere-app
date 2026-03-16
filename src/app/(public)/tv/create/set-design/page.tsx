'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Palette,
  Sun,
  Moon,
  Lamp,
  Snowflake,
  LayoutGrid,
  Monitor,
  ImageIcon,
  Columns,
  Square,
  Layers,
  Armchair,
  Mountain,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Constants ── */
const STEPS = [
  { num: 1, label: 'Concept', href: '/tv/create/concept' },
  { num: 2, label: 'Script', href: '/tv/create/script' },
  { num: 3, label: 'Set Design', href: '/tv/create/set-design' },
  { num: 4, label: 'Casting', href: '/tv/create/casting' },
  { num: 5, label: 'Record', href: '/tv/create/record' },
  { num: 6, label: 'Edit', href: '/tv/create/editing' },
  { num: 7, label: 'Broadcast', href: '/tv/create/broadcast' },
]

const LOCATIONS = [
  { id: 'studio-a', name: 'Studio A - Main Stage', desc: 'Large open studio with audience seating', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=250&fit=crop' },
  { id: 'studio-b', name: 'Studio B - Intimate', desc: 'Smaller studio for interviews and close-ups', img: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=250&fit=crop' },
  { id: 'newsroom', name: 'Newsroom Set', desc: 'Professional news desk with screens', img: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400&h=250&fit=crop' },
  { id: 'living-room', name: 'Living Room Set', desc: 'Cozy domestic interior for sitcoms', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop' },
  { id: 'outdoor', name: 'Outdoor Location', desc: 'Natural environment for reality and documentary', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=250&fit=crop' },
  { id: 'sci-fi', name: 'Sci-Fi Set', desc: 'Futuristic set with LED walls and neon', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop' },
]

const LIGHTING_PRESETS = [
  { id: 'studio-bright', name: 'Studio Bright', icon: Sun, desc: 'Even, high-key lighting for talk shows', color: 'from-yellow-400 to-amber-300' },
  { id: 'noir', name: 'Noir', icon: Moon, desc: 'High contrast shadows for drama', color: 'from-gray-600 to-gray-800' },
  { id: 'warm', name: 'Warm', icon: Lamp, desc: 'Golden tones for cozy atmospheres', color: 'from-orange-400 to-amber-500' },
  { id: 'cool-blue', name: 'Cool Blue', icon: Snowflake, desc: 'Blue-tinted modern aesthetic', color: 'from-blue-500 to-cyan-400' },
]

const SET_ELEMENTS = [
  { id: 'desk', label: 'Anchor Desk', icon: Monitor },
  { id: 'couch', label: 'Interview Couch', icon: Armchair },
  { id: 'screens', label: 'LED Screens', icon: Columns },
  { id: 'backdrop', label: 'Backdrop Wall', icon: Square },
  { id: 'stage', label: 'Performance Stage', icon: Layers },
  { id: 'props', label: 'Prop Table', icon: LayoutGrid },
  { id: 'greenscreen', label: 'Green Screen', icon: ImageIcon },
  { id: 'scenic', label: 'Scenic Elements', icon: Mountain },
]

const BACKGROUNDS = [
  { id: 'cityscape', name: 'Cityscape', img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200&h=120&fit=crop' },
  { id: 'abstract', name: 'Abstract Neon', img: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=200&h=120&fit=crop' },
  { id: 'nature', name: 'Nature', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=120&fit=crop' },
  { id: 'gradient', name: 'Blue Gradient', img: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=200&h=120&fit=crop' },
  { id: 'space', name: 'Space', img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=120&fit=crop' },
  { id: 'studio-wall', name: 'Brick Wall', img: 'https://images.unsplash.com/photo-1595514535215-95b956e8d928?w=200&h=120&fit=crop' },
]

const MOOD_COLORS = [
  { id: 'electric-blue', label: 'Electric Blue', hex: '#2563EB' },
  { id: 'deep-purple', label: 'Deep Purple', hex: '#7C3AED' },
  { id: 'sunset-gold', label: 'Sunset Gold', hex: '#F59E0B' },
  { id: 'emerald', label: 'Emerald', hex: '#10B981' },
  { id: 'crimson', label: 'Crimson', hex: '#EF4444' },
  { id: 'arctic-white', label: 'Arctic White', hex: '#F8FAFC' },
]

const FAQS = [
  { q: 'Can I use multiple locations in one show?', a: 'Yes! Many shows use multiple sets. Select your primary location here and you can add secondary locations during the recording step.' },
  { q: 'What lighting preset works best for my format?', a: 'Talk shows and game shows work well with Studio Bright. Dramas benefit from Noir or Warm. Cool Blue is great for tech-focused or modern shows.' },
  { q: 'Can I customize set elements later?', a: 'Absolutely. The set design is saved and can be modified at any point. Think of this as your initial blueprint.' },
]

export default function TvSetDesignPage() {
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedLighting, setSelectedLighting] = useState('')
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [selectedBackground, setSelectedBackground] = useState('')
  const [selectedMoodColors, setSelectedMoodColors] = useState<string[]>([])
  const [layoutMode, setLayoutMode] = useState<'single' | 'split' | 'multi'>('single')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleElement = (id: string) => {
    setSelectedElements(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const toggleMoodColor = (id: string) => {
    setSelectedMoodColors(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-[#050A15]">
      {/* ── Hero ── */}
      <section className="relative pt-12 pb-10 md:pt-20 md:pb-14 px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#2563EB]/[0.04] blur-[100px]" />
        </div>

        <div className="relative">
          <Link href="/tv/create" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors mb-6">
            <ChevronRight className="h-3 w-3 rotate-180" />
            Back to TV Create Hub
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-white/50 mb-6 ml-4">
            <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" />
            Step 3 of 7
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center">
              <Palette className="h-6 w-6 text-[#2563EB]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Design Your <span className="text-[#2563EB]">TV Set</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
            Build your studio environment. Choose locations, lighting, set elements, and backgrounds to create the perfect visual world for your show.
          </p>
        </div>
      </section>

      <div className="px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Main Content ── */}
          <div className="lg:col-span-3 space-y-8">
            {/* Location Cards */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Studio Location</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {LOCATIONS.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc.id)}
                    className={cn(
                      'rounded-2xl border overflow-hidden text-left transition-all duration-300 group',
                      selectedLocation === loc.id
                        ? 'border-[#2563EB]/50 ring-1 ring-[#2563EB]/30'
                        : 'border-white/[0.06] hover:border-white/[0.15]'
                    )}
                  >
                    <div className="relative w-full h-36 overflow-hidden">
                      <Image src={loc.img} alt={loc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      {selectedLocation === loc.id && (
                        <div className="absolute inset-0 bg-[#2563EB]/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className={cn('text-sm font-bold mb-0.5 transition-colors', selectedLocation === loc.id ? 'text-[#2563EB]' : 'text-white/70')}>
                        {loc.name}
                      </h3>
                      <p className="text-[10px] text-white/30">{loc.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Studio Layout Builder */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Studio Layout</h2>
              <div className="flex gap-3 mb-5">
                {(['single', 'split', 'multi'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setLayoutMode(mode)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-xs font-medium border transition-all duration-300',
                      layoutMode === mode
                        ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.12] text-[#2563EB]'
                        : 'border-white/[0.08] text-white/40 hover:text-white/60'
                    )}
                  >
                    {mode === 'single' ? 'Single Camera' : mode === 'split' ? 'Split Stage' : 'Multi-Zone'}
                  </button>
                ))}
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#2563EB]/[0.02] to-transparent" />
                {layoutMode === 'single' && (
                  <div className="w-2/3 h-2/3 border-2 border-dashed border-[#2563EB]/30 rounded-xl flex items-center justify-center">
                    <span className="text-xs text-white/30">Main Stage Area</span>
                  </div>
                )}
                {layoutMode === 'split' && (
                  <div className="flex gap-4 w-5/6 h-2/3">
                    <div className="flex-1 border-2 border-dashed border-[#2563EB]/30 rounded-xl flex items-center justify-center">
                      <span className="text-xs text-white/30">Stage Left</span>
                    </div>
                    <div className="flex-1 border-2 border-dashed border-[#2563EB]/30 rounded-xl flex items-center justify-center">
                      <span className="text-xs text-white/30">Stage Right</span>
                    </div>
                  </div>
                )}
                {layoutMode === 'multi' && (
                  <div className="grid grid-cols-3 grid-rows-2 gap-2 w-5/6 h-5/6">
                    {['Main', 'Interview', 'Performance', 'Audience', 'Tech', 'Green Room'].map(zone => (
                      <div key={zone} className="border-2 border-dashed border-[#2563EB]/20 rounded-lg flex items-center justify-center">
                        <span className="text-[9px] text-white/25">{zone}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lighting Presets */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Lighting Preset</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {LIGHTING_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedLighting(preset.id)}
                    className={cn(
                      'rounded-2xl border p-4 text-left transition-all duration-300',
                      selectedLighting === preset.id
                        ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                    )}
                  >
                    <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3', preset.color)}>
                      <preset.icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className={cn('text-sm font-bold mb-1', selectedLighting === preset.id ? 'text-[#2563EB]' : 'text-white/70')}>
                      {preset.name}
                    </h3>
                    <p className="text-[10px] text-white/30">{preset.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Set Elements Grid */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">Set Elements</h2>
                <span className="text-[10px] text-white/25">{selectedElements.length} selected</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SET_ELEMENTS.map(el => (
                  <button
                    key={el.id}
                    onClick={() => toggleElement(el.id)}
                    className={cn(
                      'rounded-xl border p-4 flex flex-col items-center gap-2 transition-all duration-300',
                      selectedElements.includes(el.id)
                        ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                    )}
                  >
                    <el.icon className={cn('h-5 w-5', selectedElements.includes(el.id) ? 'text-[#2563EB]' : 'text-white/30')} />
                    <span className={cn('text-xs font-medium text-center', selectedElements.includes(el.id) ? 'text-white/80' : 'text-white/40')}>
                      {el.label}
                    </span>
                    {selectedElements.includes(el.id) && <Check className="h-3 w-3 text-[#2563EB]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Selector */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Background</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {BACKGROUNDS.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg.id)}
                    className={cn(
                      'rounded-xl border overflow-hidden transition-all duration-300',
                      selectedBackground === bg.id
                        ? 'border-[#2563EB]/50 ring-1 ring-[#2563EB]/30'
                        : 'border-white/[0.06] hover:border-white/[0.15]'
                    )}
                  >
                    <div className="relative w-full aspect-[5/3] overflow-hidden">
                      <Image src={bg.img} alt={bg.name} fill className="object-cover" />
                      {selectedBackground === bg.id && (
                        <div className="absolute inset-0 bg-[#2563EB]/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-[9px] text-white/40 text-center py-1.5">{bg.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Board Colors */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Mood Board - Color Palette</h2>
              <div className="flex flex-wrap gap-3">
                {MOOD_COLORS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => toggleMoodColor(c.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300',
                      selectedMoodColors.includes(c.id)
                        ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08]'
                        : 'border-white/[0.06] hover:border-white/[0.15]'
                    )}
                  >
                    <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: c.hex }} />
                    <span className="text-xs font-medium text-white/60">{c.label}</span>
                    {selectedMoodColors.includes(c.id) && <Check className="h-3 w-3 text-[#2563EB]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Link href="/tv/create/script" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Previous Step
              </Link>
              <Link
                href="/tv/create/casting"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
              >
                Next Step: Casting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* FAQ */}
            <section className="mt-12">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                      <span className="text-sm font-medium text-white/70">{faq.q}</span>
                      <ChevronDown className={cn('h-4 w-4 text-white/30 transition-transform shrink-0 ml-4', openFaq === i && 'rotate-180')} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5"><p className="text-xs text-white/40 leading-relaxed">{faq.a}</p></div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">Creation Progress</h3>
              <div className="space-y-2">
                {STEPS.map(step => (
                  <Link
                    key={step.num}
                    href={step.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                      step.num === 3 ? 'bg-[#2563EB]/[0.12] border border-[#2563EB]/30' : 'hover:bg-white/[0.03]'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      step.num === 3 ? 'bg-[#2563EB] text-white' : step.num < 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-white/30'
                    )}>
                      {step.num < 3 ? <Check className="h-3 w-3" /> : step.num}
                    </div>
                    <span className={cn('text-xs font-medium', step.num === 3 ? 'text-[#2563EB]' : step.num < 3 ? 'text-emerald-400/60' : 'text-white/30')}>
                      {step.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Set Summary */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Set Summary</h3>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Location</span>
                  <span className="text-white/70">{selectedLocation ? LOCATIONS.find(l => l.id === selectedLocation)?.name.split(' - ')[0] : 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Lighting</span>
                  <span className="text-white/70">{selectedLighting ? LIGHTING_PRESETS.find(l => l.id === selectedLighting)?.name : 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Layout</span>
                  <span className="text-white/70 capitalize">{layoutMode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Elements</span>
                  <span className="text-white/70">{selectedElements.length} items</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
