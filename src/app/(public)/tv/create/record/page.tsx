'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Video,
  Camera,
  Pause,
  Square,
  RotateCcw,
  Monitor,
  Maximize2,
  SplitSquareHorizontal,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Clock,
  Play,
  Circle,
  ChevronLeft,
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

const CAMERA_ANGLES = [
  { id: 'wide', label: 'Wide Shot', icon: Maximize2, desc: 'Full studio view' },
  { id: 'medium', label: 'Medium Shot', icon: Monitor, desc: 'Waist-up framing' },
  { id: 'closeup', label: 'Close-up', icon: Camera, desc: 'Face and shoulders' },
  { id: 'split', label: 'Split Screen', icon: SplitSquareHorizontal, desc: 'Multiple feeds' },
]

const TELEPROMPTER_SCRIPTS = [
  'Welcome to the show! Tonight we have an incredible lineup for you. First up, let\'s talk about the biggest stories of the week...',
  'And we\'re back! Before the break, we were discussing the latest developments. Now, I want to bring in our expert panel...',
  'That\'s all the time we have for tonight. Thank you so much to our guests and to you, our amazing audience. See you next time!',
]

const FAQS = [
  { q: 'What camera angles work best for my show?', a: 'Talk shows typically use medium shots for hosts and close-ups for guests. Game shows benefit from wide shots to capture the set. Drama uses a mix of all angles for cinematic effect.' },
  { q: 'Can I record multiple takes?', a: 'Yes! The take counter tracks your recordings. You can record as many takes as needed and select the best one during the editing step.' },
  { q: 'How does the teleprompter work?', a: 'The teleprompter displays your script text at an adjustable scroll speed. You can pause, rewind, or skip ahead as needed during recording.' },
  { q: 'What about audio levels?', a: 'The audio level display shows real-time levels. Keep the green zone active and avoid hitting the red zone to ensure clear audio.' },
]

