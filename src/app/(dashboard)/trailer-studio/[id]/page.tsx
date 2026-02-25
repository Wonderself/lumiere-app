import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft, CheckCircle2, Clock, Loader2, Wand2,
  Film, Palette, Music, Clapperboard, Scissors, Sparkles,
  Play, Vote, ChevronRight, Coins, AlertCircle, Lock,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Projet Bande-Annonce' }

const PHASE_CONFIG: Record<string, { label: string; icon: typeof Film; color: string }> = {
  CONCEPT: { label: 'Concept', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
  SCRIPT: { label: 'Script', icon: Film, color: 'text-blue-600 bg-blue-50' },
  VISUAL_DESIGN: { label: 'Design Visuel', icon: Palette, color: 'text-purple-600 bg-purple-50' },
  STORYBOARD: { label: 'Storyboard', icon: Clapperboard, color: 'text-pink-600 bg-pink-50' },
  PRODUCTION: { label: 'Production IA', icon: Wand2, color: 'text-indigo-600 bg-indigo-50' },
  AUDIO: { label: 'Audio', icon: Music, color: 'text-green-600 bg-green-50' },
  POST_PRODUCTION: { label: 'Post-Production', icon: Scissors, color: 'text-orange-600 bg-orange-50' },
  ASSEMBLY: { label: 'Assemblage Final', icon: Play, color: 'text-red-600 bg-red-50' },
}

const TASK_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-gray-100 text-gray-500' },
  BLOCKED: { label: 'Bloqué', color: 'bg-gray-100 text-gray-400' },
  READY: { label: 'Prêt', color: 'bg-blue-100 text-blue-600' },
  GENERATING: { label: 'Génération...', color: 'bg-purple-100 text-purple-600' },
  AWAITING_CHOICE: { label: 'Choix requis', color: 'bg-amber-100 text-amber-600' },
  IN_REVIEW: { label: 'En revue', color: 'bg-orange-100 text-orange-600' },
  APPROVED: { label: 'Approuvé', color: 'bg-emerald-100 text-emerald-600' },
  REJECTED: { label: 'Rejeté', color: 'bg-red-100 text-red-600' },
  COMPLETED: { label: 'Terminé', color: 'bg-green-100 text-green-600' },
  SKIPPED: { label: 'Ignoré', color: 'bg-gray-100 text-gray-400' },
}

