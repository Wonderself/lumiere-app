'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Video,
  Lock,
  Sparkles,
  Play,
  Trash2,
  RefreshCw,
  Film,
  Clock,
  Monitor,
  Gauge,
  ChevronDown,
  GripHorizontal,
  ArrowRight,
  Clapperboard,
  Loader2,
} from 'lucide-react'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { cn } from '@/lib/utils'

/* ── Data ── */

const DURATIONS = ['5s', '10s', '15s', '30s']
const RESOLUTIONS = ['720p', '1080p', '4K']
const FRAME_RATES = ['24fps', '30fps', '60fps']
const TRANSITIONS = ['Cut', 'Fade', 'Dissolve', 'Wipe']

const SCENES = [
  'Scene 1 - Opening',
  'Scene 2 - Discovery',
  'Scene 3 - Confrontation',
  'Scene 4 - Climax',
]

const PLACEHOLDER_CLIPS = [
  { id: 1, scene: 'Scene 1', duration: '10s', label: 'Opening wide shot' },
  { id: 2, scene: 'Scene 1', duration: '5s', label: 'Character close-up' },
  { id: 3, scene: 'Scene 2', duration: '15s', label: 'Forest tracking shot' },
  { id: 4, scene: 'Scene 3', duration: '10s', label: 'Interior confrontation' },
]

const GENERATION_STEPS = [
  'Analyzing scene description...',
  'Composing visual frames...',
  'Rendering motion data...',
  'Applying cinematic effects...',
  'Finalizing video clip...',
]

/* ── Helpers ── */

function LockOverlay() {
  return (
    <div className="absolute inset-0 z-30 bg-[#0A0A0A]/70 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center gap-3 cursor-not-allowed">
      <Lock className="h-8 w-8 text-white/20" />
      <p className="text-sm text-white/30 font-medium">Complete previous steps to unlock</p>
    </div>
  )
}

/* ── Page ── */

