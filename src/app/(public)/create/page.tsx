'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Lock, Check, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CREATE_STEPS } from '@/components/create/create-steps'
import { useCreateProgress } from '@/components/create/use-create-progress'

/* ── Animated golden border keyframes (injected once) ── */
const GOLDEN_KEYFRAMES = `
@keyframes goldenBorderRotate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
`

export default function CreatePage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { completedSteps, loaded } = useCreateProgress()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  function updateScrollState() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector<HTMLElement>('[data-card]')?.offsetWidth || 340
    el.scrollBy({ left: dir === 'left' ? -cardWidth - 16 : cardWidth + 16, behavior: 'smooth' })
  }

  function isStepUnlocked(stepId: string) {
    const idx = CREATE_STEPS.findIndex((s) => s.id === stepId)
    if (idx === 0) return true
    for (let i = 0; i < idx; i++) {
      if (!completedSteps.includes(CREATE_STEPS[i].id)) return false
    }
    return true
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <style dangerouslySetInnerHTML={{ __html: GOLDEN_KEYFRAMES }} />

      {/* ── Hero ── */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#E50914]/[0.04] blur-[120px]" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-white/50 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#E50914]" />
            AI-Powered Film Production
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
            Create Your{' '}
            <span className="text-[#E50914]">Movie</span>
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Step-by-step, we guide you from scriptwriting to publishing your film.
            Bring your vision to life with the most advanced AI technology.
          </p>
        </div>
      </section>

      {/* ── Carousel ── */}
      <section className="relative pb-20 md:pb-28">
        {/* Scroll arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Cards container */}
        <div
          ref={scrollRef}
          className="flex gap-5 px-4 sm:px-8 lg:px-16 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {CREATE_STEPS.map((step) => {
            const unlocked = loaded ? isStepUnlocked(step.id) : step.number === 1
            const completed = completedSteps.includes(step.id)

            return (
              <Link
                key={step.id}
                href={step.href}
                data-card
                className={cn(
                  'group relative flex-shrink-0 snap-start rounded-xl overflow-hidden transition-all duration-500',
                  'w-[280px] sm:w-[320px] md:w-[340px]',
                  'hover:scale-[1.03]',
                )}
              >
                {/* Animated golden border on hover */}
                <div
                  className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, #C4A030, #FFD700, #C4A030, #B8860B, #C4A030)',
                    backgroundSize: '300% 300%',
                    animation: 'goldenBorderRotate 3s ease infinite',
                  }}
                />

                {/* Card inner */}
                <div className="relative bg-[#111] rounded-xl overflow-hidden z-20 m-[1px]">
                  {/* Image */}
                  <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
                    <Image
                      src={step.unsplashImage}
                      alt={step.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="340px"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent" />

                    {/* Step number badge */}
                    <div className="absolute top-3 left-3 z-10">
                      {completed ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                          <Check className="h-4 w-4 text-emerald-400" />
                        </div>
                      ) : !unlocked ? (
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <Lock className="h-3.5 w-3.5 text-white/30" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-xs font-bold text-[#E50914]">
                          {step.number}
                        </div>
                      )}
                    </div>

                    {/* Icon badge */}
                    <div className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-white/70" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#E50914] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed mb-5 line-clamp-2">
                      {step.description}
                    </p>

                    {/* CTA button */}
                    <div
                      className={cn(
                        'flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300',
                        unlocked
                          ? 'bg-[#E50914] text-white group-hover:bg-[#FF2D2D] group-hover:shadow-[0_0_20px_rgba(229,9,20,0.3)]'
                          : 'bg-white/5 text-white/30 border border-white/[0.06]'
                      )}
                    >
                      {!unlocked && <Lock className="h-3.5 w-3.5" />}
                      {step.cta}
                      {unlocked && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}

          {/* Publish card */}
          <div
            data-card
            className="group relative flex-shrink-0 snap-start rounded-xl overflow-hidden w-[280px] sm:w-[320px] md:w-[340px]"
          >
            <div className="relative bg-gradient-to-br from-[#E50914]/20 to-[#111] rounded-xl overflow-hidden border border-[#E50914]/20 h-full flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
              <div className="w-16 h-16 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 flex items-center justify-center mb-5">
                <Sparkles className="h-8 w-8 text-[#E50914]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Publish Your Film</h3>
              <p className="text-sm text-white/40 mb-6 max-w-[240px]">
                Complete all 7 steps and publish your AI-generated film to the world.
              </p>
              <div className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-white/5 text-white/30 border border-white/[0.06]">
                <Lock className="h-3.5 w-3.5 inline mr-2" />
                Complete All Steps
              </div>
            </div>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {CREATE_STEPS.map((step) => {
            const completed = completedSteps.includes(step.id)
            return (
              <Link
                key={step.id}
                href={step.href}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  completed
                    ? 'bg-emerald-400 w-4'
                    : 'bg-white/15 hover:bg-white/30'
                )}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}
