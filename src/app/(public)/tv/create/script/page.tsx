'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  FileText,
  Sparkles,
  Brain,
  ArrowRight,
  ChevronDown,
  AlertCircle,
  Wand2,
  Bold,
  Italic,
  Type,
  Tv,
  User,
  MessageSquare,
  ChevronsRight,
  Minus,
  Check,
  Mic,
  Zap,
  BookOpen,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Constants ── */
const FORMATS = [
  { id: 'sitcom', label: 'Sitcom', duration: '22 min', episodes: '22-24 episodes/season' },
  { id: 'drama', label: 'Drama', duration: '45 min', episodes: '10-13 episodes/season' },
  { id: 'latenight', label: 'Late Night', duration: '60 min', episodes: '200+ episodes/year' },
  { id: 'short', label: 'Short', duration: '10 min', episodes: '6-12 episodes/season' },
]

const TEMPLATES: Record<string, { name: string; content: string }[]> = {
  sitcom: [
    { name: 'Classic Sitcom Cold Open', content: 'COLD OPEN\n\nINT. LIVING ROOM - DAY\n\n(The family is gathered around the kitchen table. DAD is reading the newspaper upside down.)\n\n                    MOM\n     Honey, your paper is upside down.\n\n                    DAD\n     I know. I\'m reading the Australian edition.\n\n(Laugh track)\n\nTITLE SEQUENCE\n' },
    { name: 'Workplace Sitcom', content: 'COLD OPEN\n\nINT. OFFICE - MORNING\n\n(EMPLOYEES are gathered around the coffee machine. BOSS enters wearing something unexpected.)\n\n                    EMPLOYEE 1\n     Is that a... cape?\n\n                    BOSS\n     It\'s a leadership poncho.\n          (beat)\n     There\'s a difference.\n\nTITLE SEQUENCE\n' },
  ],
  drama: [
    { name: 'Dramatic Teaser', content: 'TEASER\n\nEXT. CITY SKYLINE - NIGHT\n\n(Rain hammers the skyline. A single light flickers in a high-rise window.)\n\nINT. HIGH-RISE APARTMENT - CONTINUOUS\n\n(DETECTIVE SARAH COLE stares at a wall of photos connected by red string. Her phone BUZZES.)\n\n                    SARAH\n          (answering)\n     Cole.\n\n                    VOICE (O.S.)\n     We found another one.\n\n(Sarah closes her eyes. A beat.)\n\n                    SARAH\n     Where?\n\nSMASH CUT TO:\n\nTITLE CARD\n' },
  ],
  latenight: [
    { name: 'Monologue Opening', content: 'COLD OPEN\n\nINT. STUDIO - NIGHT\n\n(BAND plays theme song. AUDIENCE applauds. HOST walks out waving.)\n\n                    HOST\n     Thank you! Thank you so much!\n     Great to have you here tonight.\n     We\'ve got a fantastic show for you.\n\n(Beat - looks at camera)\n\n                    HOST (CONT\'D)\n     So, did you all see the news today?\n\n(Audience reacts)\n\n                    HOST (CONT\'D)\n     [TOPICAL JOKE 1]\n\n(Audience laughs)\n\n                    HOST (CONT\'D)\n     [TOPICAL JOKE 2]\n\n(Bigger laugh)\n\n                    HOST (CONT\'D)\n     But seriously folks...\n     [TRANSITION TO DESK]\n' },
  ],
  short: [
    { name: 'Mini Episode', content: 'EPISODE [NUMBER]\n\n"[EPISODE TITLE]"\n\nINT. LOCATION - TIME\n\n(Brief scene description. Keep it tight - every second counts.)\n\n                    CHARACTER\n     [Dialogue - short and punchy]\n\n(Action - visual storytelling is key in short format)\n\nSMASH CUT TO:\n\nEND CARD\n' },
  ],
}

const FORMATTING_BUTTONS = [
  { label: 'Bold', icon: Bold, insert: '**text**' },
  { label: 'Italic', icon: Italic, insert: '_text_' },
  { label: 'UPPER', icon: Type, insert: 'UPPERCASE' },
  { label: 'Scene', icon: Tv, insert: '\nINT./EXT. LOCATION - DAY/NIGHT\n\n' },
  { label: 'Character', icon: User, insert: '\n                    CHARACTER NAME\n' },
  { label: 'Paren', icon: Minus, insert: '          (parenthetical)\n' },
  { label: 'Dialogue', icon: MessageSquare, insert: '     Dialogue goes here.\n' },
  { label: 'Transition', icon: ChevronsRight, insert: '\n                                                      CUT TO:\n\n' },
]