export default function VideosPage() {
  const { completedSteps, markComplete, isStepUnlocked, loaded } = useCreateProgress()
  const [selectedScene, setSelectedScene] = useState(SCENES[0])
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState('10s')
  const [resolution, setResolution] = useState('1080p')
  const [frameRate, setFrameRate] = useState('24fps')
  const [selectedTransitions, setSelectedTransitions] = useState<Record<number, string>>({
    0: 'Cut',
    1: 'Fade',
    2: 'Dissolve',
  })

  if (!loaded) return null

  const unlocked = isStepUnlocked('videos', CREATE_STEPS)

  return (
    <CreateLayout
      currentStepId="videos"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('videos')}
    >
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
          <Video className="h-8 w-8 text-[#E50914]" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Produce Your <span className="text-[#E50914]">Videos</span>
        </h1>
        <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
          Generate cinematic video clips, assemble them on a timeline, and craft seamless transitions between scenes.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="text-lg font-bold text-white/80 mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Clapperboard, title: 'Select Scenes', desc: 'Pick scenes from your storyboard and describe the motion you envision.' },
            { icon: Sparkles, title: 'Generate Clips', desc: 'AI produces video clips matching your cinematic descriptions and settings.' },
            { icon: Film, title: 'Assemble Sequence', desc: 'Arrange clips on the timeline with transitions to build your final cut.' },
          ].map((item) => (
            <div
              key={item.title}
              className="group p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-[#E50914]/10 flex items-center justify-center mb-3 group-hover:bg-[#E50914]/20 transition-colors">
                <item.icon className="h-5 w-5 text-[#E50914]" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ VIDEO GENERATION ═══ */}
      <section className="relative mb-16">
        {!unlocked && <LockOverlay />}
        <h2 className="text-lg font-bold text-white/80 mb-6">Video Generation</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: prompt + generate */}
          <div className="lg:col-span-2 space-y-4">
            {/* Scene selector */}
            <div>
              <label className="text-xs text-white/40 mb-2 block">Scene</label>
              <select
                value={selectedScene}
                onChange={(e) => setSelectedScene(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-[#E50914]/50 transition-colors appearance-none cursor-pointer"
              >
                {SCENES.map((s) => (
                  <option key={s} value={s} className="bg-[#1a1a1a]">{s}</option>
                ))}
              </select>
            </div>

            {/* Prompt */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video clip... e.g. Camera slowly dollies forward through a foggy forest, morning light breaking through the canopy, particles floating in the air"
              rows={5}
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/25 resize-none focus:outline-none focus:border-[#E50914]/40 transition-colors"
            />

            {/* Generate button */}
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] text-white text-sm font-semibold hover:bg-[#B20710] transition-colors">
              <Sparkles className="h-4 w-4" />
              Generate Video Clip
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px]">Included</span>
            </button>

            {/* Progress indicator */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-xs text-white/40 mb-3 font-medium">Generation Progress</p>
              <div className="space-y-2">
                {GENERATION_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                      i === 0
                        ? 'bg-[#E50914]/20 border border-[#E50914]/40'
                        : 'bg-white/[0.04] border border-white/[0.06]'
                    )}>
                      {i === 0 ? (
                        <Loader2 className="h-3 w-3 text-[#E50914] animate-spin" />
                      ) : (
                        <span className="text-[8px] text-white/20">{i + 1}</span>
                      )}
                    </div>
                    <span className={cn(
                      'text-xs',
                      i === 0 ? 'text-white/60' : 'text-white/20'
                    )}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full w-[20%] rounded-full bg-[#E50914] transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* Right: settings */}
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              {/* Duration */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-3.5 w-3.5 text-white/40" />
                  <label className="text-xs text-white/40">Duration</label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        duration === d
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="h-3.5 w-3.5 text-white/40" />
                  <label className="text-xs text-white/40">Resolution</label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {RESOLUTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setResolution(r)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        resolution === r
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Rate */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="h-3.5 w-3.5 text-white/40" />
                  <label className="text-xs text-white/40">Frame Rate</label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {FRAME_RATES.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFrameRate(f)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        frameRate === f
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CLIPS LIBRARY ═══ */}
      <section className="relative mb-16">
        {!unlocked && <LockOverlay />}
        <h2 className="text-lg font-bold text-white/80 mb-6">Clips Library</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLACEHOLDER_CLIPS.map((clip) => (
            <div
              key={clip.id}
              className="group rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-white/[0.01] flex items-center justify-center">
                <Video className="h-10 w-10 text-white/10" />
                {/* Play button */}
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#E50914]/90 flex items-center justify-center backdrop-blur-sm">
                    <Play className="h-5 w-5 text-white ml-0.5" />
                  </div>
                </button>
                {/* Duration badge */}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white/80 font-medium backdrop-blur-sm">
                  {clip.duration}
                </span>
                {/* Scene label */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#E50914]/80 text-[10px] text-white font-medium">
                  {clip.scene}
                </span>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs text-white/60 mb-3 font-medium">{clip.label}</p>
                <div className="flex gap-1.5">
                  <button className="flex-1 py-1.5 rounded-md text-[10px] font-medium bg-[#E50914]/80 text-white hover:bg-[#E50914] transition-colors">
                    Use
                  </button>
                  <button className="py-1.5 px-2 rounded-md text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all">
                    <RefreshCw className="h-3 w-3" />
                  </button>
                  <button className="py-1.5 px-2 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TIMELINE EDITOR ═══ */}
      <section className="relative mb-8">
        {!unlocked && <LockOverlay />}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white/80">Timeline Editor</h2>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Clock className="h-3.5 w-3.5" />
            Total: <span className="text-white/70 font-semibold">0:40</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          {/* Timeline bar */}
          <div className="flex items-stretch gap-0 mb-4 min-h-[80px] rounded-lg overflow-hidden border border-white/[0.06]">
            {PLACEHOLDER_CLIPS.map((clip, i) => (
              <div key={clip.id} className="flex items-stretch">
                {/* Clip block */}
                <div
                  className="group relative flex flex-col items-center justify-center px-4 py-3 bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-grab border-r border-white/[0.04]"
                  style={{ minWidth: clip.duration === '15s' ? '150px' : clip.duration === '5s' ? '70px' : '110px' }}
                >
                  <GripHorizontal className="h-3 w-3 text-white/15 absolute top-1.5 left-1.5" />
                  <Video className="h-4 w-4 text-white/30 mb-1" />
                  <span className="text-[10px] text-white/50 font-medium">{clip.label}</span>
                  <span className="text-[9px] text-white/30">{clip.duration}</span>
                </div>

                {/* Transition selector */}
                {i < PLACEHOLDER_CLIPS.length - 1 && (
                  <div className="flex items-center px-1">
                    <select
                      value={selectedTransitions[i] || 'Cut'}
                      onChange={(e) =>
                        setSelectedTransitions((prev) => ({ ...prev, [i]: e.target.value }))
                      }
                      className="bg-[#E50914]/10 border border-[#E50914]/20 rounded px-1.5 py-1 text-[9px] text-[#E50914] font-medium focus:outline-none cursor-pointer appearance-none text-center w-[60px]"
                    >
                      {TRANSITIONS.map((t) => (
                        <option key={t} value={t} className="bg-[#1a1a1a] text-white">{t}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Transitions legend */}
          <div className="flex items-center gap-4 text-[10px] text-white/30">
            <span>Transitions:</span>
            {TRANSITIONS.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/40">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </CreateLayout>
  )
}
