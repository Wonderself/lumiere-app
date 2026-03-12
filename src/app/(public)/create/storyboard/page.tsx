'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  LayoutGrid,
  Sparkles,
  Upload,
  Wand2,
  Plus,
  Trash2,
  Move,
  ZoomIn,
  ChevronRight,
  Lock,
  Check,
  Image as ImageIcon,
  ArrowRight,
  Lightbulb,
  Grid3x3,
} from 'lucide-react'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { cn } from '@/lib/utils'

/* ── Types ── */

interface StoryboardFrame {
  id: number
  label: string
  imageUrl: string | null
  notes: string
  cameraAngle: string
  lighting: string
}

const STYLE_OPTIONS = [
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'noir', label: 'Noir' },
  { value: 'anime', label: 'Anime' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'sketch', label: 'Sketch' },
]

const TIPS = [
  {
    title: 'Use Varied Shot Types',
    description:
      'Alternate between wide shots, medium shots, and close-ups to create visual rhythm and keep the audience engaged.',
  },
  {
    title: 'Follow the Rule of Thirds',
    description:
      'Place key subjects along the intersection points of a 3x3 grid for more dynamic and balanced compositions.',
  },
  {
    title: 'Maintain Visual Continuity',
    description:
      'Ensure characters and objects maintain consistent positioning between consecutive frames to avoid disorienting jump cuts.',
  },
  {
    title: 'Show, Don\'t Tell',
    description:
      'Use visual storytelling to convey emotions and narrative beats. A well-composed frame can replace pages of dialogue.',
  },
  {
    title: 'Plan Camera Movement',
    description:
      'Annotate pans, tilts, and tracking shots in your notes. Movement adds energy and guides the viewer\'s attention.',
  },
]

const WORKFLOW_STEPS = [
  {
    number: 1,
    title: 'Break Down Your Script',
    description: 'Divide your script into scenes and sequences. Identify key moments that need visual representation.',
    icon: Grid3x3,
  },
  {
    number: 2,
    title: 'Generate Frames',
    description: 'Use AI to generate storyboard images for each scene. Each generation costs tokens from your balance.',
    icon: Wand2,
  },
  {
    number: 3,
    title: 'Arrange & Refine',
    description: 'Drag and drop to reorder frames, add director notes, and refine compositions until your vision is clear.',
    icon: Move,
  },
]

/* ── Default frames ── */

function createEmptyFrames(): StoryboardFrame[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    label: `Scene ${i + 1}`,
    imageUrl: null,
    notes: '',
    cameraAngle: '',
    lighting: '',
  }))
}

/* ── Page Component ── */