export default async function TrailerProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect('/login')

  const project = await prisma.trailerProject.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: [{ phase: 'asc' as never }, { order: 'asc' }] },
      choices: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!project) notFound()
  if (project.userId !== session.user.id && session.user.role !== 'ADMIN') {
    redirect('/trailer-studio')
  }

  // Group tasks by phase
  const tasksByPhase = new Map<string, typeof project.tasks>()
  for (const task of project.tasks) {
    const phase = task.phase
    if (!tasksByPhase.has(phase)) tasksByPhase.set(phase, [])
    tasksByPhase.get(phase)!.push(task)
  }

  const phases = Object.keys(PHASE_CONFIG)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link href="/trailer-studio" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#D4AF37] transition-colors mb-3">
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au studio
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
            {project.title}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {project.genre && <Badge variant="outline" className="text-xs">{project.genre}</Badge>}
            {project.style && <Badge variant="outline" className="text-xs">{project.style}</Badge>}
            {project.mood && <Badge variant="outline" className="text-xs">{project.mood}</Badge>}
            {project.duration && (
              <Badge variant="outline" className="text-xs">
                {project.duration.replace('_', ' ').replace('TEASER', 'Teaser').replace('STANDARD', 'Standard').replace('EXTENDED', 'Étendu').replace('FULL', 'Complet')}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm px-3 py-1.5 border-[#D4AF37]/20 text-[#D4AF37]">
            <Coins className="h-3.5 w-3.5 mr-1.5" />
            {project.creditsUsed}/{project.estimatedCredits} crédits
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#1A1A2E]">Progression globale</h2>
          <span className="text-sm font-bold text-[#D4AF37]">{Math.round(project.progressPct)}%</span>
        </div>
        <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] transition-all duration-500"
            style={{ width: `${project.progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>{project.completedTasks}/{project.totalTasks} tâches terminées</span>
          <span>Phase: {PHASE_CONFIG[project.currentPhase]?.label || project.currentPhase}</span>
        </div>
      </div>

      {/* Concept & Synopsis */}
      {(project.concept || project.synopsis) && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
          {project.concept && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Concept</p>
              <p className="text-sm text-[#1A1A2E] mt-1">{project.concept}</p>
            </div>
          )}
          {project.synopsis && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Synopsis</p>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{project.synopsis}</p>
            </div>
          )}
        </div>
      )}

      {/* Pending Choices */}
      {project.choices.filter(c => !c.resolvedAt).length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h2 className="text-sm font-semibold text-amber-800">
              Choix en attente ({project.choices.filter(c => !c.resolvedAt).length})
            </h2>
          </div>
          <div className="space-y-3">
            {project.choices.filter(c => !c.resolvedAt).map((choice) => {
              const options = choice.options as Array<{ id: string; label: string; description?: string }>
              return (
                <div key={choice.id} className="rounded-xl border border-amber-200 bg-white p-4">
                  <p className="text-sm font-medium text-[#1A1A2E]">{choice.question}</p>
                  {choice.category && (
                    <Badge variant="outline" className="text-[10px] mt-1 text-amber-600 border-amber-300">{choice.category}</Badge>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {options.map((opt) => (
                      <button
                        key={opt.id}
                        className="rounded-lg border border-gray-200 p-3 text-left hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all text-sm"
                      >
                        <p className="font-medium text-[#1A1A2E]">{opt.label}</p>
                        {opt.description && <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>}
                      </button>
                    ))}
                  </div>
                  {choice.isOpenToVote && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-pink-600">
                      <Vote className="h-3 w-3" />
                      Ouvert au vote communautaire
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tasks by Phase */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#1A1A2E]">Micro-tâches par phase</h2>

        {project.tasks.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <Wand2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Le projet n&apos;a pas encore été décomposé en micro-tâches</p>
            <p className="text-xs text-gray-400 mt-1">Cliquez sur &quot;Décomposer&quot; pour que l&apos;IA crée les tâches</p>
            <Button className="mt-4 bg-[#D4AF37] hover:bg-[#F0D060] text-black font-semibold">
              <Wand2 className="h-4 w-4 mr-2" />
              Décomposer en micro-tâches
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {phases.map((phase) => {
              const phaseTasks = tasksByPhase.get(phase)
              if (!phaseTasks || phaseTasks.length === 0) return null
              const phaseConfig = PHASE_CONFIG[phase]
              const PhaseIcon = phaseConfig.icon
              const completedInPhase = phaseTasks.filter(t => t.status === 'COMPLETED' || t.status === 'APPROVED' || t.status === 'SKIPPED').length
              const phaseProgress = (completedInPhase / phaseTasks.length) * 100

              return (
                <div key={phase} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                  {/* Phase header */}
                  <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${phaseConfig.color}`}>
                      <PhaseIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#1A1A2E]">{phaseConfig.label}</h3>
                        <span className="text-xs text-gray-500">{completedInPhase}/{phaseTasks.length}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 mt-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] transition-all duration-500"
                          style={{ width: `${phaseProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phase tasks */}
                  <div className="divide-y divide-gray-50">
                    {phaseTasks.map((task) => {
                      const statusConfig = TASK_STATUS_CONFIG[task.status] || TASK_STATUS_CONFIG.PENDING
                      return (
                        <div key={task.id} className="flex items-center gap-3 p-3 px-4 hover:bg-gray-50/50 transition-colors">
                          {task.status === 'COMPLETED' || task.status === 'APPROVED' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          ) : task.status === 'GENERATING' ? (
                            <Loader2 className="h-4 w-4 text-purple-500 animate-spin shrink-0" />
                          ) : task.status === 'BLOCKED' ? (
                            <Lock className="h-4 w-4 text-gray-300 shrink-0" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-300 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium ${
                              task.status === 'BLOCKED' ? 'text-gray-400' : 'text-[#1A1A2E]'
                            }`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-[10px] text-gray-400 truncate mt-0.5">{task.description}</p>
                            )}
                          </div>
                          <Badge className={`text-[10px] px-1.5 py-0.5 border-0 ${statusConfig.color}`}>
                            {statusConfig.label}
                          </Badge>
                          {task.estimatedCredits > 0 && (
                            <span className="text-[10px] text-gray-400 shrink-0">{task.estimatedCredits}cr</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
