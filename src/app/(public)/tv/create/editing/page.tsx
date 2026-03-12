'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Scissors,
  Film,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Type,
  Palette,
  Layers,
  ImageIcon,
  Sliders,
  Music,
  Maximize,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
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

const TRANSITIONS = [
  { id: 'cut', label: 'Cut', desc: 'Instant switch between clips' },
  { id: 'fade', label: 'Fade', desc: 'Smooth fade to/from black' },
  { id: 'dissolve', label: 'Dissolve', desc: 'Cross-dissolve between clips' },
  { id: 'wipe', label: 'Wipe', desc: 'Directional wipe transition' },
  { id: 'zoom', label: 'Zoom', desc: 'Zoom in/out transition' },
  { id: 'slide', label: 'Slide', desc: 'Slide in from edge' },
]

const COLOR_PRESETS = [
  { id: 'standard', label: 'Standard', desc: 'Neutral broadcast look', colors: ['#FFFFFF', '#808080', '#000000'] },
  { id: 'cinematic', label: 'Cinematic', desc: 'Teal & orange film grade', colors: ['#2DD4BF', '#FB923C', '#1E1B4B'] },
  { id: 'noir', label: 'Noir', desc: 'High contrast B&W', colors: ['#E2E8F0', '#64748B', '#0F172A'] },
  { id: 'warm-vintage', label: 'Warm Vintage', desc: 'Faded warm tones', colors: ['#FDE68A', '#F97316', '#78350F'] },
  { id: 'cool-modern', label: 'Cool Modern', desc: 'Blue-tinted modern', colors: ['#93C5FD', '#2563EB', '#0C0A2A'] },
  { id: 'vibrant', label: 'Vibrant', desc: 'High saturation pop', colors: ['#F472B6', '#8B5CF6', '#06B6D4'] },
]

const LOWER_THIRDS_STYLES = [
  { id: 'minimal', label: 'Minimal', desc: 'Clean text on subtle bar' },
  { id: 'gradient', label: 'Gradient', desc: 'Blue gradient background' },
  { id: 'bold', label: 'Bold', desc: 'Full-width bold bar' },
  { id: 'outline', label: 'Outline', desc: 'Bordered transparent style' },
]

const TIMELINE_TRACKS = [
  { id: 'video', label: 'V1 - Video', color: 'bg-[#2563EB]', segments: [
    { start: 0, end: 25, label: 'Intro' },
    { start: 25, end: 55, label: 'Segment A' },
    { start: 55, end: 80, label: 'Segment B' },
    { start: 80, end: 100, label: 'Outro' },
  ]},
  { id: 'audio', label: 'A1 - Audio', color: 'bg-emerald-500', segments: [
    { start: 0, end: 100, label: 'Main Audio' },
  ]},
  { id: 'music', label: 'A2 - Music', color: 'bg-purple-500', segments: [
    { start: 0, end: 15, label: 'Intro Music' },
    { start: 80, end: 100, label: 'Outro Music' },
  ]},
  { id: 'graphics', label: 'GFX', color: 'bg-amber-500', segments: [
    { start: 0, end: 8, label: 'Title Card' },
    { start: 25, end: 30, label: 'Lower 3rd' },
    { start: 55, end: 60, label: 'Lower 3rd' },
  ]},
]

const FAQS = [
  { q: 'Can I undo my edits?', a: 'Yes, the editor supports unlimited undo/redo. Use the toolbar buttons or keyboard shortcuts to step back through your edit history.' },
  { q: 'What transitions work best for TV?', a: 'Cut is the standard for most TV editing. Use dissolves for mood transitions and fades for act breaks. Wipes are common in news and game shows.' },
  { q: 'How do lower thirds work?', a: 'Lower thirds are text overlays that appear in the bottom third of the screen, typically used to identify speakers, locations, or key information.' },
  { q: 'Can I add custom graphics?', a: 'Yes! The graphics overlay panel lets you add logos, titles, and custom images. Upload assets or use the built-in templates.' },
]