export default function StoryboardPage() {
  const { completedSteps, markComplete, loaded } = useCreateProgress()

  /* Canvas state */
  const [frames, setFrames] = useState<StoryboardFrame[]>(createEmptyFrames)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expandedNotes, setExpandedNotes] = useState<number | null>(null)

  /* AI generation panel state */
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiStyle, setAiStyle] = useState('cinematic')
  const [generatingFrameId, setGeneratingFrameId] = useState<number | null>(null)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)

  /* Locked state */
  const isUnlocked = loaded
    ? (() => {
        const stepIndex = CREATE_STEPS.findIndex((s) => s.id === 'storyboard')
        for (let i = 0; i < stepIndex; i++) {
          if (!completedSteps.includes(CREATE_STEPS[i].id)) return false
        }
        return true
      })()
    : false

  if (!loaded) return null

  /* Handlers */
  function addScene() {
    const nextId = frames.length > 0 ? Math.max(...frames.map((f) => f.id)) + 1 : 1
    setFrames((prev) => [
      ...prev,
      { id: nextId, label: `Scene ${nextId}`, imageUrl: null, notes: '', cameraAngle: '', lighting: '' },
    ])
  }

  function removeFrame(id: number) {
    setFrames((prev) => prev.filter((f) => f.id !== id))
  }

  function handleGenerateFrame(frameId: number) {
    setGeneratingFrameId(frameId)
    // Simulate AI generation
    setTimeout(() => {
      const placeholderUrl = `https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=640&h=360&q=80`
      setFrames((prev) =>
        prev.map((f) => (f.id === frameId ? { ...f, imageUrl: placeholderUrl } : f))
      )
      setLastGenerated(placeholderUrl)
      setGeneratingFrameId(null)
    }, 2000)
  }

  function updateFrameNotes(id: number, field: 'notes' | 'cameraAngle' | 'lighting', value: string) {
    setFrames((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  return (
    <CreateLayout
      currentStepId="storyboard"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('storyboard')}
    >
      {/* ── Hero Section ── */}
      <section className="relative mb-12">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#E50914]/[0.04] blur-[100px]" />
        </div>

        <div className="relative text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
            <LayoutGrid className="h-7 w-7 text-[#E50914]" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Create Your <span className="text-[#E50914]">Storyboard</span>
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Visualize every scene of your film. Break down your script into frames,
            generate AI-powered storyboard images, and arrange your visual narrative.
          </p>
        </div>
      </section>

      {/* ── Guided Workflow ── */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-6">
          Guided Workflow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.number}
              className="relative p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-[#E50914]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E50914]/60 mb-1">
                    Step {step.number}
                  </div>
                  <h3 className="text-sm font-semibold text-white/90 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Storyboard Canvas ── */}
      <section className="relative mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Storyboard Canvas
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/30">
              {frames.length} scene{frames.length !== 1 ? 's' : ''}
            </span>

            {/* View toggle */}
            <div className="flex items-center rounded-lg border border-white/[0.06] overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid' ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/50'
                )}
              >
                <Grid3x3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list' ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/50'
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Add scene */}
            <button
              onClick={addScene}
              disabled={!isUnlocked}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                isUnlocked
                  ? 'bg-[#E50914] text-white hover:bg-[#B20710] active:scale-[0.97]'
                  : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
              )}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Scene
            </button>
          </div>
        </div>

        {/* Lock overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-30 rounded-xl bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <Lock className="h-10 w-10 text-white/20 mb-4" />
            <p className="text-sm font-medium text-white/40 mb-1">Storyboard Locked</p>
            <p className="text-xs text-white/25 max-w-xs text-center">
              Complete the previous steps to unlock the storyboard canvas.
            </p>
          </div>
        )}

        {/* Frame grid */}
        <div
          className={cn(
            'gap-4',
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col'
          )}
        >
          {frames.map((frame) => (
            <div
              key={frame.id}
              className="group relative rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
            >
              {/* 16:9 frame area */}
              <div className="relative aspect-video bg-black/30">
                {frame.imageUrl ? (
                  <>
                    <Image
                      src={frame.imageUrl}
                      alt={frame.label}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Frame actions overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors">
                        <Move className="h-3.5 w-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors">
                        <ZoomIn className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeFrame(frame.id)}
                        className="w-8 h-8 rounded-lg bg-black/60 border border-red-500/20 flex items-center justify-center text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.08] rounded-lg m-2">
                    {generatingFrameId === frame.id ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#E50914]/30 border-t-[#E50914] rounded-full animate-spin" />
                        <span className="text-xs text-white/40">Generating...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                          <Plus className="h-5 w-5 text-white/20" />
                        </div>
                        <button
                          onClick={() => handleGenerateFrame(frame.id)}
                          disabled={!isUnlocked}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all',
                            isUnlocked
                              ? 'bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] hover:bg-[#E50914]/20'
                              : 'bg-white/[0.03] border border-white/[0.06] text-white/20 cursor-not-allowed'
                          )}
                        >
                          <Wand2 className="h-3 w-3" />
                          Generate with AI
                        </button>
                        <span className="text-[10px] text-white/20 mt-1.5">Costs 25 tokens</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Frame label and actions */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-medium text-white/60">{frame.label}</span>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 rounded text-white/30 hover:text-white/60 transition-colors">
                    <Move className="h-3 w-3" />
                  </button>
                  <button className="p-1 rounded text-white/30 hover:text-white/60 transition-colors">
                    <ZoomIn className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeFrame(frame.id)}
                    className="p-1 rounded text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Generation Panel ── */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-6">
          AI Frame Generator
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Controls */}
          <div className="lg:col-span-3 p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            {/* Prompt input */}
            <label className="block text-xs font-medium text-white/50 mb-2">Scene Description</label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe the scene to generate... e.g. 'A dimly lit alleyway at night, rain-soaked cobblestones reflecting neon signs, a lone figure in a trench coat walking away from camera'"
              rows={4}
              disabled={!isUnlocked}
              className={cn(
                'w-full px-4 py-3 rounded-lg bg-black/30 border text-sm text-white/90 placeholder:text-white/20 resize-none focus:outline-none transition-colors',
                isUnlocked
                  ? 'border-white/[0.08] focus:border-[#E50914]/40'
                  : 'border-white/[0.04] text-white/20 cursor-not-allowed'
              )}
            />

            {/* Style selector */}
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium text-white/50 mb-2">Visual Style</label>
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value)}
                  disabled={!isUnlocked}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-lg bg-black/30 border text-sm text-white/80 focus:outline-none transition-colors appearance-none cursor-pointer',
                    isUnlocked
                      ? 'border-white/[0.08] focus:border-[#E50914]/40'
                      : 'border-white/[0.04] text-white/20 cursor-not-allowed'
                  )}
                >
                  {STYLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#111] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                disabled={!isUnlocked || !aiPrompt.trim()}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                  isUnlocked && aiPrompt.trim()
                    ? 'bg-[#E50914] text-white hover:bg-[#B20710] active:scale-[0.97]'
                    : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                )}
              >
                <Sparkles className="h-4 w-4" />
                Generate Frame
                <span className="text-[10px] opacity-60 ml-1">25 tokens</span>
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <span className="text-xs font-medium text-white/40">Preview</span>
            </div>
            <div className="relative aspect-video bg-black/20">
              {lastGenerated ? (
                <Image
                  src={lastGenerated}
                  alt="Last generated frame"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-white/10 mb-2" />
                  <span className="text-xs text-white/20">No frame generated yet</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Scene Notes Section ── */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-6">
          Scene Notes
        </h2>

        <div className="space-y-2">
          {frames.map((frame) => {
            const isExpanded = expandedNotes === frame.id

            return (
              <div
                key={frame.id}
                className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-all duration-300"
              >
                {/* Collapse header */}
                <button
                  onClick={() => setExpandedNotes(isExpanded ? null : frame.id)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-[10px] font-bold text-white/30">
                      {frame.id}
                    </div>
                    <span className="text-sm font-medium text-white/70">{frame.label}</span>
                    {(frame.notes || frame.cameraAngle || frame.lighting) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                    )}
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 text-white/20 transition-transform duration-200',
                      isExpanded && 'rotate-90'
                    )}
                  />
                </button>

                {/* Expandable content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-white/[0.04]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-2">
                          Director Notes
                        </label>
                        <textarea
                          value={frame.notes}
                          onChange={(e) => updateFrameNotes(frame.id, 'notes', e.target.value)}
                          placeholder="Action, emotion, pacing..."
                          rows={3}
                          disabled={!isUnlocked}
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/[0.06] text-xs text-white/80 placeholder:text-white/15 resize-none focus:outline-none focus:border-[#E50914]/30 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-2">
                          Camera Angle
                        </label>
                        <textarea
                          value={frame.cameraAngle}
                          onChange={(e) => updateFrameNotes(frame.id, 'cameraAngle', e.target.value)}
                          placeholder="Wide shot, close-up, over-the-shoulder..."
                          rows={3}
                          disabled={!isUnlocked}
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/[0.06] text-xs text-white/80 placeholder:text-white/15 resize-none focus:outline-none focus:border-[#E50914]/30 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-2">
                          Lighting
                        </label>
                        <textarea
                          value={frame.lighting}
                          onChange={(e) => updateFrameNotes(frame.id, 'lighting', e.target.value)}
                          placeholder="Natural, low-key, neon, golden hour..."
                          rows={3}
                          disabled={!isUnlocked}
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/[0.06] text-xs text-white/80 placeholder:text-white/15 resize-none focus:outline-none focus:border-[#E50914]/30 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Tips Panel ── */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="h-4 w-4 text-amber-400/60" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Storyboarding Tips
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIPS.map((tip, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/10 transition-all duration-300 group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-[10px] font-bold text-amber-400/60 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/80 mb-1.5 group-hover:text-amber-400/80 transition-colors">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-white/35 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </CreateLayout>
  )
}
