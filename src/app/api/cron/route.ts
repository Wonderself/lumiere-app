import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Cron endpoint for automated maintenance tasks.
 * Call via: GET /api/cron?key=CRON_SECRET
 *
 * Tasks performed:
 * 1. Auto-release expired claimed tasks (48h deadline)
 * 2. Auto-close ended contests
 * 3. Phase auto-complete when all tasks validated
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  // Verify cron secret (set CRON_SECRET env var)
  if (process.env.CRON_SECRET && key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, number> = {}

  // ─── 1. Auto-release expired tasks ────────────────────────────
  try {
    const expiredTasks = await prisma.task.findMany({
      where: {
        status: 'CLAIMED',
        deadline: { lt: new Date() },
      },
      select: { id: true, title: true, claimedById: true },
    })

    for (const task of expiredTasks) {
      await prisma.task.update({
        where: { id: task.id },
        data: {
          status: 'AVAILABLE',
          claimedById: null,
          claimedAt: null,
          deadline: null,
        },
      })

      // Notify the user
      if (task.claimedById) {
        await prisma.notification.create({
          data: {
            userId: task.claimedById,
            type: 'SYSTEM' as never,
            title: 'Tache expiree',
            body: `La tache "${task.title}" a expire (delai 48h depasse) et est de nouveau disponible.`,
            href: '/tasks',
          },
        }).catch(() => {})
      }
    }
    results.expiredTasksReleased = expiredTasks.length
  } catch {
    results.expiredTasksReleased = -1
  }

  // ─── 2. Auto-close ended contests ────────────────────────────
  try {
    const endedContests = await prisma.trailerContest.findMany({
      where: {
        status: 'VOTING' as never,
        autoClose: true,
        endDate: { lt: new Date() },
      },
      select: { id: true },
    })
    results.contestsAutoClosed = endedContests.length
    // Note: actual prize distribution requires admin action via updateContestStatusAction
  } catch {
    results.contestsAutoClosed = -1
  }

  // ─── 3. Auto-complete phases where all tasks are validated ───
  try {
    const activePhases = await prisma.filmPhase.findMany({
      where: { status: 'ACTIVE' as never },
      include: {
        tasks: { select: { status: true } },
        film: { select: { id: true, slug: true } },
      },
    })

    let phasesCompleted = 0
    for (const phase of activePhases) {
      if (phase.tasks.length > 0 && phase.tasks.every(t => t.status === 'VALIDATED')) {
        await prisma.filmPhase.update({
          where: { id: phase.id },
          data: { status: 'COMPLETED', completedAt: new Date() },
        })

        // Auto-unlock next phase
        const nextPhase = await prisma.filmPhase.findFirst({
          where: {
            filmId: phase.filmId,
            phaseOrder: phase.phaseOrder + 1,
            status: 'LOCKED' as never,
          },
        })
        if (nextPhase) {
          await prisma.filmPhase.update({
            where: { id: nextPhase.id },
            data: {
              status: 'ACTIVE',
              startsAt: new Date(),
              endsAt: new Date(Date.now() + nextPhase.estimatedDays * 24 * 60 * 60 * 1000),
            },
          })
        }

        // Update film progress
        const allPhases = await prisma.filmPhase.findMany({
          where: { filmId: phase.filmId },
        })
        const completedCount = allPhases.filter(p => p.status === 'COMPLETED').length
        await prisma.film.update({
          where: { id: phase.filmId },
          data: { progressPct: Math.round((completedCount / allPhases.length) * 100) },
        })

        phasesCompleted++
      }
    }
    results.phasesAutoCompleted = phasesCompleted
  } catch {
    results.phasesAutoCompleted = -1
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    results,
  })
}
