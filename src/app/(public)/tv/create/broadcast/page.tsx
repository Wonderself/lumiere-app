'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Radio,
  Globe,
  Calendar,
  Clock,
  Tag,
  DollarSign,
  Share2,
  Upload,
  Play,
  Tv,
  Repeat,
  ImageIcon,
  Send,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Rocket,
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

const CHANNELS = [
  { id: 'cinegen-main', label: 'CineGen Main', desc: 'Primary broadcast channel', viewers: '12.4K' },
  { id: 'cinegen-live', label: 'CineGen Live', desc: 'Live streaming channel', viewers: '8.2K' },
  { id: 'cinegen-indie', label: 'CineGen Indie', desc: 'Independent creator channel', viewers: '3.7K' },
  { id: 'cinegen-prime', label: 'CineGen Prime', desc: 'Premium content channel', viewers: '21.1K' },
]

const PRICING_OPTIONS = [
  { id: 'free', label: 'Free', desc: 'Available to all viewers', price: '$0' },
  { id: 'ad-supported', label: 'Ad-Supported', desc: 'Free with ad breaks', price: '$0 + ads' },
  { id: 'ppv-low', label: 'Pay-Per-View', desc: 'One-time access fee', price: '$2.99' },
  { id: 'ppv-high', label: 'Premium PPV', desc: 'Premium one-time access', price: '$9.99' },
]

