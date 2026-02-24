'use client'

import Link from 'next/link'
import { Pen, Vote, Trophy, Clapperboard, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const creatorActions = [
  {
    icon: Pen,
    title: 'Ecrire un Scenario',
    description: 'Soumettez votre histoire au vote de la communaute',
    href: '/community/scenarios',
    gradient: 'from-amber-500/30 via-yellow-600/20 to-amber-900/30',
    glow: 'rgba(212, 175, 55, 0.15)',
    iconBg: 'from-amber-500 to-yellow-600',
    accent: '#D4AF37',
    bgImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=60',
  },
  {
    icon: Vote,
    title: 'Voter',
    description: 'Choisissez les prochains films a produire',
    href: '/community',
    gradient: 'from-blue-500/30 via-indigo-600/20 to-blue-900/30',
    glow: 'rgba(59, 130, 246, 0.15)',
    iconBg: 'from-blue-500 to-indigo-600',
    accent: '#3B82F6',
    bgImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=60',
  },
  {
    icon: Trophy,
    title: 'Concours',
    description: 'Participez aux concours de bandes-annonces',
    href: '/community/contests',
    gradient: 'from-purple-500/30 via-violet-600/20 to-purple-900/30',
    glow: 'rgba(139, 92, 246, 0.15)',
    iconBg: 'from-purple-500 to-violet-600',
    accent: '#8B5CF6',
    bgImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=60',
  },
  {
    icon: Clapperboard,
    title: 'Produire',
    description: 'Rejoignez la production via des micro-taches',
    href: '/tasks',
    gradient: 'from-emerald-500/30 via-green-600/20 to-emerald-900/30',
    glow: 'rgba(16, 185, 129, 0.15)',
    iconBg: 'from-emerald-500 to-green-600',
    accent: '#10B981',
    bgImage: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&q=60',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function CreatorBar() {
  return (
    <section className="px-4 md:px-12 mb-12 mt-2">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#A0831A] flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-black" />
        </div>
        <div>
          <h2
            className="text-xl md:text-2xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Participez a la Creation
          </h2>
          <p className="text-xs text-white/40 mt-0.5">Devenez acteur du cinema de demain</p>
        </div>
      </div>

      {/* Cards grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {creatorActions.map((action) => (
          <motion.div key={action.title} variants={cardVariants}>
            <Link
              href={action.href}
              className="group relative block rounded-2xl overflow-hidden h-[200px] md:h-[220px]"
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${action.bgImage})` }}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/65 group-hover:bg-black/50 transition-colors duration-500" />

              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${action.gradient} opacity-80`} />

              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: `inset 0 0 60px ${action.glow}` }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${action.accent}, transparent)` }}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-5">
                {/* Icon */}
                <div
                  className={`h-11 w-11 rounded-xl bg-gradient-to-br ${action.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <action.icon className="h-5 w-5 text-white" />
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="text-base md:text-lg font-bold text-white mb-1 group-hover:text-white transition-colors"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {action.title}
                  </h3>
                  <p className="text-[11px] md:text-xs text-white/50 group-hover:text-white/70 leading-relaxed transition-colors line-clamp-2">
                    {action.description}
                  </p>

                  {/* CTA arrow */}
                  <div className="flex items-center gap-1.5 mt-2.5 text-xs font-medium transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                    style={{ color: action.accent }}
                  >
                    <span>Explorer</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Bottom border glow */}
              <div
                className="absolute bottom-0 left-4 right-4 h-[1px] opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                style={{ background: action.accent }}
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
