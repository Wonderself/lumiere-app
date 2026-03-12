'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  FileText,
  Sparkles,
  Upload,
  Brain,
  Vote,
  ArrowRight,
  Check,
  Lock,
  ChevronRight,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Wand2,
} from 'lucide-react'
import { CreateLayout } from '@/components/create/create-layout'
import { useCreateProgress } from '@/components/create/use-create-progress'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { cn } from '@/lib/utils'

/* ── Constants ── */
const UNSPLASH_BG =
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&h=600&q=80'

const HOW_IT_WORKS = [
  {
    icon: FileText,
    title: 'Write or Upload',
    description:
      'Write your screenplay directly in our editor or upload a PDF/DOCX document. Formatting is handled automatically.',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description:
      'Our AI reviews your script and suggests improvements for structure, pacing, and dialogue. Optional and costs tokens.',
  },
  {
    icon: Vote,
    title: 'Submit or Continue',
    description:
      'Submit your script to community vote for potential funding, or continue building your own film independently.',
  },
]

const ANALYSIS_CATEGORIES = [
  { label: 'Story Structure', description: 'Three-act structure, plot points, and narrative arc' },
  { label: 'Character Development', description: 'Character depth, motivation, and growth arcs' },
  { label: 'Pacing', description: 'Scene rhythm, tension buildup, and momentum' },
  { label: 'Dialogue Quality', description: 'Authenticity, subtext, and character voice' },
]

const WRITING_TIPS = [
  { tip: 'Show, don\'t tell', detail: 'Use visual action and behavior instead of exposition to convey character emotions and story beats.' },
  { tip: 'Write for the screen', detail: 'Every line should describe something we can see or hear. If the camera can\'t capture it, rewrite it.' },
  { tip: 'Enter scenes late, leave early', detail: 'Cut the pleasantries. Start each scene at the last possible moment and exit before it winds down.' },
  { tip: 'Give every character a distinct voice', detail: 'Cover the character names and see if you can tell who is speaking from dialogue alone.' },
  { tip: 'Conflict drives every scene', detail: 'Every scene needs tension or conflict. If nothing is at stake, the scene likely doesn\'t belong.' },
  { tip: 'Read it aloud', detail: 'Dialogue that looks good on paper can sound unnatural spoken. Always do a read-through.' },
]