const SOCIAL_PLATFORMS = [
  { id: 'twitter', label: 'Twitter / X', icon: Twitter, color: 'hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-400' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'hover:bg-blue-600/10 hover:border-blue-600/30 hover:text-blue-400' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'hover:bg-pink-500/10 hover:border-pink-500/30 hover:text-pink-400' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400' },
]

const RECURRING_OPTIONS = [
  { id: 'none', label: 'One-time' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'biweekly', label: 'Bi-weekly' },
  { id: 'monthly', label: 'Monthly' },
]

const FAQS = [
  { q: 'Can I schedule episodes in advance?', a: 'Yes! Set a future date and time, and your episode will automatically go live at the scheduled moment. You can also set recurring schedules for series.' },
  { q: 'What is Pay-Per-View?', a: 'Pay-Per-View allows you to charge viewers a one-time fee to access your episode. Revenue is split between you and the platform.' },
  { q: 'Can I go live instead of scheduling?', a: 'Absolutely. Use the "Go Live Now" button to start broadcasting immediately. The countdown timer will appear for your audience.' },
  { q: 'How do social sharing links work?', a: 'Sharing generates unique links for each platform, optimized with preview cards, hashtags, and descriptions to maximize engagement.' },
]

export default function TvBroadcastPage() {
  const [episodeTitle, setEpisodeTitle] = useState('')
  const [episodeDesc, setEpisodeDesc] = useState('')
  const [episodeTags, setEpisodeTags] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [selectedPricing, setSelectedPricing] = useState('free')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [recurring, setRecurring] = useState('none')
  const [thumbnailUploaded, setThumbnailUploaded] = useState(false)
  const [sharedPlatforms, setSharedPlatforms] = useState<string[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [goingLive, setGoingLive] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const toggleShare = (id: string) => {
    setSharedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handlePublish = () => {
    setIsPublishing(true)
    setTimeout(() => {
      setIsPublishing(false)
      setIsPublished(true)
    }, 3000)
  }

  const handleGoLive = () => {
    setGoingLive(true)
    setCountdown(10)
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current) }
  }, [])

  const isReady = episodeTitle && selectedChannel && selectedPricing

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
            Step 7 of 7
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center">
              <Radio className="h-6 w-6 text-[#2563EB]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              <span className="text-[#2563EB]">Broadcast</span> Your Show
            </h1>
          </div>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
            The final step. Schedule your episode, choose a channel, set pricing, and go live. Share with the world and build your audience.
          </p>
        </div>
      </section>

      <div className="px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Main Content ── */}
          <div className="lg:col-span-3 space-y-8">
            {/* Episode Metadata */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Episode Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Episode Title</label>
                  <input
                    type="text"
                    value={episodeTitle}
                    onChange={e => setEpisodeTitle(e.target.value)}
                    placeholder="Enter episode title..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-3.5 text-lg font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Description</label>
                  <textarea
                    value={episodeDesc}
                    onChange={e => setEpisodeDesc(e.target.value)}
                    placeholder="What's this episode about?"
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-3.5 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-[#2563EB]/50 transition-colors resize-y leading-relaxed"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block flex items-center gap-1.5">
                    <Tag className="h-3 w-3" /> Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={episodeTags}
                    onChange={e => setEpisodeTags(e.target.value)}
                    placeholder="comedy, talk show, entertainment..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Thumbnail</h2>
              {!thumbnailUploaded ? (
                <button
                  onClick={() => setThumbnailUploaded(true)}
                  className="w-full aspect-video rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] flex flex-col items-center justify-center gap-3 hover:border-[#2563EB]/30 hover:bg-[#2563EB]/[0.02] transition-all duration-300"
                >
                  <Upload className="h-8 w-8 text-white/15" />
                  <span className="text-sm text-white/30">Click to upload thumbnail</span>
                  <span className="text-[10px] text-white/15">16:9 recommended - 1920x1080</span>
                </button>
              ) : (
                <div className="relative aspect-video rounded-xl bg-gradient-to-br from-[#2563EB]/20 to-[#050A15] border border-white/[0.06] flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-10 w-10 text-[#2563EB]/40 mx-auto mb-2" />
                    <p className="text-xs text-white/40">Thumbnail uploaded</p>
                  </div>
                  <button
                    onClick={() => setThumbnailUploaded(false)}
                    className="absolute top-3 right-3 text-[10px] text-white/30 hover:text-white/60 px-2 py-1 rounded bg-white/[0.06]"
                  >
                    Replace
                  </button>
                </div>
              )}
            </div>

            {/* Channel Selection */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Channel</h2>
              <div className="grid grid-cols-2 gap-3">
                {CHANNELS.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch.id)}
                    className={cn(
                      'rounded-xl border p-4 text-left transition-all duration-300',
                      selectedChannel === ch.id
                        ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={cn('text-sm font-bold', selectedChannel === ch.id ? 'text-[#2563EB]' : 'text-white/70')}>{ch.label}</h3>
                      {selectedChannel === ch.id && <Check className="h-4 w-4 text-[#2563EB]" />}
                    </div>
                    <p className="text-[10px] text-white/30 mb-1">{ch.desc}</p>
                    <p className="text-[10px] text-white/20 flex items-center gap-1">
                      <Globe className="h-3 w-3" /> {ch.viewers} viewers
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Schedule</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2563EB]/50 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2563EB]/50 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block flex items-center gap-1.5">
                    <Repeat className="h-3 w-3" /> Recurring
                  </label>
                  <select
                    value={recurring}
                    onChange={e => setRecurring(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
                  >
                    {RECURRING_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id} className="bg-[#0A1628] text-white">{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Pricing</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRICING_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedPricing(opt.id)}
                    className={cn(
                      'rounded-xl border p-4 text-left transition-all duration-300',
                      selectedPricing === opt.id
                        ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                    )}
                  >
                    <p className={cn('text-lg font-black mb-1', selectedPricing === opt.id ? 'text-[#2563EB]' : 'text-white/70')}>{opt.price}</p>
                    <h3 className="text-xs font-bold text-white/60 mb-0.5">{opt.label}</h3>
                    <p className="text-[9px] text-white/25">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Social Sharing */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="h-4 w-4 text-[#2563EB]" />
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">Share</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SOCIAL_PLATFORMS.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => toggleShare(platform.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300',
                      sharedPlatforms.includes(platform.id)
                        ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08] text-[#2563EB]'
                        : cn('border-white/[0.06] bg-white/[0.02] text-white/40', platform.color)
                    )}
                  >
                    <platform.icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{platform.label}</span>
                    {sharedPlatforms.includes(platform.id) && <Check className="h-3 w-3 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Publish & Go Live */}
            <div className="rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/[0.03] p-6">
              {isPublished ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">Episode Published!</h3>
                  <p className="text-sm text-white/40 mb-4">Your episode is now live on {CHANNELS.find(c => c.id === selectedChannel)?.label || 'your channel'}.</p>
                  <Link
                    href="/tv"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-all"
                  >
                    <Tv className="h-4 w-4" />
                    View on TV
                  </Link>
                </div>
              ) : goingLive ? (
                <div className="text-center py-6">
                  <div className="w-24 h-24 rounded-full border-4 border-[#2563EB]/30 flex items-center justify-center mx-auto mb-4">
                    <span className={cn(
                      'text-4xl font-black transition-colors',
                      countdown === 0 ? 'text-red-400' : 'text-[#2563EB]'
                    )}>
                      {countdown === 0 ? 'LIVE' : countdown}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {countdown === 0 ? "You're Live!" : 'Going Live In...'}
                  </h3>
                  <p className="text-xs text-white/40">{countdown === 0 ? 'Broadcasting to your audience now' : 'Prepare yourself'}</p>
                  {countdown === 0 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold text-red-400">LIVE</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handlePublish}
                    disabled={!isReady || isPublishing}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all duration-300',
                      isPublishing
                        ? 'bg-[#2563EB]/30 text-white/50 cursor-wait'
                        : !isReady
                          ? 'bg-white/5 text-white/20 cursor-not-allowed'
                          : 'bg-[#2563EB] text-white hover:bg-[#3B82F6] hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]'
                    )}
                  >
                    {isPublishing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Publish Episode
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleGoLive}
                    disabled={!isReady}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold border transition-all duration-300',
                      !isReady
                        ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed'
                        : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                    )}
                  >
                    <Rocket className="h-4 w-4" />
                    Go Live Now
                  </button>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Link href="/tv/create/editing" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Previous Step
              </Link>
              <Link
                href="/tv/create"
                className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                Back to Create Hub
                <ChevronRight className="h-4 w-4" />
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
                      step.num === 7 ? 'bg-[#2563EB]/[0.12] border border-[#2563EB]/30' : 'hover:bg-white/[0.03]'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      step.num === 7 ? 'bg-[#2563EB] text-white' : step.num < 7 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-white/30'
                    )}>
                      {step.num < 7 ? <Check className="h-3 w-3" /> : step.num}
                    </div>
                    <span className={cn('text-xs font-medium', step.num === 7 ? 'text-[#2563EB]' : step.num < 7 ? 'text-emerald-400/60' : 'text-white/30')}>
                      {step.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Broadcast Summary */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Broadcast Summary</h3>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Title</span>
                  <span className="text-white/70 truncate ml-2 max-w-[120px]">{episodeTitle || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Channel</span>
                  <span className="text-white/70">{selectedChannel ? CHANNELS.find(c => c.id === selectedChannel)?.label.split(' ').pop() : 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Pricing</span>
                  <span className="text-white/70">{PRICING_OPTIONS.find(p => p.id === selectedPricing)?.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Schedule</span>
                  <span className="text-white/70">{scheduleDate || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Recurring</span>
                  <span className="text-white/70 capitalize">{recurring}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Thumbnail</span>
                  <span className={thumbnailUploaded ? 'text-emerald-400' : 'text-white/30'}>{thumbnailUploaded ? 'Uploaded' : 'Missing'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Shared</span>
                  <span className="text-white/70">{sharedPlatforms.length} platforms</span>
                </div>
              </div>
            </div>

            {/* Readiness */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Readiness</h3>
              <div className="space-y-2">
                {[
                  { label: 'Episode title', done: !!episodeTitle },
                  { label: 'Channel selected', done: !!selectedChannel },
                  { label: 'Pricing set', done: !!selectedPricing },
                  { label: 'Thumbnail uploaded', done: thumbnailUploaded },
                  { label: 'Description added', done: episodeDesc.length > 10 },
                  { label: 'Schedule set', done: !!scheduleDate },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    {item.done ? <Check className="h-3 w-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-white/20" />}
                    <span className={item.done ? 'text-white/60' : 'text-white/25'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
