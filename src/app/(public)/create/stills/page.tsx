'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Image as ImageIcon,
  Lock,
  Sparkles,
  Upload,
  Trash2,
  RefreshCw,
  Film,
  SlidersHorizontal,
  Camera,
  Layers,
  GripVertical,
  Filter,
  Plus,
} from 'lucide-react'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { cn } from '@/lib/utils'

/* ── Data ── */

const ASPECT_RATIOS = ['16:9', '4:3', '1:1', '9:16']
const STYLES = ['Cinematic', 'Noir', 'Fantasy', 'Sci-Fi', 'Period']
const CAMERA_ANGLES = ['Wide', 'Close-up', "Bird's eye", 'Low angle']
const SCENE_FILTERS = ['All Scenes', 'Scene 1', 'Scene 2', 'Scene 3', 'Scene 4']

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

export default function StillsPage() {
  const { completedSteps, markComplete, isStepUnlocked, loaded } = useCreateProgress()
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [style, setStyle] = useState('Cinematic')
  const [cameraAngle, setCameraAngle] = useState('Wide')
  const [sceneFilter, setSceneFilter] = useState('All Scenes')

  if (!loaded) return null

  const unlocked = isStepUnlocked('stills', CREATE_STEPS)

  return (
    <CreateLayout
      currentStepId="stills"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('stills')}
    >
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
          <ImageIcon className="h-8 w-8 text-[#E50914]" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Generate <span className="text-[#E50914]">Still Shots</span>
        </h1>
        <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
          Create cinematic still images for every scene. Describe your vision and let AI bring it to life.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="text-lg font-bold text-white/80 mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Camera, title: 'Describe Your Shot', desc: 'Write a detailed prompt describing the composition, mood and subject.' },
            { icon: Sparkles, title: 'AI Generation', desc: 'Our AI creates photorealistic stills matching your cinematic vision.' },
            { icon: Layers, title: 'Curate Gallery', desc: 'Select the best shots, regenerate or refine until perfect.' },
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

      {/* ═══ GENERATION STUDIO ═══ */}
      <section className="relative mb-16">
        {!unlocked && <LockOverlay />}
        <h2 className="text-lg font-bold text-white/80 mb-6">Generation Studio</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prompt area */}
          <div className="lg:col-span-2 space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the shot... e.g. A lone figure standing on a rain-soaked rooftop at night, neon signs reflecting off wet surfaces, cinematic wide angle, moody blue and red lighting"
              rows={6}
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/25 resize-none focus:outline-none focus:border-[#E50914]/40 transition-colors"
            />
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] text-white text-sm font-semibold hover:bg-[#B20710] transition-colors">
                <Sparkles className="h-4 w-4" />
                Generate
                <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px]">Included</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm font-medium hover:bg-white/[0.08] hover:text-white/80 transition-all">
                <Layers className="h-4 w-4" />
                Generate 4 Variations
                <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px]">Included</span>
              </button>
            </div>
          </div>

          {/* Settings panel */}
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="h-4 w-4 text-white/40" />
                <h3 className="text-sm font-semibold text-white/70">Settings</h3>
              </div>

              {/* Aspect Ratio */}
              <div className="mb-4">
                <label className="text-xs text-white/40 mb-2 block">Aspect Ratio</label>
                <div className="flex flex-wrap gap-1.5">
                  {ASPECT_RATIOS.map((ar) => (
                    <button
                      key={ar}
                      onClick={() => setAspectRatio(ar)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        aspectRatio === ar
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                      )}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="mb-4">
                <label className="text-xs text-white/40 mb-2 block">Style</label>
                <div className="flex flex-wrap gap-1.5">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        style === s
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Angle */}
              <div>
                <label className="text-xs text-white/40 mb-2 block">Camera Angle</label>
                <div className="flex flex-wrap gap-1.5">
                  {CAMERA_ANGLES.map((a) => (
                    <button
                      key={a}
                      onClick={() => setCameraAngle(a)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        cameraAngle === a
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.06]'
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section className="relative mb-16">
        {!unlocked && <LockOverlay />}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white/80">Gallery</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/30" />
            <select
              value={sceneFilter}
              onChange={(e) => setSceneFilter(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-1.5 text-xs text-white/60 focus:outline-none focus:border-[#E50914]/50 transition-colors appearance-none cursor-pointer"
            >
              {SCENE_FILTERS.map((f) => (
                <option key={f} value={f} className="bg-[#1a1a1a]">{f}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="group rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] hover:border-white/[0.15] transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-video flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-10 w-10 text-white/10 mx-auto mb-2" />
                  <p className="text-xs text-white/20">Generated image {i + 1}</p>
                </div>
              </div>
              <div className="p-3 border-t border-white/[0.04]">
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-medium bg-[#E50914]/80 text-white hover:bg-[#E50914] transition-colors">
                    <Film className="h-3 w-3" />
                    Use in Film
                  </button>
                  <button className="py-1.5 px-2 rounded-md text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                  <button className="py-1.5 px-2 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/20 mt-3 text-center">Drag to reorder images in the gallery</p>
      </section>

      {/* ═══ REFERENCE IMAGES ═══ */}
      <section className="relative mb-8">
        {!unlocked && <LockOverlay />}
        <h2 className="text-lg font-bold text-white/80 mb-6">Reference Images</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload area */}
          <div className="min-h-[200px] rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] flex flex-col items-center justify-center hover:border-white/[0.15] transition-colors cursor-pointer">
            <Upload className="h-10 w-10 text-white/15 mb-3" />
            <p className="text-sm text-white/30 mb-1">Upload reference images</p>
            <p className="text-xs text-white/20">PNG, JPG up to 10MB</p>
          </div>

          {/* Style transfer */}
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-[#E50914]" />
              <h3 className="text-sm font-semibold text-white/80">Style Transfer</h3>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              Upload a reference image and apply its visual style to your AI-generated stills. Match the color grading, composition and mood of any reference.
            </p>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 text-xs font-medium hover:bg-white/[0.08] hover:text-white/80 transition-all">
              <Plus className="h-3.5 w-3.5" />
              Select Reference for Style Transfer
            </button>
          </div>
        </div>
      </section>
    </CreateLayout>
  )
}