/* ── Locked overlay component ── */
function LockedOverlay() {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm">
      <div className="text-center px-6">
        <Lock className="h-8 w-8 text-white/30 mx-auto mb-3" />
        <p className="text-sm text-white/40 font-medium">Complete previous steps to unlock</p>
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function ScriptPage() {
  const { completedSteps, markComplete, isStepUnlocked, loaded } = useCreateProgress()

  const [activeTab, setActiveTab] = useState<'write' | 'upload'>('write')
  const [scriptText, setScriptText] = useState('')
  const [scriptTitle, setScriptTitle] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const stepUnlocked = isStepUnlocked('script', CREATE_STEPS)

  const sceneCount = useCallback(() => {
    const matches = scriptText.match(/^(INT\.|EXT\.|INT\/EXT\.)/gim)
    return matches ? matches.length : 0
  }, [scriptText])

  const handleAnalyze = useCallback(() => {
    if (!stepUnlocked) return
    setIsAnalyzing(true)
    // Simulated analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 2000)
  }, [stepUnlocked])

  if (!loaded) return null

  return (
    <CreateLayout
      currentStepId="script"
      completedSteps={completedSteps}
      onMarkComplete={() => markComplete('script')}
    >
      {/* ── HERO SECTION ── */}
      <section className="relative rounded-2xl overflow-hidden mb-12">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={UNSPLASH_BG}
            alt="Scriptwriting"
            fill
            className="object-cover opacity-20"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40" />
        </div>

        <div className="relative px-6 sm:px-10 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-white/50 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#E50914]" />
            Step 1 of {CREATE_STEPS.length}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#E50914]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Write Your <span className="text-[#E50914]">Script</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
            Every great film starts with a great script. Write your screenplay directly,
            upload an existing document, or let AI help you polish your story to perfection.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-white/80 mb-5 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-white/40" />
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map((item, i) => (
            <div
              key={item.title}
              className="group relative rounded-xl bg-white/[0.02] border border-white/[0.06] p-6 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-[#E50914]" />
                </div>
                <span className="text-xs font-bold text-white/20">STEP {i + 1}</span>
              </div>
              <h3 className="text-sm font-semibold text-white/90 mb-2">{item.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SCRIPT EDITOR SECTION ── */}
      <section className="relative mb-12">
        {!stepUnlocked && <LockedOverlay />}

        <div className={cn('rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden', !stepUnlocked && 'opacity-40 blur-[2px]')}>
          {/* Tab bar */}
          <div className="flex border-b border-white/[0.06]">
            <button
              onClick={() => setActiveTab('write')}
              className={cn(
                'flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2',
                activeTab === 'write'
                  ? 'text-[#E50914] border-[#E50914] bg-[#E50914]/[0.04]'
                  : 'text-white/40 border-transparent hover:text-white/60 hover:bg-white/[0.02]'
              )}
            >
              <FileText className="h-4 w-4" />
              Write Script
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={cn(
                'flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2',
                activeTab === 'upload'
                  ? 'text-[#E50914] border-[#E50914] bg-[#E50914]/[0.04]'
                  : 'text-white/40 border-transparent hover:text-white/60 hover:bg-white/[0.02]'
              )}
            >
              <Upload className="h-4 w-4" />
              Upload Script
            </button>
          </div>

          {/* Write tab */}
          {activeTab === 'write' && (
            <div className="p-6">
              {/* Title input */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                  Script Title
                </label>
                <input
                  type="text"
                  value={scriptTitle}
                  onChange={(e) => setScriptTitle(e.target.value)}
                  placeholder="Untitled Screenplay"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all"
                />
              </div>

              {/* Textarea */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                  Screenplay
                </label>
                <textarea
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  placeholder={`FADE IN:\n\nEXT. CITY STREET - NIGHT\n\nRain hammers the asphalt. A lone figure emerges from the shadows...\n\n                    CHARACTER\n          (whispering)\n     This is where it all begins.`}
                  rows={18}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-5 py-4 text-sm text-white/90 font-mono leading-relaxed placeholder:text-white/15 focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all resize-y min-h-[300px]"
                />
              </div>

              {/* Stats bar */}
              <div className="flex items-center gap-6 text-xs text-white/30">
                <span>
                  {scriptText.length.toLocaleString()} characters
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span>
                  {scriptText.split(/\s+/).filter(Boolean).length.toLocaleString()} words
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span className="flex items-center gap-1">
                  {sceneCount()} scenes detected
                  {sceneCount() > 0 && <Check className="h-3 w-3 text-emerald-400" />}
                </span>
              </div>
            </div>
          )}

          {/* Upload tab */}
          {activeTab === 'upload' && (
            <div className="p-6">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false) }}
                className={cn(
                  'border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer',
                  dragOver
                    ? 'border-[#E50914]/50 bg-[#E50914]/[0.04]'
                    : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]'
                )}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-5">
                  <Upload className="h-7 w-7 text-white/30" />
                </div>
                <h3 className="text-base font-semibold text-white/80 mb-2">
                  Drag & drop your script here
                </h3>
                <p className="text-sm text-white/35 mb-5">
                  Supports PDF, DOCX, FDX, and plain text files (max 10 MB)
                </p>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-white/[0.06] border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.1] transition-all duration-200">
                  <Upload className="h-4 w-4" />
                  Browse Files
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── AI ANALYSIS SECTION ── */}
      <section className="relative mb-12">
        {!stepUnlocked && <LockedOverlay />}

        <div className={cn(!stepUnlocked && 'opacity-40 blur-[2px]')}>
          <h2 className="text-lg font-bold text-white/80 mb-5 flex items-center gap-2">
            <Brain className="h-5 w-5 text-white/40" />
            AI Script Analysis
          </h2>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {/* Info header */}
            <div className="p-6 border-b border-white/[0.06]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Wand2 className="h-4 w-4 text-[#E50914]" />
                    <h3 className="text-sm font-semibold text-white/90">Nano Banana AI Analysis</h3>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed max-w-lg">
                    Our AI engine analyzes your screenplay for story structure, character development,
                    pacing, and dialogue quality. Receive actionable feedback to strengthen your script
                    before moving to production.
                  </p>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || scriptText.length < 50}
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 shrink-0',
                    isAnalyzing
                      ? 'bg-[#E50914]/30 text-white/50 cursor-wait'
                      : scriptText.length < 50
                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                        : 'bg-[#E50914] text-white hover:bg-[#FF2D2D] hover:shadow-[0_0_24px_rgba(229,9,20,0.25)] hover:scale-[1.02] active:scale-[0.98]'
                  )}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>

              {/* Token cost notice */}
              <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Costs <strong className="text-white/50">50 tokens</strong> per analysis</span>
              </div>
            </div>

            {/* Analysis results area */}
            <div className="p-6">
              {analysisComplete ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ANALYSIS_CATEGORIES.map((cat) => (
                    <div
                      key={cat.label}
                      className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 hover:border-white/[0.1] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-white/80">{cat.label}</h4>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-xs font-medium text-emerald-400">Good</span>
                        </div>
                      </div>
                      <p className="text-xs text-white/35 leading-relaxed">{cat.description}</p>
                      {/* Placeholder progress bar */}
                      <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
                          style={{ width: `${65 + Math.floor(Math.random() * 25)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                    <Wand2 className="h-6 w-6 text-white/15" />
                  </div>
                  <h4 className="text-sm font-medium text-white/30 mb-1">No Analysis Yet</h4>
                  <p className="text-xs text-white/20 max-w-sm mx-auto">
                    Write at least 50 characters, then click &ldquo;Analyze with AI&rdquo; to receive
                    detailed feedback on story structure, character development, pacing, and dialogue quality.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SUBMISSION OPTIONS ── */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-white/80 mb-5 flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-white/40" />
          Choose Your Path
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Path A: Community Vote */}
          <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-[#E50914]/30 hover:bg-[#E50914]/[0.02] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
                <Vote className="h-5 w-5 text-[#E50914]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white/90">Submit to Community Vote</h3>
                <p className="text-[11px] text-white/30">Path A</p>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-5">
              Submit your script for community review. If approved, your project may receive
              funding and collaborative support from the CINEGEN community. Great scripts
              get visibility and resources.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/25 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Costs <strong className="text-white/40">100 tokens</strong>
              </span>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#E50914]/15 text-[#E50914] hover:bg-[#E50914]/25 transition-all duration-200 group-hover:translate-x-0.5">
                Submit for Vote
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Path B: Make Your Own */}
          <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white/50" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white/90">Make Your Own Film</h3>
                <p className="text-[11px] text-white/30">Path B</p>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-5">
              Skip the community vote and proceed directly to storyboarding. You retain
              full creative control and use your own tokens to fund all production steps.
              Perfect for personal projects.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/25 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Uses your own tokens
              </span>
              <Link
                href="/create/storyboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.1] transition-all duration-200 group-hover:translate-x-0.5"
              >
                Continue to Storyboard
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WRITING TIPS ── */}
      <section className="mb-4">
        <h2 className="text-lg font-bold text-white/80 mb-5 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-white/40" />
          Screenwriting Tips
        </h2>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="divide-y divide-white/[0.04]">
            {WRITING_TIPS.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 hover:bg-white/[0.02] transition-colors duration-200"
              >
                <div className="shrink-0 w-7 h-7 rounded-lg bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-xs font-bold text-[#E50914]">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-1">{item.tip}</h4>
                  <p className="text-xs text-white/35 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </CreateLayout>
  )
}