const ANALYSIS_RESULTS = [
  {
    label: 'Pacing',
    description: 'Scene rhythm, commercial breaks, act structure',
    score: 74,
    grade: 'B',
    feedback: 'Good pacing for the format. Consider tightening the second act break and adding a stronger cliffhanger.',
    suggestions: [
      'Add a mini-cliffhanger before each commercial break',
      'Ensure cold open hooks the audience within 30 seconds',
      'Balance A-plot and B-plot screen time more evenly',
      'Consider a runner (recurring gag or theme) throughout the episode',
    ],
  },
  {
    label: 'Dialogue Quality',
    description: 'Character voice, naturalism, entertainment value',
    score: 82,
    grade: 'A',
    feedback: 'Strong character voices. The banter feels natural and entertaining. Some exposition could be more organic.',
    suggestions: [
      'Let characters reveal backstory through conflict, not monologues',
      'Give each character a signature phrase or verbal tic',
      'Add more subtext in dramatic scenes',
      'Read all dialogue aloud to test rhythm and naturalism',
    ],
  },
  {
    label: 'Audience Engagement',
    description: 'Hook strength, emotional beats, rewatch value',
    score: 70,
    grade: 'B',
    feedback: 'The cold open is strong. Mid-episode engagement dips slightly. The ending leaves the audience wanting more.',
    suggestions: [
      'Add a mystery element or unanswered question early on',
      'Include at least one unexpected twist per episode',
      'End on an emotional beat that resonates beyond the episode',
      'Plant Easter eggs that reward repeat viewers',
    ],
  },
]

const AUTOSAVE_KEY = 'cinegen-tv-script-draft'

function gradeColor(grade: string) {
  if (grade === 'A') return 'text-emerald-400'
  if (grade === 'B') return 'text-blue-400'
  if (grade === 'C') return 'text-amber-400'
  return 'text-red-400'
}

function scoreBarColor(score: number) {
  if (score >= 80) return 'from-emerald-500 to-emerald-400'
  if (score >= 70) return 'from-blue-500 to-blue-400'
  if (score >= 60) return 'from-amber-500 to-amber-400'
  return 'from-red-500 to-red-400'
}

