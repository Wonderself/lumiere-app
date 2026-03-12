'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  Upload,
  Camera,
  Mic,
  BookOpen,
  Users,
  Sparkles,
  Play,
  Pause,
  Download,
  Share2,
  Check,
  Shield,
  ChevronDown,
  UserCircle,
  Film,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Types ── */

type Role = 'lead' | 'supporting' | 'cameo' | 'voice' | 'narrator'

type AnalysisStep = {
  label: string
  done: boolean
}

/* ── Data ── */

const ROLES: {
  id: Role
  label: string
  icon: React.ElementType
  description: string
}[] = [
  { id: 'lead', label: 'Lead Actor', icon: Star, description: 'Be the main character' },
  { id: 'supporting', label: 'Supporting Actor', icon: Users, description: 'A key role in the story' },
  { id: 'cameo', label: 'Cameo', icon: Sparkles, description: 'A brief memorable appearance' },
  { id: 'voice', label: 'Voice Actor', icon: Mic, description: 'Lend your voice to a character' },
  { id: 'narrator', label: 'Narrator', icon: BookOpen, description: 'Tell the story in your voice' },
]

const PORTFOLIO_PLACEHOLDERS = [
  { title: 'The Last Frontier', role: 'Lead', character: 'Captain Elara Voss' },
  { title: 'Midnight in Kyoto', role: 'Supporting', character: 'Detective Tanaka' },
  { title: 'Echoes of Tomorrow', role: 'Cameo', character: 'The Stranger' },
  { title: 'Starfall', role: 'Voice', character: 'AI Companion' },
]

const SAMPLE_TEXT =
  'In a world where dreams become reality, one person dared to imagine beyond the stars...'

/* ── Component ── */

