'use client'

import Link from 'next/link'
import { Pen, Vote, Trophy, Clapperboard, ArrowRight, Sparkles } from 'lucide-react'

const creatorActions = [
  {
    icon: Pen,
    title: 'Ecrire un Scenario',
    description: 'Soumettez votre histoire au vote de la communaute',
    href: '/community/scenarios',
    gradient: 'from-[#D4AF37]/20 to-[#A0831A]/10',
    borderColor: 'border-[#D4AF37]/20 hover:border-[#D4AF37]/40',
  },
  {
    icon: Vote,
    title: 'Voter',
    description: 'Choisissez les prochains films a produire',
    href: '/community',
    gradient: 'from-[#3B82F6]/20 to-[#1D4ED8]/10',
    borderColor: 'border-[#3B82F6]/20 hover:border-[#3B82F6]/40',
  },
  {
    icon: Trophy,
    title: 'Concours',
    description: 'Participez aux concours de bandes-annonces',
    href: '/community/contests',
    gradient: 'from-[#8B5CF6]/20 to-[#6D28D9]/10',
    borderColor: 'border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40',
  },
  {
    icon: Clapperboard,
    title: 'Produire',
    description: 'Rejoignez la production via des micro-taches',
    href: '/tasks',
    gradient: 'from-[#10B981]/20 to-[#059669]/10',
    borderColor: 'border-[#10B981]/20 hover:border-[#10B981]/40',
  },
]

export function CreatorBar() {
  return (
    <section className="px-4 md:px-12 mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-[#D4AF37]" />
        <h2 className="text-lg md:text-xl font-bold text-white/90 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
          Participez a la Creation
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {creatorActions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={`group relative rounded-xl p-4 md:p-5 border ${action.borderColor} bg-gradient-to-br ${action.gradient} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden`}
          >
            {/* Icon */}
            <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center mb-3">
              <action.icon className="h-5 w-5 text-white/70" />
            </div>

            {/* Text */}
            <h3 className="text-sm font-bold text-white/90 mb-1">{action.title}</h3>
            <p className="text-[11px] text-white/40 leading-relaxed mb-3">{action.description}</p>

            {/* Arrow */}
            <div className="flex items-center gap-1 text-[11px] text-white/30 group-hover:text-[#D4AF37] transition-colors">
              <span>Explorer</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
