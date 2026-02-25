'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

// Particle canvas for cinematic background
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []
    const count = 60

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}

// Animated counter
function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2000
          const start = Date.now()
          const tick = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(tick)
          }
          tick()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end])

  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl sm:text-3xl md:text-4xl font-black text-[#D4AF37] tabular-nums font-playfair">
        {prefix}{count.toLocaleString('fr-FR')}{suffix}
      </p>
    </div>
  )
}

export function HeroManifesto({ filmCount }: { filmCount: number }) {
  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-black">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050508] to-[#0A0A0A]" />
      <ParticleCanvas />

      {/* Subtle radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }}
      />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }}
      />

      {/* Main content — centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center pt-20">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src="/images/lumiere-brothers-logo-cinema-dark.webp"
            alt="Lumiere Brothers Pictures"
            width={280}
            height={70}
            className="h-12 sm:h-14 md:h-16 w-auto object-contain mx-auto mb-14 opacity-90"
            priority
          />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight max-w-5xl mb-10"
        >
          Le premier studio de cinema{' '}
          <br className="hidden sm:block" />
          ou <span className="text-[#D4AF37]">l&apos;IA</span> produit et{' '}
          <span className="text-[#D4AF37]">la communaute</span> decide.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-lg sm:text-xl md:text-2xl text-white/40 font-light max-w-2xl mb-14 leading-relaxed"
        >
          {filmCount > 0 ? filmCount : 20} films. 1 an. 25 000&euro; par film.
          <br />
          <span className="text-white/25">Ethique. Communautaire. Revolutionnaire.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link
            href="/register"
            className="group inline-flex items-center gap-2.5 px-7 sm:px-10 py-3.5 sm:py-4 rounded-xl text-sm sm:text-[15px] font-bold text-black transition-all duration-300 hover:shadow-[0_0_60px_rgba(212,175,55,0.4)] hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)' }}
          >
            Rejoindre la revolution
            <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={() => {
              document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-[15px] font-medium text-white/60 border border-white/10 hover:border-white/25 hover:text-white/80 backdrop-blur-sm transition-all duration-300"
          >
            Decouvrir comment
          </button>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="relative z-10 border-t border-white/[0.05] bg-black/30 backdrop-blur-sm"
      >
        <div className="max-w-5xl mx-auto py-10 sm:py-12 px-6 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          <div className="text-center">
            <AnimatedCounter end={filmCount > 0 ? filmCount : 20} />
            <p className="text-[11px] text-white/25 uppercase tracking-[0.2em] mt-3 font-medium">films en pipeline</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={500} suffix="+" />
            <p className="text-[11px] text-white/25 uppercase tracking-[0.2em] mt-3 font-medium">micro-taches</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={25} prefix="" suffix="K€" />
            <p className="text-[11px] text-white/25 uppercase tracking-[0.2em] mt-3 font-medium">par film</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white/60 font-playfair">
              Paris &middot; Jerusalem
            </p>
            <p className="text-[11px] text-white/25 uppercase tracking-[0.2em] mt-3 font-medium">double ecosysteme</p>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5 text-white/15" />
        </motion.div>
      </motion.div>
    </section>
  )
}