export default function TvRecordPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedAngle, setSelectedAngle] = useState('wide')
  const [takeCount, setTakeCount] = useState(1)
  const [recordingTime, setRecordingTime] = useState(0)
  const [teleprompterIndex, setTeleprompterIndex] = useState(0)
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(2)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [audioLevels, setAudioLevels] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0])
  const [showTeleprompter, setShowTeleprompter] = useState(true)
  const [timelineSegments, setTimelineSegments] = useState<{ angle: string; duration: number }[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── Recording Timer ── */
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRecording, isPaused])

  /* ── Simulated Audio Levels ── */
  useEffect(() => {
    if (isRecording && !isPaused && isMicOn) {
      audioRef.current = setInterval(() => {
        setAudioLevels(Array.from({ length: 8 }, () => Math.random() * 100))
      }, 150)
    } else {
      if (audioRef.current) clearInterval(audioRef.current)
      setAudioLevels([0, 0, 0, 0, 0, 0, 0, 0])
    }
    return () => { if (audioRef.current) clearInterval(audioRef.current) }
  }, [isRecording, isPaused, isMicOn])

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleRecord = () => {
    setIsRecording(true)
    setIsPaused(false)
    setRecordingTime(0)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleStop = () => {
    setTimelineSegments(prev => [...prev, { angle: selectedAngle, duration: recordingTime }])
    setIsRecording(false)
    setIsPaused(false)
    setTakeCount(prev => prev + 1)
    setRecordingTime(0)
  }

  const handleReset = () => {
    setIsRecording(false)
    setIsPaused(false)
    setRecordingTime(0)
    setTakeCount(1)
    setTimelineSegments([])
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
            Step 5 of 7
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center">
              <Video className="h-6 w-6 text-[#2563EB]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Record Your <span className="text-[#2563EB]">Episodes</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
            Step into the virtual studio. Use the teleprompter, select camera angles, and record your episodes with professional controls.
          </p>
        </div>
      </section>

      <div className="px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Main Content ── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Studio Preview */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <div className="aspect-video relative bg-gradient-to-b from-[#0A1628] to-[#050A15] flex items-center justify-center">
                {/* Camera angle overlay */}
                <div className="absolute inset-0">
                  {selectedAngle === 'wide' && (
                    <div className="w-full h-full border-4 border-dashed border-white/[0.05] m-2 rounded-lg flex items-center justify-center">
                      <span className="text-white/20 text-sm">Wide Shot - Full Studio View</span>
                    </div>
                  )}
                  {selectedAngle === 'medium' && (
                    <div className="w-2/3 h-2/3 border-4 border-dashed border-white/[0.08] rounded-lg mx-auto mt-[8%] flex items-center justify-center">
                      <span className="text-white/20 text-sm">Medium Shot - Waist Up</span>
                    </div>
                  )}
                  {selectedAngle === 'closeup' && (
                    <div className="w-1/3 h-1/2 border-4 border-dashed border-white/[0.08] rounded-lg mx-auto mt-[12%] flex items-center justify-center">
                      <span className="text-white/20 text-sm">Close-up</span>
                    </div>
                  )}
                  {selectedAngle === 'split' && (
                    <div className="flex gap-2 p-4 h-full">
                      <div className="flex-1 border-2 border-dashed border-white/[0.06] rounded-lg flex items-center justify-center">
                        <span className="text-white/15 text-xs">Feed A</span>
                      </div>
                      <div className="flex-1 border-2 border-dashed border-white/[0.06] rounded-lg flex items-center justify-center">
                        <span className="text-white/15 text-xs">Feed B</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className={cn('w-3 h-3 rounded-full', isPaused ? 'bg-amber-400' : 'bg-red-500 animate-pulse')} />
                    <span className="text-xs font-mono font-bold text-white/80">{isPaused ? 'PAUSED' : 'REC'}</span>
                    <span className="text-xs font-mono text-white/50">{formatTime(recordingTime)}</span>
                  </div>
                )}

                {/* Take counter */}
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-mono text-white/30">Take {takeCount}</span>
                </div>

                {/* Camera angle label */}
                <div className="absolute bottom-4 left-4">
                  <span className="text-[10px] px-2 py-1 rounded bg-white/[0.06] text-white/40 font-mono">
                    CAM: {CAMERA_ANGLES.find(a => a.id === selectedAngle)?.label}
                  </span>
                </div>
              </div>

              {/* Recording Controls */}
              <div className="flex items-center justify-center gap-4 p-5 border-t border-white/[0.06]">
                {!isRecording ? (
                  <button
                    onClick={handleRecord}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                  >
                    <Circle className="h-4 w-4 fill-current" />
                    Record
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handlePause}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-sm hover:bg-amber-500/30 transition-all"
                    >
                      {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                      onClick={handleStop}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/60 font-bold text-sm hover:bg-white/[0.1] transition-all"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </button>
                  </>
                )}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/30 text-sm hover:text-white/60 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>

                <div className="w-px h-8 bg-white/[0.06] mx-2" />

                {/* Audio toggles */}
                <button onClick={() => setIsMicOn(!isMicOn)} className={cn('p-2.5 rounded-lg border transition-all', isMicOn ? 'bg-[#2563EB]/10 border-[#2563EB]/30 text-[#2563EB]' : 'bg-white/[0.04] border-white/[0.06] text-white/30')}>
                  {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </button>
                <button onClick={() => setIsAudioOn(!isAudioOn)} className={cn('p-2.5 rounded-lg border transition-all', isAudioOn ? 'bg-[#2563EB]/10 border-[#2563EB]/30 text-[#2563EB]' : 'bg-white/[0.04] border-white/[0.06] text-white/30')}>
                  {isAudioOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Camera Angle Selector */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Camera Angle</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CAMERA_ANGLES.map(angle => (
                  <button
                    key={angle.id}
                    onClick={() => setSelectedAngle(angle.id)}
                    className={cn(
                      'rounded-xl border p-4 text-left transition-all duration-300',
                      selectedAngle === angle.id
                        ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                    )}
                  >
                    <angle.icon className={cn('h-5 w-5 mb-2', selectedAngle === angle.id ? 'text-[#2563EB]' : 'text-white/30')} />
                    <h3 className={cn('text-sm font-bold mb-0.5', selectedAngle === angle.id ? 'text-[#2563EB]' : 'text-white/70')}>{angle.label}</h3>
                    <p className="text-[10px] text-white/30">{angle.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Teleprompter */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">Teleprompter</h2>
                <button
                  onClick={() => setShowTeleprompter(!showTeleprompter)}
                  className="text-[10px] text-[#2563EB] hover:text-[#3B82F6] transition-colors"
                >
                  {showTeleprompter ? 'Hide' : 'Show'}
                </button>
              </div>

              {showTeleprompter && (
                <>
                  <div className="rounded-xl bg-black/40 border border-white/[0.06] p-6 mb-4 min-h-[120px]">
                    <p className="text-white/80 text-lg leading-relaxed font-mono text-center">
                      {TELEPROMPTER_SCRIPTS[teleprompterIndex]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTeleprompterIndex(Math.max(0, teleprompterIndex - 1))}
                        disabled={teleprompterIndex === 0}
                        className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 hover:text-white/60 disabled:opacity-30 transition-all"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-xs text-white/30">
                        {teleprompterIndex + 1} / {TELEPROMPTER_SCRIPTS.length}
                      </span>
                      <button
                        onClick={() => setTeleprompterIndex(Math.min(TELEPROMPTER_SCRIPTS.length - 1, teleprompterIndex + 1))}
                        disabled={teleprompterIndex === TELEPROMPTER_SCRIPTS.length - 1}
                        className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 hover:text-white/60 disabled:opacity-30 transition-all"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/30">Speed:</span>
                      {[1, 2, 3, 4].map(speed => (
                        <button
                          key={speed}
                          onClick={() => setTeleprompterSpeed(speed)}
                          className={cn(
                            'w-7 h-7 rounded-lg text-[10px] font-bold transition-all',
                            teleprompterSpeed === speed
                              ? 'bg-[#2563EB] text-white'
                              : 'bg-white/[0.04] text-white/30 hover:text-white/60'
                          )}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Audio Levels */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Audio Levels</h2>
              <div className="flex items-end justify-center gap-1.5 h-24">
                {audioLevels.map((level, i) => (
                  <div key={i} className="flex-1 max-w-[40px] flex flex-col justify-end h-full">
                    <div
                      className={cn(
                        'w-full rounded-t transition-all duration-150',
                        level > 85 ? 'bg-red-500' : level > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                      )}
                      style={{ height: `${Math.max(4, level)}%` }}
                    />
                    <div className="w-full h-1 bg-white/[0.06] rounded-b" />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-white/20">
                <span>-60dB</span>
                <span>-30dB</span>
                <span>0dB</span>
              </div>
            </div>

            {/* Episode Timeline */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Episode Timeline</h2>
              {timelineSegments.length === 0 ? (
                <div className="rounded-xl bg-white/[0.01] border border-dashed border-white/[0.06] p-8 text-center">
                  <Clock className="h-6 w-6 text-white/15 mx-auto mb-2" />
                  <p className="text-xs text-white/25">Record segments to build your timeline</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {timelineSegments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] font-bold text-white/30 w-8">#{i + 1}</span>
                      <div className="h-2 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA]" style={{ width: `${Math.min(100, (seg.duration / 60) * 100)}%` }} />
                      </div>
                      <span className="text-[10px] text-white/40 w-16 text-right">{formatTime(seg.duration)}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-white/[0.04] text-white/30">{seg.angle}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-white/25">{timelineSegments.length} segments</span>
                    <span className="text-[10px] text-white/40">Total: {formatTime(timelineSegments.reduce((s, seg) => s + seg.duration, 0))}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Link href="/tv/create/casting" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Previous Step
              </Link>
              <Link
                href="/tv/create/editing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
              >
                Next Step: Edit
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
                      step.num === 5 ? 'bg-[#2563EB]/[0.12] border border-[#2563EB]/30' : 'hover:bg-white/[0.03]'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      step.num === 5 ? 'bg-[#2563EB] text-white' : step.num < 5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-white/30'
                    )}>
                      {step.num < 5 ? <Check className="h-3 w-3" /> : step.num}
                    </div>
                    <span className={cn('text-xs font-medium', step.num === 5 ? 'text-[#2563EB]' : step.num < 5 ? 'text-emerald-400/60' : 'text-white/30')}>
                      {step.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Session Info */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Recording Session</h3>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Current Take</span>
                  <span className="text-white/70 font-mono">{takeCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Camera</span>
                  <span className="text-white/70">{CAMERA_ANGLES.find(a => a.id === selectedAngle)?.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Segments</span>
                  <span className="text-white/70">{timelineSegments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Total Recorded</span>
                  <span className="text-white/70 font-mono">{formatTime(timelineSegments.reduce((s, seg) => s + seg.duration, 0))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Mic</span>
                  <span className={isMicOn ? 'text-emerald-400' : 'text-red-400'}>{isMicOn ? 'On' : 'Off'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Status</span>
                  <span className={cn(
                    'font-medium',
                    isRecording ? (isPaused ? 'text-amber-400' : 'text-red-400') : 'text-white/30'
                  )}>
                    {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Standby'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
