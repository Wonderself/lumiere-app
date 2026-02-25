import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TASK_STATUS_LABELS,
  TASK_TYPE_LABELS,
  PHASE_LABELS,
} from '@/lib/constants'
import { formatPrice, getStatusColor } from '@/lib/utils'
import { Star, Lock, ChevronRight, ChevronDown } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Tâches Disponibles' }

type SearchParams = {
  film?: string
  type?: string
  difficulty?: string
  status?: string
  minPrice?: string
  maxPrice?: string
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  const params = await searchParams

  const tasks = await prisma.task.findMany({
    where: {
      ...(params.film ? { filmId: params.film } : {}),
      ...(params.type ? { type: params.type as never } : {}),
      ...(params.difficulty ? { difficulty: params.difficulty as never } : {}),
      status: (params.status as never) || { in: ['AVAILABLE', 'CLAIMED', 'VALIDATED'] },
      ...(params.minPrice ? { priceEuros: { gte: parseFloat(params.minPrice) } } : {}),
      ...(params.maxPrice ? { priceEuros: { lte: parseFloat(params.maxPrice) } } : {}),
    },
    include: {
      film: { select: { id: true, title: true, slug: true } },
      phase: { select: { phaseName: true } },
      claimedBy: { select: { id: true, displayName: true } },
    },
    orderBy: [{ status: 'asc' }, { priceEuros: 'desc' }, { createdAt: 'desc' }],
    take: 50,
  })

  const films = await prisma.film.findMany({
    where: { isPublic: true },
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  })

  const getDifficultyStars = (difficulty: string) => {
    const count = { EASY: 1, MEDIUM: 2, HARD: 3, EXPERT: 4 }[difficulty] || 1
    return Array.from({ length: 4 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < count ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-200'}`}
      />
    ))
  }

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 font-playfair">
            Marketplace de Tâches
          </h1>
          <p className="text-gray-500">{tasks.length} tâche{tasks.length > 1 ? 's' : ''} trouvée{tasks.length > 1 ? 's' : ''}</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Disponible</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> En cours</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /> Validée</span>
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-7 sm:rounded-2xl rounded-xl border border-gray-200/80 bg-white shadow-sm">
        <form method="GET" className="flex flex-wrap gap-4 w-full items-center">
          <div className="relative">
            <select
              name="film"
              defaultValue={params.film || ''}
              className="h-10 appearance-none rounded-xl border border-gray-200 bg-[#FAFAF8] pl-3 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]/40 transition-all duration-300 cursor-pointer"
            >
              <option value="">Tous les films</option>
              {films.map((f) => (
                <option key={f.id} value={f.id}>{f.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              name="difficulty"
              defaultValue={params.difficulty || ''}
              className="h-10 appearance-none rounded-xl border border-gray-200 bg-[#FAFAF8] pl-3 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]/40 transition-all duration-300 cursor-pointer"
            >
              <option value="">Toutes difficultés</option>
              <option value="EASY">Facile</option>
              <option value="MEDIUM">Moyen</option>
              <option value="HARD">Difficile</option>
              <option value="EXPERT">Expert</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              name="status"
              defaultValue={params.status || ''}
              className="h-10 appearance-none rounded-xl border border-gray-200 bg-[#FAFAF8] pl-3 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]/40 transition-all duration-300 cursor-pointer"
            >
              <option value="">Disponibles & En cours</option>
              <option value="AVAILABLE">Disponibles</option>
              <option value="CLAIMED">En cours</option>
              <option value="VALIDATED">Validées</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              name="minPrice"
              defaultValue={params.minPrice || ''}
              className="h-10 appearance-none rounded-xl border border-gray-200 bg-[#FAFAF8] pl-3 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]/40 transition-all duration-300 cursor-pointer"
            >
              <option value="">Prix min</option>
              <option value="50">50+</option>
              <option value="100">100+</option>
              <option value="500">500</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>

          <Button type="submit" variant="outline" size="sm" className="h-10 rounded-xl bg-white border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-300">
            Filtrer
          </Button>

          <Link href="/tasks">
            <Button variant="ghost" size="sm" className="h-10 rounded-xl text-gray-400 hover:text-gray-600 transition-all duration-300">Réinitialiser</Button>
          </Link>
        </form>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-24 text-gray-400 bg-white sm:rounded-3xl rounded-2xl border border-gray-100 shadow-sm">
          <Star className="h-16 w-16 mx-auto mb-4 text-gray-200" />
          <p className="text-xl text-gray-500">Aucune tâche trouvée</p>
          <p className="text-sm mt-2 text-gray-400">Modifiez vos filtres ou revenez plus tard.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {tasks.map((task) => (
            <Link key={task.id} href={`/tasks/${task.id}`}>
              <div className="group flex items-center gap-5 p-6 sm:p-7 sm:rounded-2xl rounded-xl border border-gray-100 bg-white hover:border-[#D4AF37]/30 hover:shadow-md shadow-sm transition-all duration-500 hover:-translate-y-[1px]">
                {/* Status indicator */}
                <div className={`w-1.5 h-12 rounded-full transition-all duration-500 group-hover:h-14 ${
                  task.status === 'AVAILABLE' ? 'bg-green-500' :
                  task.status === 'CLAIMED' ? 'bg-blue-500' :
                  task.status === 'VALIDATED' ? 'bg-[#D4AF37]' :
                  'bg-gray-200'
                }`} />

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1.5">
                    {task.status === 'LOCKED' && <Lock className="h-4 w-4 text-gray-300 mt-0.5 shrink-0" />}
                    <h3 className="font-semibold text-sm text-gray-900 group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-1">
                      {task.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-gray-400">{task.film.title}</span>
                    <span className="text-xs text-gray-200">&middot;</span>
                    <span className="text-xs text-gray-400">{PHASE_LABELS[task.phase.phaseName]}</span>
                    <Badge variant="secondary" className="text-xs rounded-lg">
                      {TASK_TYPE_LABELS[task.type]}
                    </Badge>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="hidden sm:flex items-center gap-0.5 shrink-0">
                  {getDifficultyStars(task.difficulty)}
                </div>

                {/* Status */}
                <div className="hidden sm:block shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-lg border ${getStatusColor(task.status)}`}>
                    {TASK_STATUS_LABELS[task.status]}
                  </span>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-[#D4AF37] group-hover:scale-105 transition-transform duration-300">{formatPrice(task.priceEuros)}</div>
                </div>

                <ChevronRight className="h-5 w-5 text-gray-200 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