export default function ActPage() {
  /* State */
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    { label: 'Face detected', done: false },
    { label: 'Features mapped', done: false },
    { label: 'Ready for generation', done: false },
  ])
  const [generated, setGenerated] = useState(false)

  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)

  const [consentChecked, setConsentChecked] = useState(false)
  const [rightsOpen, setRightsOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* Waveform bars */
  const BARS = 40
  const [barHeights, setBarHeights] = useState<number[]>(Array(BARS).fill(4))

  useEffect(() => {
    if (!isRecording) return
    const interval = setInterval(() => {
      setBarHeights(Array.from({ length: BARS }, () => Math.random() * 28 + 4))
    }, 120)
    return () => clearInterval(interval)
  }, [isRecording])

  /* Handlers */

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedPhoto(url)
      setGenerated(false)
      setAnalysisSteps((s) => s.map((step) => ({ ...step, done: false })))
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setUploadedPhoto(url)
      setGenerated(false)
      setAnalysisSteps((s) => s.map((step) => ({ ...step, done: false })))
    }
  }

  function handleGenerate() {
    if (!uploadedPhoto) return
    setIsAnalyzing(true)
    setGenerated(false)
    setAnalysisSteps((s) => s.map((step) => ({ ...step, done: false })))

    const delays = [800, 1800, 2800]
    delays.forEach((delay, i) => {
      setTimeout(() => {
        setAnalysisSteps((prev) =>
          prev.map((step, idx) => (idx <= i ? { ...step, done: true } : step))
        )
        if (i === delays.length - 1) {
          setTimeout(() => {
            setIsAnalyzing(false)
            setGenerated(true)
          }, 600)
        }
      }, delay)
    })
  }

  function toggleRecording() {
    if (isRecording) {
      setIsRecording(false)
      setHasRecording(true)
      if (recordingInterval.current) clearInterval(recordingInterval.current)
      return
    }
    setHasRecording(false)
    setIsPlaying(false)
    setRecordingSeconds(0)
    setIsRecording(true)
    recordingInterval.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1)
    }, 1000)
  }

  function togglePlayback() {
    setIsPlaying((p) => !p)
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  /* Scroll helpers */
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  /* ── Render ── */

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* ────────────────────── HERO ────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1400&h=600&q=80"
            alt="Cinematic spotlight"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 via-[#0A0A0A]/80 to-[#0A0A0A]" />
        </div>

        {/* Glow accents */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#E50914]/[0.06] rounded-full blur-[140px]" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-purple-500/[0.08] rounded-full blur-[120px]" />

        <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 sm:pb-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E50914]/20 bg-[#E50914]/10 text-[#E50914] text-xs sm:text-sm mb-6">
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>AI Actor Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Act In Your{' '}
            <span className="bg-gradient-to-r from-[#E50914] to-orange-500 bg-clip-text text-transparent">
              Movie
            </span>
          </h1>

          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Step into the spotlight. Use AI to place yourself in any film — as a lead, a supporting
            character, or a cameo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('face-scan')}
              className="group flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#E50914] hover:bg-[#F6121D] text-white font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(229,9,20,0.3)]"
            >
              <Camera className="h-5 w-5" />
              Generate My Character
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollTo('voice-section')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white font-semibold transition-all duration-300"
            >
              <UserCircle className="h-5 w-5" />
              Submit My Profile
            </button>
          </div>
        </div>
      </section>

      {/* ────────────────────── HOW IT WORKS ────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Three simple steps to see yourself on the big screen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: 'Upload Your Photo',
                desc: 'Upload a clear headshot. Our AI maps your facial features for realistic rendering.',
                step: '01',
              },
              {
                icon: Star,
                title: 'Choose Your Role',
                desc: 'Select the type of role: Lead, Supporting, Cameo, Voice Actor, Narrator.',
                step: '02',
              },
              {
                icon: Film,
                title: 'See Yourself on Screen',
                desc: 'AI generates scenes with you as the character in your chosen film.',
                step: '03',
              },
            ].map((card) => (
              <div
                key={card.step}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <span className="absolute top-6 right-6 text-5xl font-black text-white/[0.04] group-hover:text-[#E50914]/10 transition-colors">
                  {card.step}
                </span>
                <div className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#E50914]/10 text-[#E50914]">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────── FACE SCAN ────────────────────── */}
      <section id="face-scan" className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E50914]/20 bg-[#E50914]/10 text-[#E50914] text-xs sm:text-sm mb-4">
              <Camera className="h-3.5 w-3.5" />
              <span>Face Scan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Generate Your AI Character</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Upload a clear headshot and our AI will create a cinematic version of you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload area */}
            <div className="space-y-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-300 min-h-[320px]',
                  isDragging
                    ? 'border-[#E50914] bg-[#E50914]/[0.06]'
                    : 'border-white/[0.1] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.04]'
                )}
              >
                {uploadedPhoto ? (
                  <div className="relative w-full h-full min-h-[260px]">
                    <Image
                      src={uploadedPhoto}
                      alt="Uploaded headshot"
                      fill
                      className="object-contain rounded-xl"
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-[#0A0A0A]/60 rounded-xl flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-10 w-10 rounded-full border-2 border-[#E50914] border-t-transparent animate-spin" />
                          <span className="text-sm text-white/70">Analyzing face...</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-4 h-16 w-16 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                      <Upload className="h-7 w-7 text-white/40" />
                    </div>
                    <p className="text-white/60 font-medium mb-1">
                      Drag & drop your headshot here
                    </p>
                    <p className="text-white/30 text-sm">or click to browse</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Analysis steps */}
              <div className="space-y-3">
                {analysisSteps.map((step, i) => (
                  <div
                    key={step.label}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500',
                      step.done
                        ? 'border-emerald-500/20 bg-emerald-500/[0.06]'
                        : 'border-white/[0.06] bg-white/[0.02]'
                    )}
                  >
                    <div
                      className={cn(
                        'h-6 w-6 rounded-full flex items-center justify-center transition-all duration-500',
                        step.done ? 'bg-emerald-500 text-white' : 'bg-white/[0.06] text-white/30'
                      )}
                    >
                      {step.done ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <span className="text-xs">{i + 1}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-sm transition-colors',
                        step.done ? 'text-emerald-400' : 'text-white/40'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={!uploadedPhoto || isAnalyzing}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-300',
                  uploadedPhoto && !isAnalyzing
                    ? 'bg-[#E50914] hover:bg-[#F6121D] text-white hover:shadow-[0_0_30px_rgba(229,9,20,0.25)] cursor-pointer'
                    : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                )}
              >
                <Sparkles className="h-5 w-5" />
                Generate AI Version
              </button>
            </div>

            {/* Result preview */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 flex flex-col items-center justify-center min-h-[480px]">
              {generated ? (
                <div className="w-full space-y-6">
                  <h3 className="text-lg font-semibold text-center mb-4">Before & After</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Before */}
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/[0.06]">
                      <Image
                        src={uploadedPhoto!}
                        alt="Original"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                        <span className="text-xs font-medium text-white/80">Original</span>
                      </div>
                    </div>
                    {/* After */}
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#E50914]/20">
                      <Image
                        src={uploadedPhoto!}
                        alt="AI Generated"
                        fill
                        className="object-cover"
                        style={{ filter: 'saturate(1.3) contrast(1.15) brightness(0.95)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#E50914]/20 via-transparent to-[#E50914]/[0.05]" />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                        <span className="text-xs font-medium text-[#E50914]">AI Generated</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-sm font-medium transition-all">
                      <Download className="h-4 w-4" /> Download
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-sm font-medium transition-all">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4 h-20 w-20 mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <UserCircle className="h-10 w-10 text-white/20" />
                  </div>
                  <p className="text-white/30 text-sm mb-1">Your AI character will appear here</p>
                  <p className="text-white/20 text-xs">Upload a photo and click generate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────── VOICE RECORDING ────────────────────── */}
      <section id="voice-section" className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400 text-xs sm:text-sm mb-4">
              <Mic className="h-3.5 w-3.5" />
              <span>Voice Capture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Record Your Voice</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Read the sample line below so our AI can capture your tone and style.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 space-y-8">
            {/* Sample text */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-2 font-medium">
                Sample Line
              </p>
              <p className="text-white/80 italic leading-relaxed text-lg">
                &ldquo;{SAMPLE_TEXT}&rdquo;
              </p>
            </div>

            {/* Waveform */}
            <div className="flex items-end justify-center gap-[3px] h-10 px-4">
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1.5 rounded-full transition-all',
                    isRecording
                      ? 'bg-[#E50914]'
                      : hasRecording
                        ? 'bg-white/20'
                        : 'bg-white/[0.06]'
                  )}
                  style={{
                    height: isRecording ? `${h}px` : hasRecording ? `${Math.random() * 20 + 4}px` : '4px',
                    transition: isRecording ? 'height 0.1s ease' : 'height 0.3s ease',
                  }}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center">
              <span className="text-2xl font-mono text-white/60">{formatTime(recordingSeconds)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleRecording}
                className={cn(
                  'flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300',
                  isRecording
                    ? 'bg-[#E50914] text-white animate-pulse'
                    : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]'
                )}
              >
                <Mic className="h-5 w-5" />
                {isRecording ? 'Stop Recording' : 'Record Your Voice'}
              </button>
              {hasRecording && (
                <button
                  onClick={togglePlayback}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  {isPlaying ? 'Pause' : 'Play Back'}
                </button>
              )}
            </div>

            {/* Voice analysis */}
            {hasRecording && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
                {[
                  { label: 'Tone', value: 'Warm Baritone' },
                  { label: 'Range', value: 'Mid-Low' },
                  { label: 'Accent', value: 'Neutral English' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center"
                  >
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-white/80">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ────────────────────── ROLE SELECTION ────────────────────── */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              What kind of presence do you want in the film?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {ROLES.map((role) => {
              const Icon = role.icon
              const isSelected = selectedRole === role.id
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    'group relative flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all duration-300 text-center',
                    isSelected
                      ? 'border-[#E50914]/40 bg-[#E50914]/[0.08] shadow-[0_0_30px_rgba(229,9,20,0.1)]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                  )}
                >
                  {/* Radio dot */}
                  <div
                    className={cn(
                      'absolute top-3 right-3 h-4 w-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center',
                      isSelected ? 'border-[#E50914] bg-[#E50914]' : 'border-white/20'
                    )}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>

                  <div
                    className={cn(
                      'h-12 w-12 rounded-xl flex items-center justify-center transition-all',
                      isSelected
                        ? 'bg-[#E50914]/20 text-[#E50914]'
                        : 'bg-white/[0.04] text-white/40 group-hover:text-white/60'
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p
                      className={cn(
                        'font-semibold text-sm transition-colors',
                        isSelected ? 'text-white' : 'text-white/70'
                      )}
                    >
                      {role.label}
                    </p>
                    <p className="text-white/30 text-xs mt-1">{role.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ────────────────────── MY PORTFOLIO ────────────────────── */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">My Portfolio</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Your generated appearances across CINEGEN films.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PORTFOLIO_PLACEHOLDERS.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                {/* Placeholder thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center">
                  <Film className="h-8 w-8 text-white/10" />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/20">
                      {item.role}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">{item.character}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium transition-all text-white/60 hover:text-white">
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium transition-all text-white/60 hover:text-white">
                      <Share2 className="h-3.5 w-3.5" /> Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────── RIGHTS & CONSENT ────────────────────── */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {/* Expandable header */}
            <button
              onClick={() => setRightsOpen((o) => !o)}
              className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#E50914]/10 flex items-center justify-center text-[#E50914]">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Rights & Consent</h3>
                  <p className="text-white/40 text-sm">AI likeness usage and your rights</p>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-white/30 transition-transform duration-300',
                  rightsOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Expandable content */}
            <div
              className={cn(
                'overflow-hidden transition-all duration-500',
                rightsOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-8 pb-8 space-y-6 border-t border-white/[0.06] pt-6">
                <div className="space-y-4 text-sm text-white/50 leading-relaxed">
                  <p>
                    When you upload your photo or voice recording to CINEGEN, our AI processes your
                    likeness to generate a digital character based on your appearance. Here is what
                    you should know:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-2">
                    <li>
                      Your original photos and recordings are encrypted and stored securely.
                    </li>
                    <li>
                      AI-generated likenesses are used only within films you authorize.
                    </li>
                    <li>
                      You retain the right to request deletion of your data at any time.
                    </li>
                    <li>
                      Generated characters cannot be used by other users without your explicit
                      permission.
                    </li>
                    <li>
                      You may revoke consent at any time through your account settings.
                    </li>
                  </ul>
                </div>

                {/* Consent checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <button
                    onClick={() => setConsentChecked((c) => !c)}
                    className={cn(
                      'mt-0.5 h-5 w-5 rounded flex-shrink-0 border flex items-center justify-center transition-all duration-300',
                      consentChecked
                        ? 'bg-[#E50914] border-[#E50914]'
                        : 'border-white/20 bg-white/[0.03] group-hover:border-white/40'
                    )}
                  >
                    {consentChecked && <Check className="h-3 w-3 text-white" />}
                  </button>
                  <span className="text-sm text-white/60 leading-relaxed">
                    I consent to AI generation of my likeness for CINEGEN productions. I understand
                    that I may revoke this consent at any time.
                  </span>
                </label>

                {/* Terms link */}
                <Link
                  href="/legal/terms"
                  className="inline-flex items-center gap-1.5 text-sm text-[#E50914] hover:text-[#F6121D] transition-colors"
                >
                  Read full Terms & Conditions
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-16" />
    </div>
  )
}