export default function TvEditingPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playheadPosition, setPlayheadPosition] = useState(15)
  const [selectedTransition, setSelectedTransition] = useState('cut')
  const [selectedColorPreset, setSelectedColorPreset] = useState('standard')
  const [selectedLowerThird, setSelectedLowerThird] = useState('minimal')
  const [lowerThirdName, setLowerThirdName] = useState('')
  const [lowerThirdTitle, setLowerThirdTitle] = useState('')
  const [zoomLevel, setZoomLevel] = useState(100)
  const [activePanel, setActivePanel] = useState<'transitions' | 'color' | 'graphics' | 'audio'>('transitions')
  const [masterVolume, setMasterVolume] = useState(80)
  const [musicVolume, setMusicVolume] = useState(50)
  const [sfxVolume, setSfxVolume] = useState(60)
  const [showGraphicsOverlay, setShowGraphicsOverlay] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
            Step 6 of 7
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center">
              <Scissors className="h-6 w-6 text-[#2563EB]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Edit Your <span className="text-[#2563EB]">Episodes</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
            Cut, trim, and polish your recordings. Add transitions, lower thirds, color grading, and audio mixing to create broadcast-ready content.
          </p>
        </div>
      </section>

      <div className="px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Main Content ── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Preview Window */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <div className="aspect-video relative bg-gradient-to-b from-[#0A1628] to-[#050A15] flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="h-16 w-16 text-white/[0.05]" />
                </div>

                {/* Color grade overlay */}
                <div className={cn(
                  'absolute inset-0 mix-blend-overlay opacity-20',
                  selectedColorPreset === 'cinematic' && 'bg-gradient-to-br from-teal-500/30 to-orange-500/30',
                  selectedColorPreset === 'noir' && 'bg-white/10 grayscale',
                  selectedColorPreset === 'warm-vintage' && 'bg-gradient-to-br from-amber-500/20 to-orange-600/20',
                  selectedColorPreset === 'cool-modern' && 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20',
                  selectedColorPreset === 'vibrant' && 'bg-gradient-to-br from-pink-500/20 to-cyan-500/20',
                )} />

                {/* Lower third preview */}
                {lowerThirdName && (
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className={cn(
                      'p-3 rounded-lg max-w-xs',
                      selectedLowerThird === 'minimal' && 'bg-black/60 backdrop-blur',
                      selectedLowerThird === 'gradient' && 'bg-gradient-to-r from-[#2563EB] to-[#2563EB]/60',
                      selectedLowerThird === 'bold' && 'bg-[#2563EB]',
                      selectedLowerThird === 'outline' && 'border-2 border-white/40 bg-black/30 backdrop-blur',
                    )}>
                      <p className="text-sm font-bold text-white">{lowerThirdName}</p>
                      {lowerThirdTitle && <p className="text-[10px] text-white/60">{lowerThirdTitle}</p>}
                    </div>
                  </div>
                )}

                {/* Graphics overlay */}
                {showGraphicsOverlay && (
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-lg bg-[#2563EB]/20 border border-[#2563EB]/30 flex items-center justify-center">
                    <span className="text-[8px] text-white/40">LOGO</span>
                  </div>
                )}

                {/* Playhead time */}
                <div className="absolute top-4 left-4 text-xs font-mono text-white/40">
                  {Math.floor(playheadPosition * 0.6).toString().padStart(2, '0')}:{(Math.round((playheadPosition * 0.6 % 1) * 60)).toString().padStart(2, '0')} / 01:00
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-3 p-4 border-t border-white/[0.06]">
                <button onClick={() => setPlayheadPosition(Math.max(0, playheadPosition - 5))} className="p-2 text-white/30 hover:text-white/60 transition-colors">
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white hover:bg-[#3B82F6] transition-all"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
                <button onClick={() => setPlayheadPosition(Math.min(100, playheadPosition + 5))} className="p-2 text-white/30 hover:text-white/60 transition-colors">
                  <SkipForward className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-white/[0.06] mx-2" />

                <button className="p-2 text-white/30 hover:text-white/60 transition-colors"><Undo2 className="h-4 w-4" /></button>
                <button className="p-2 text-white/30 hover:text-white/60 transition-colors"><Redo2 className="h-4 w-4" /></button>

                <div className="w-px h-6 bg-white/[0.06] mx-2" />

                <button onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))} className="p-2 text-white/30 hover:text-white/60 transition-colors"><ZoomOut className="h-4 w-4" /></button>
                <span className="text-[10px] text-white/30 w-10 text-center">{zoomLevel}%</span>
                <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))} className="p-2 text-white/30 hover:text-white/60 transition-colors"><ZoomIn className="h-4 w-4" /></button>

                <button onClick={() => setShowGraphicsOverlay(!showGraphicsOverlay)} className={cn('p-2 transition-colors', showGraphicsOverlay ? 'text-[#2563EB]' : 'text-white/30 hover:text-white/60')}>
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Timeline Editor */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Timeline</h2>

              {/* Playhead slider */}
              <div className="mb-4 relative">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={playheadPosition}
                  onChange={e => setPlayheadPosition(Number(e.target.value))}
                  className="w-full h-1 bg-white/[0.06] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2563EB]"
                />
              </div>

              {/* Tracks */}
              <div className="space-y-2">
                {TIMELINE_TRACKS.map(track => (
                  <div key={track.id} className="flex items-center gap-3">
                    <span className="text-[9px] text-white/30 font-mono w-16 shrink-0">{track.label}</span>
                    <div className="flex-1 h-8 bg-white/[0.02] rounded border border-white/[0.04] relative overflow-hidden">
                      {track.segments.map((seg, i) => (
                        <div
                          key={i}
                          className={cn('absolute top-1 bottom-1 rounded-sm flex items-center justify-center', track.color, 'bg-opacity-30')}
                          style={{ left: `${seg.start}%`, width: `${seg.end - seg.start}%` }}
                        >
                          <span className="text-[7px] text-white/50 truncate px-1">{seg.label}</span>
                        </div>
                      ))}
                      {/* Playhead line */}
                      <div className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: `${playheadPosition}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Cut/Trim tools */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/40 hover:text-white/70 transition-colors">
                  <Scissors className="h-3 w-3" /> Split
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/40 hover:text-white/70 transition-colors">
                  <Maximize className="h-3 w-3" /> Trim
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/40 hover:text-white/70 transition-colors">
                  <Layers className="h-3 w-3" /> Duplicate
                </button>
              </div>
            </div>

            {/* Editing Panels */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              {/* Panel Tabs */}
              <div className="flex border-b border-white/[0.06]">
                {([
                  { id: 'transitions' as const, label: 'Transitions', icon: Film },
                  { id: 'color' as const, label: 'Color Grading', icon: Palette },
                  { id: 'graphics' as const, label: 'Graphics', icon: Type },
                  { id: 'audio' as const, label: 'Audio', icon: Music },
                ]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePanel(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 text-xs font-medium transition-all border-b-2',
                      activePanel === tab.id
                        ? 'text-[#2563EB] border-[#2563EB]'
                        : 'text-white/30 border-transparent hover:text-white/50'
                    )}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Transitions */}
                {activePanel === 'transitions' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TRANSITIONS.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTransition(t.id)}
                        className={cn(
                          'rounded-xl border p-4 text-left transition-all duration-300',
                          selectedTransition === t.id
                            ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08]'
                            : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                        )}
                      >
                        <h3 className={cn('text-sm font-bold mb-1', selectedTransition === t.id ? 'text-[#2563EB]' : 'text-white/70')}>{t.label}</h3>
                        <p className="text-[10px] text-white/30">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Color Grading */}
                {activePanel === 'color' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {COLOR_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedColorPreset(preset.id)}
                        className={cn(
                          'rounded-xl border p-4 text-left transition-all duration-300',
                          selectedColorPreset === preset.id
                            ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08]'
                            : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                        )}
                      >
                        <div className="flex gap-1 mb-2">
                          {preset.colors.map((c, i) => (
                            <div key={i} className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <h3 className={cn('text-sm font-bold mb-0.5', selectedColorPreset === preset.id ? 'text-[#2563EB]' : 'text-white/70')}>{preset.label}</h3>
                        <p className="text-[10px] text-white/30">{preset.desc}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Graphics - Lower Thirds */}
                {activePanel === 'graphics' && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xs font-bold text-white/50 mb-3">Lower Third Style</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {LOWER_THIRDS_STYLES.map(style => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedLowerThird(style.id)}
                            className={cn(
                              'rounded-xl border p-3 text-left transition-all duration-300',
                              selectedLowerThird === style.id
                                ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08]'
                                : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                            )}
                          >
                            <h4 className={cn('text-xs font-bold mb-0.5', selectedLowerThird === style.id ? 'text-[#2563EB]' : 'text-white/60')}>{style.label}</h4>
                            <p className="text-[9px] text-white/25">{style.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-white/40 mb-1.5 block">Name</label>
                        <input
                          type="text"
                          value={lowerThirdName}
                          onChange={e => setLowerThirdName(e.target.value)}
                          placeholder="Speaker name..."
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 mb-1.5 block">Title</label>
                        <input
                          type="text"
                          value={lowerThirdTitle}
                          onChange={e => setLowerThirdTitle(e.target.value)}
                          placeholder="Role or title..."
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Audio Mixing */}
                {activePanel === 'audio' && (
                  <div className="space-y-5">
                    {[
                      { label: 'Master Volume', value: masterVolume, setter: setMasterVolume, icon: Volume2 },
                      { label: 'Background Music', value: musicVolume, setter: setMusicVolume, icon: Music },
                      { label: 'Sound Effects', value: sfxVolume, setter: setSfxVolume, icon: Sliders },
                    ].map(control => (
                      <div key={control.label} className="flex items-center gap-4">
                        <control.icon className="h-4 w-4 text-white/30 shrink-0" />
                        <span className="text-xs text-white/50 w-32 shrink-0">{control.label}</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={control.value}
                          onChange={e => control.setter(Number(e.target.value))}
                          className="flex-1 h-1 bg-white/[0.06] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2563EB]"
                        />
                        <span className="text-[10px] text-white/40 w-8 text-right">{control.value}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Link href="/tv/create/record" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Previous Step
              </Link>
              <Link
                href="/tv/create/broadcast"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
              >
                Next Step: Broadcast
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
                      step.num === 6 ? 'bg-[#2563EB]/[0.12] border border-[#2563EB]/30' : 'hover:bg-white/[0.03]'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      step.num === 6 ? 'bg-[#2563EB] text-white' : step.num < 6 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-white/30'
                    )}>
                      {step.num < 6 ? <Check className="h-3 w-3" /> : step.num}
                    </div>
                    <span className={cn('text-xs font-medium', step.num === 6 ? 'text-[#2563EB]' : step.num < 6 ? 'text-emerald-400/60' : 'text-white/30')}>
                      {step.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Edit Summary */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Edit Settings</h3>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Transition</span>
                  <span className="text-white/70 capitalize">{selectedTransition}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Color Grade</span>
                  <span className="text-white/70">{COLOR_PRESETS.find(p => p.id === selectedColorPreset)?.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Lower 3rd</span>
                  <span className="text-white/70 capitalize">{selectedLowerThird}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Master Vol</span>
                  <span className="text-white/70">{masterVolume}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Zoom</span>
                  <span className="text-white/70">{zoomLevel}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