export default function TvScriptPage() {
  const [selectedFormat, setSelectedFormat] = useState('sitcom')
  const [episodeNumber, setEpisodeNumber] = useState(1)
  const [scriptText, setScriptText] = useState('')
  const [scriptTitle, setScriptTitle] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [expandedSuggestions, setExpandedSuggestions] = useState<Record<string, boolean>>({})
  const [showTemplates, setShowTemplates] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [generatingColdOpen, setGeneratingColdOpen] = useState(false)
  const [generatingMonologue, setGeneratingMonologue] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Load draft ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY)
      if (saved) {
        const draft = JSON.parse(saved)
        if (draft.scriptText) setScriptText(draft.scriptText)
        if (draft.scriptTitle) setScriptTitle(draft.scriptTitle)
        if (draft.selectedFormat) setSelectedFormat(draft.selectedFormat)
        if (draft.episodeNumber) setEpisodeNumber(draft.episodeNumber)
        setAutoSaveStatus('saved')
      }
    } catch { /* ignore */ }
  }, [])

  /* ── Auto-save ── */
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    setAutoSaveStatus('saving')
    autoSaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          AUTOSAVE_KEY,
          JSON.stringify({ scriptText, scriptTitle, selectedFormat, episodeNumber })
        )
        setAutoSaveStatus('saved')
      } catch {
        setAutoSaveStatus('idle')
      }
    }, 1500)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [scriptText, scriptTitle, selectedFormat, episodeNumber])

  /* ── Stats ── */
  const wordCount = scriptText.split(/\s+/).filter(Boolean).length
  const pageEstimate = Math.max(1, Math.round(wordCount / 250))
  const sceneCount = useCallback(() => {
    const matches = scriptText.match(/^(INT\.|EXT\.|INT\/EXT\.)/gim)
    return matches ? matches.length : 0
  }, [scriptText])

  /* ── Character auto-complete names from script ── */
  const characterNames = Array.from(
    new Set(
      (scriptText.match(/^\s{15,}([A-Z][A-Z\s]+)$/gm) || [])
        .map(m => m.trim())
        .filter(n => n.length > 1 && !['CUT TO', 'FADE IN', 'FADE OUT', 'SMASH CUT TO', 'TITLE SEQUENCE', 'TITLE CARD', 'COLD OPEN', 'END CARD'].includes(n))
    )
  )

  /* ── Formatting insert ── */
  const insertFormatting = useCallback((text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = scriptText.slice(0, start)
    const after = scriptText.slice(end)
    setScriptText(before + text + after)
    setTimeout(() => {
      textarea.focus()
      const cursorPos = start + text.length
      textarea.setSelectionRange(cursorPos, cursorPos)
    }, 0)
  }, [scriptText])

  /* ── Apply template ── */
  const applyTemplate = useCallback((content: string) => {
    setScriptText(content)
    setShowTemplates(false)
  }, [])

  /* ── AI Analysis ── */
  const handleAnalyze = useCallback(() => {
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setAnalysisProgress(0)

    const steps = [
      { progress: 15, delay: 300 },
      { progress: 35, delay: 800 },
      { progress: 55, delay: 1400 },
      { progress: 72, delay: 2000 },
      { progress: 88, delay: 2600 },
      { progress: 95, delay: 3000 },
      { progress: 100, delay: 3400 },
    ]
    steps.forEach(({ progress, delay }) => {
      setTimeout(() => setAnalysisProgress(progress), delay)
    })
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 3600)
  }, [])

  /* ── Generate Cold Open (simulated) ── */
  const handleGenerateColdOpen = useCallback(() => {
    setGeneratingColdOpen(true)
    setTimeout(() => {
      const coldOpen = selectedFormat === 'latenight'
        ? 'COLD OPEN\n\nINT. STUDIO - NIGHT\n\n(Pre-taped sketch plays on monitors. AUDIENCE reacts.)\n\n[AI-GENERATED COLD OPEN SKETCH]\n\nSMASH CUT TO:\n\nTITLE SEQUENCE\n'
        : 'COLD OPEN\n\nINT. MAIN SET - DAY\n\n(A seemingly normal scene that quickly escalates into the episode\'s central conflict.)\n\n                    CHARACTER A\n     Everything is going to be fine.\n\n(Something goes spectacularly wrong.)\n\n                    CHARACTER B\n     You were saying?\n\nTITLE SEQUENCE\n'
      setScriptText(prev => coldOpen + '\n' + prev)
      setGeneratingColdOpen(false)
    }, 2000)
  }, [selectedFormat])

  /* ── Generate Monologue (simulated) ── */
  const handleGenerateMonologue = useCallback(() => {
    setGeneratingMonologue(true)
    setTimeout(() => {
      const monologue = '\n                    HOST\n     So let me tell you about [TOPIC].\n     You know what\'s funny about [TOPIC]?\n     [PUNCHLINE SETUP]\n     [PUNCHLINE]\n\n(Audience laughs)\n\n                    HOST (CONT\'D)\n     But seriously...\n     [TRANSITION TO NEXT BIT]\n\n'
      setScriptText(prev => prev + monologue)
      setGeneratingMonologue(false)
    }, 2000)
  }, [])

  const toggleSuggestion = useCallback((label: string) => {
    setExpandedSuggestions(prev => ({ ...prev, [label]: !prev[label] }))
  }, [])

  const overallScore = Math.round(
    ANALYSIS_RESULTS.reduce((sum, r) => sum + r.score, 0) / ANALYSIS_RESULTS.length
  )
  const overallGrade = overallScore >= 80 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 60 ? 'C' : 'D'

  return (
    <div className="min-h-screen bg-[#050A15]">
      {/* ── Hero ── */}
      <section className="relative pt-12 pb-10 md:pt-20 md:pb-14 px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#2563EB]/[0.04] blur-[100px]" />
        </div>

        <div className="relative">
          <Link
            href="/tv/create"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors mb-6"
          >
            <ChevronRight className="h-3 w-3 rotate-180" />
            Back to TV Create Hub
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-white/50 mb-6 ml-4">
            <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" />
            Step 2 of 7
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#2563EB]" />
            </div>
            <h1 className="section-title-flash text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Write Your <span className="text-[#2563EB]">TV Script</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
            Write episode scripts with proper formatting, dialogue, and scene structure.
            AI assists with analysis, generation, and format-specific templates.
          </p>
        </div>
      </section>

      <div className="px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto pb-20">
        {/* ── Format Selector ── */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-wider">Show Format</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FORMATS.map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt.id)}
                className={cn(
                  'rounded-2xl border p-4 text-left transition-all duration-300',
                  selectedFormat === fmt.id
                    ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08]'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                )}
              >
                <h3 className={cn(
                  'text-sm font-bold mb-1 transition-colors',
                  selectedFormat === fmt.id ? 'text-[#2563EB]' : 'text-white/70'
                )}>
                  {fmt.label}
                </h3>
                <p className="text-xs text-white/35">{fmt.duration}</p>
                <p className="text-[10px] text-white/25 mt-1">{fmt.episodes}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── Episode Number ── */}
        <section className="mb-8">
          <div className="flex items-center gap-4">
            <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Episode</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEpisodeNumber(Math.max(1, episodeNumber - 1))}
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                -
              </button>
              <span className="text-sm font-bold text-white w-8 text-center">{episodeNumber}</span>
              <button
                onClick={() => setEpisodeNumber(episodeNumber + 1)}
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                +
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Script Editor (2 cols) ── */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              {/* Title input */}
              <div className="p-5 border-b border-white/[0.06]">
                <input
                  type="text"
                  value={scriptTitle}
                  onChange={(e) => setScriptTitle(e.target.value)}
                  placeholder={`Episode ${episodeNumber} - Untitled`}
                  className="w-full bg-transparent text-lg font-bold text-white placeholder:text-white/20 focus:outline-none"
                />
              </div>

              {/* Template selector */}
              <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-2 text-xs font-medium text-[#2563EB] hover:text-[#3B82F6] transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Templates
                  <ChevronDown className={cn('h-3 w-3 transition-transform', showTemplates && 'rotate-180')} />
                </button>

                {/* Character names detected */}
                {characterNames.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <User className="h-3 w-3" />
                    Characters: {characterNames.slice(0, 4).join(', ')}
                    {characterNames.length > 4 && ` +${characterNames.length - 4}`}
                  </div>
                )}
              </div>

              {/* Templates dropdown */}
              {showTemplates && (
                <div className="p-4 border-b border-white/[0.06] bg-white/[0.01]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(TEMPLATES[selectedFormat] || []).map((tpl) => (
                      <button
                        key={tpl.name}
                        onClick={() => applyTemplate(tpl.content)}
                        className="text-left p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#2563EB]/30 hover:bg-[#2563EB]/[0.03] transition-all duration-200"
                      >
                        <h4 className="text-xs font-semibold text-white/70 mb-1">{tpl.name}</h4>
                        <p className="text-[10px] text-white/30 line-clamp-2 font-mono">{tpl.content.slice(0, 80)}...</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Formatting toolbar */}
              <div className="flex flex-wrap items-center gap-1 bg-white/[0.02] border-b border-white/[0.06] px-3 py-1.5">
                {FORMATTING_BUTTONS.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => insertFormatting(btn.insert)}
                    title={btn.label}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all duration-150"
                  >
                    <btn.icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{btn.label}</span>
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder={`COLD OPEN\n\nINT. STUDIO SET - NIGHT\n\nWrite your ${FORMATS.find(f => f.id === selectedFormat)?.label || 'TV'} script here...\n\n                    CHARACTER\n          (direction)\n     Dialogue goes here.`}
                rows={24}
                className="w-full bg-transparent px-5 py-4 text-sm text-white/90 font-mono leading-relaxed placeholder:text-white/15 focus:outline-none resize-y min-h-[400px]"
              />

              {/* Stats bar */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 border-t border-white/[0.06] text-xs text-white/30">
                <span>{wordCount.toLocaleString()} words</span>
                <span className="w-px h-3 bg-white/10" />
                <span>{sceneCount()} scenes</span>
                <span className="w-px h-3 bg-white/10" />
                <span>~{pageEstimate} pages</span>
                <span className="w-px h-3 bg-white/10" />
                <span>Ep. {episodeNumber} &middot; {FORMATS.find(f => f.id === selectedFormat)?.label}</span>
                <span className="w-px h-3 bg-white/10" />
                <span className="flex items-center gap-1.5">
                  {autoSaveStatus === 'saving' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-amber-400/70">Saving...</span>
                    </>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-emerald-400/70">Saved</span>
                    </>
                  )}
                  {autoSaveStatus === 'idle' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span>Draft</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* ── AI Assistant Panel (1 col) ── */}
          <div className="space-y-5">
            {/* Analyze Script */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-white/80">AI Script Analysis</h3>
              </div>
              <p className="text-xs text-white/35 mb-4">
                Analyze pacing, dialogue quality, and audience engagement score.
              </p>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || scriptText.length < 50}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300',
                  isAnalyzing
                    ? 'bg-[#2563EB]/30 text-white/50 cursor-wait'
                    : scriptText.length < 50
                      ? 'bg-white/5 text-white/20 cursor-not-allowed'
                      : 'bg-[#2563EB] text-white hover:bg-[#3B82F6] hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]'
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
                    Analyze Script
                  </>
                )}
              </button>

              {isAnalyzing && (
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] transition-all duration-500 ease-out"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/30 mt-1 text-center">{analysisProgress}%</p>
                </div>
              )}
            </div>

            {/* Generate Cold Open */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-white/80">Generate Cold Open</h3>
              </div>
              <p className="text-xs text-white/35 mb-4">
                AI generates a cold open tailored to your show format.
              </p>
              <button
                onClick={handleGenerateColdOpen}
                disabled={generatingColdOpen}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300',
                  generatingColdOpen
                    ? 'bg-white/5 text-white/30 cursor-wait'
                    : 'bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.1]'
                )}
              >
                {generatingColdOpen ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Generate Cold Open
                  </>
                )}
              </button>
            </div>

            {/* Generate Monologue (Late Night) */}
            {selectedFormat === 'latenight' && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Mic className="h-4 w-4 text-[#2563EB]" />
                  <h3 className="text-sm font-bold text-white/80">Generate Monologue</h3>
                </div>
                <p className="text-xs text-white/35 mb-4">
                  Generate a late night monologue with topical joke structure.
                </p>
                <button
                  onClick={handleGenerateMonologue}
                  disabled={generatingMonologue}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300',
                    generatingMonologue
                      ? 'bg-white/5 text-white/30 cursor-wait'
                      : 'bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.1]'
                  )}
                >
                  {generatingMonologue ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Generate Monologue
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Analysis Results */}
            {analysisComplete && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white/80">Analysis Results</h3>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-lg font-black', gradeColor(overallGrade))}>{overallGrade}</span>
                    <span className="text-sm font-bold text-white/60">{overallScore}%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {ANALYSIS_RESULTS.map((cat) => (
                    <div key={cat.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-white/60">{cat.label}</span>
                        <span className={cn('text-xs font-bold', gradeColor(cat.grade))}>{cat.score}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-2">
                        <div
                          className={cn('h-full rounded-full bg-gradient-to-r', scoreBarColor(cat.score))}
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-white/35 leading-relaxed mb-1">{cat.feedback}</p>

                      <button
                        onClick={() => toggleSuggestion(cat.label)}
                        className="flex items-center gap-1 text-[10px] font-medium text-[#2563EB]/70 hover:text-[#2563EB] transition-colors"
                      >
                        <ChevronDown className={cn('h-2.5 w-2.5 transition-transform', expandedSuggestions[cat.label] && 'rotate-180')} />
                        Suggestions ({cat.suggestions.length})
                      </button>
                      {expandedSuggestions[cat.label] && (
                        <div className="mt-1.5 space-y-1 pl-1">
                          {cat.suggestions.map((s, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[10px] text-white/35 leading-relaxed">
                              <span className="text-[#2563EB] mt-0.5 shrink-0">&#8226;</span>
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next step CTA */}
            <Link
              href="/tv/create/set-design"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
              style={{
                boxShadow: '0 0 0 2px #C4A030, 0 0 10px rgba(196,160,48,0.15)',
              }}
            >
              Continue to Set Design
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
