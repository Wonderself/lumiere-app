'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TvVoteButtonProps {
  showSlug: string
  initialUpVotes?: number
  initialDownVotes?: number
  className?: string
}

/**
 * Client-side vote button for TV shows.
 * Persists votes to localStorage (key: `cinegen-tv-vote-${showSlug}`).
 * Mirrors the FilmVoteButton UI but with the TV blue theme.
 */
export function TvVoteButton({
  showSlug,
  initialUpVotes = 0,
  initialDownVotes = 0,
  className,
}: TvVoteButtonProps) {
  const [upVotes, setUpVotes] = useState(initialUpVotes)
  const [downVotes, setDownVotes] = useState(initialDownVotes)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [mounted, setMounted] = useState(false)

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(`cinegen-tv-vote-${showSlug}`)
      if (stored) {
        const parsed = JSON.parse(stored) as { vote: 'up' | 'down' | null; up: number; down: number }
        setUserVote(parsed.vote)
        setUpVotes(parsed.up)
        setDownVotes(parsed.down)
      }
    } catch {
      /* SSR / storage unavailable — ignore */
    }
  }, [showSlug])

  const persist = useCallback(
    (vote: 'up' | 'down' | null, up: number, down: number) => {
      try {
        localStorage.setItem(
          `cinegen-tv-vote-${showSlug}`,
          JSON.stringify({ vote, up, down })
        )
      } catch {
        /* storage unavailable — ignore */
      }
    },
    [showSlug]
  )

  const handleVote = useCallback(
    (direction: 'up' | 'down') => {
      setUserVote(prev => {
        const isToggleOff = prev === direction
        const newVote = isToggleOff ? null : direction

        setUpVotes(v => {
          const base = v - (prev === 'up' ? 1 : 0)
          const next = base + (newVote === 'up' ? 1 : 0)
          setDownVotes(d => {
            const dBase = d - (prev === 'down' ? 1 : 0)
            const dNext = dBase + (newVote === 'down' ? 1 : 0)
            // Persist with the final values
            setTimeout(() => persist(newVote, next, dNext), 0)
            return dNext
          })
          return next
        })

        if (isToggleOff) {
          toast.info('Vote retiré')
        } else if (direction === 'up') {
          toast.success('Vote positif enregistré !')
        } else {
          toast.success('Vote négatif enregistré')
        }

        return newVote
      })
    },
    [persist]
  )

  if (!mounted) {
    // Render a skeleton to avoid layout shift before hydration
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="h-9 w-20 rounded-lg bg-white/[0.04] border border-white/10 animate-pulse" />
        <div className="h-9 w-20 rounded-lg bg-white/[0.04] border border-white/10 animate-pulse" />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Upvote */}
      <button
        onClick={() => handleVote('up')}
        title="Voter positivement"
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border',
          userVote === 'up'
            ? 'bg-[#2563EB]/20 border-[#2563EB]/50 text-[#2563EB] shadow-[0_0_12px_rgba(37,99,235,0.2)]'
            : 'bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/[0.08] hover:text-white/80 hover:border-white/20'
        )}
      >
        <ThumbsUp className={cn('h-4 w-4', userVote === 'up' && 'fill-[#2563EB]')} />
        <span>{upVotes.toLocaleString()}</span>
      </button>

      {/* Downvote */}
      <button
        onClick={() => handleVote('down')}
        title="Voter négativement"
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border',
          userVote === 'down'
            ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
            : 'bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/[0.08] hover:text-white/80 hover:border-white/20'
        )}
      >
        <ThumbsDown className={cn('h-4 w-4', userVote === 'down' && 'fill-red-400')} />
        <span>{downVotes.toLocaleString()}</span>
      </button>
    </div>
  )
}
