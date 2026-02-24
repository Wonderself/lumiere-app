'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  recordVoteOnChain,
  recordVoteTallyOnChain,
  recordPrizeDistribution,
  recordContestClosed,
  recordEvent,
} from '@/lib/blockchain'
import { slugify } from '@/lib/utils'
import { decomposeFilmToTasks } from '@/lib/film-decomposer'

// ============================================
// SCENARIO PROPOSALS
// ============================================

export async function submitScenarioAction(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const title = (formData.get('title') as string)?.trim()
  const logline = (formData.get('logline') as string)?.trim()
  const synopsis = (formData.get('synopsis') as string)?.trim() || null
  const genre = (formData.get('genre') as string)?.trim() || null
  const filmId = (formData.get('filmId') as string) || null
  const catalogFilmId = (formData.get('catalogFilmId') as string) || null

  // Validation
  if (!title || title.length < 5 || title.length > 200) {
    return { error: 'Le titre doit contenir entre 5 et 200 caractères.' }
  }
  if (!logline || logline.length < 10 || logline.length > 500) {
    return { error: 'Le logline doit contenir entre 10 et 500 caractères.' }
  }

  try {
    await prisma.scenarioProposal.create({
      data: {
        authorId: session.user.id,
        title,
        logline,
        synopsis,
        genre,
        filmId: filmId || null,
        catalogFilmId: catalogFilmId || null,
        status: 'SUBMITTED',
      },
    })

    revalidatePath('/community/scenarios')
    return { success: true }
  } catch (e) {
    console.error('submitScenarioAction error:', e)
    return { error: 'Erreur lors de la soumission. Réessayez.' }
  }
}

export async function voteScenarioAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const proposalId = formData.get('proposalId') as string
  if (!proposalId) return { error: 'Proposition invalide.' }

  // Premium check
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  if (!subscription || subscription.plan === 'FREE') {
    return { error: 'Réservé aux membres Premium (Starter+). Passez à un abonnement supérieur pour voter.' }
  }

  // Check proposal exists and is in VOTING status
  const proposal = await prisma.scenarioProposal.findUnique({
    where: { id: proposalId },
  })

  if (!proposal || proposal.status !== 'VOTING') {
    return { error: 'Cette proposition n\'est pas en phase de vote.' }
  }

  try {
    // Create vote (unique constraint catches duplicates)
    const vote = await prisma.scenarioVote.create({
      data: {
        proposalId,
        userId: session.user.id,
      },
    })

    // Record on blockchain
    const { proofHash } = await recordVoteOnChain({
      voteType: 'SCENARIO',
      entityId: vote.id,
      voterId: session.user.id,
      proposalId,
    })

    // Store txHash on vote
    await prisma.scenarioVote.update({
      where: { id: vote.id },
      data: { txHash: `0x${proofHash.slice(0, 64)}` },
    })

    // Increment votesCount
    await prisma.scenarioProposal.update({
      where: { id: proposalId },
      data: { votesCount: { increment: 1 } },
    })

    revalidatePath('/community/scenarios')
    revalidatePath(`/community/scenarios/${proposalId}`)
    return { success: true }
  } catch (e: unknown) {
    // Unique constraint violation = already voted
    if ((e as { code?: string })?.code === 'P2002') {
      return { error: 'Vous avez déjà voté pour cette proposition.' }
    }
    console.error('voteScenarioAction error:', e)
    return { error: 'Erreur lors du vote. Réessayez.' }
  }
}

export async function shortlistScenariosAction(formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const proposalIds = (formData.get('proposalIds') as string)?.split(',').filter(Boolean)
  if (!proposalIds?.length) return { error: 'Aucune proposition sélectionnée.' }

  try {
    await prisma.scenarioProposal.updateMany({
      where: { id: { in: proposalIds } },
      data: { status: 'VOTING' },
    })

    revalidatePath('/community/scenarios')
    revalidatePath('/admin/contests')
    return { success: true }
  } catch (e) {
    console.error('shortlistScenariosAction error:', e)
    return { error: 'Erreur lors de la mise en vote.' }
  }
}

export async function pickScenarioWinnerAction(formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const proposalId = formData.get('proposalId') as string
  if (!proposalId) return { error: 'Proposition invalide.' }

  try {
    const proposal = await prisma.scenarioProposal.findUnique({
      where: { id: proposalId },
      include: { votes: true },
    })

    if (!proposal) return { error: 'Proposition introuvable.' }

    // Get all voting proposals for tally
    const allProposals = await prisma.scenarioProposal.findMany({
      where: { round: proposal.round, status: 'VOTING' },
      orderBy: { votesCount: 'desc' },
    })

    // Build vote tally for blockchain
    const results: Record<string, number> = {}
    allProposals.forEach((p) => { results[p.id] = p.votesCount })

    // Record tally on-chain
    await recordVoteTallyOnChain({
      contestType: 'SCENARIO',
      contestId: `round-${proposal.round}`,
      results,
      winnerId: proposalId,
    })

    // Record contest closure on-chain
    await recordContestClosed({
      contestId: `round-${proposal.round}`,
      contestType: 'SCENARIO',
      winnerId: proposalId,
      totalVotes: allProposals.reduce((sum, p) => sum + p.votesCount, 0),
    })

    // Distribute prize if pool exists
    if (proposal.prizePoolEur > 0) {
      await prisma.lumenTransaction.create({
        data: {
          userId: proposal.authorId,
          amount: Math.round(proposal.prizePoolEur * 100),
          type: 'BONUS',
          description: `Prix scénario gagnant — "${proposal.title}"`,
          relatedId: proposalId,
        },
      })
      await prisma.user.update({
        where: { id: proposal.authorId },
        data: { lumenBalance: { increment: Math.round(proposal.prizePoolEur * 100) } },
      })

      await recordPrizeDistribution({
        contestId: `round-${proposal.round}`,
        contestType: 'SCENARIO',
        winners: [{ userId: proposal.authorId, rank: 1, amountEur: proposal.prizePoolEur }],
        totalPool: proposal.prizePoolEur,
      })

      // Mark prize as claimed
      await prisma.scenarioProposal.update({
        where: { id: proposalId },
        data: { prizeClaimedAt: new Date() },
      })
    }

    // Set as winner + store on-chain hash
    await prisma.scenarioProposal.update({
      where: { id: proposalId },
      data: { status: 'WINNER' },
    })

    // Archive other VOTING proposals in the same round
    await prisma.scenarioProposal.updateMany({
      where: {
        id: { not: proposalId },
        round: proposal.round,
        status: 'VOTING',
      },
      data: { status: 'ARCHIVED' },
    })

    // ── Auto-create Film from winning scenario ──
    const filmSlugBase = slugify(proposal.title)
    const existingSlug = await prisma.film.findUnique({ where: { slug: filmSlugBase } })
    const filmSlug = existingSlug ? `${filmSlugBase}-${Date.now()}` : filmSlugBase

    const film = await prisma.film.create({
      data: {
        title: proposal.title,
        slug: filmSlug,
        synopsis: proposal.synopsis || proposal.logline,
        genre: proposal.genre || null,
        catalog: 'LUMIERE',
        status: 'DRAFT',
        isPublic: false,
        phases: {
          create: [
            { phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
            { phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
            { phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
            { phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
            { phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
            { phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
            { phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
            { phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
            { phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
            { phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
          ],
        },
      },
      include: { phases: true },
    })

    // Link scenario back to the new film
    await prisma.scenarioProposal.update({
      where: { id: proposalId },
      data: { filmId: film.id },
    })

    // Auto-generate tasks from film-decomposer
    const decomposedTasks = decomposeFilmToTasks(proposal.genre)
    const phaseMap = new Map(film.phases.map((p) => [p.phaseName, p.id]))
    let tasksCreated = 0

    for (const task of decomposedTasks) {
      const phaseId = phaseMap.get(task.phase as never)
      if (!phaseId) continue

      await prisma.task.create({
        data: {
          filmId: film.id,
          phaseId,
          title: task.title,
          descriptionMd: task.description,
          type: task.type as never,
          difficulty: task.difficulty as never,
          priceEuros: task.priceEuros,
          status: task.phase === 'SCRIPT' ? 'AVAILABLE' : 'LOCKED',
        },
      })
      tasksCreated++
    }

    // Update film totalTasks count
    await prisma.film.update({
      where: { id: film.id },
      data: { totalTasks: tasksCreated },
    })

    // Record film creation on blockchain
    await recordEvent({
      type: 'FILM_CREATED_FROM_SCENARIO',
      entityType: 'Film',
      entityId: film.id,
      data: {
        filmTitle: proposal.title,
        filmSlug,
        scenarioId: proposalId,
        scenarioRound: proposal.round,
        genre: proposal.genre,
        tasksGenerated: tasksCreated,
        authorId: proposal.authorId,
      },
    }).catch(() => {})

    revalidatePath('/community/scenarios')
    revalidatePath('/admin/contests')
    revalidatePath('/admin/films')
    revalidatePath('/films')
    return { success: true }
  } catch (e) {
    console.error('pickScenarioWinnerAction error:', e)
    return { error: 'Erreur lors de la sélection du gagnant.' }
  }
}

// ============================================
// TRAILER CONTESTS
// ============================================

export async function createContestAction(formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const filmId = (formData.get('filmId') as string) || null
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string
  const prizeDescription = (formData.get('prizeDescription') as string)?.trim() || null
  const prizePoolEur = parseFloat(formData.get('prizePoolEur') as string) || 0
  const autoClose = formData.get('autoClose') === 'true'

  if (!title || title.length < 3) {
    return { error: 'Le titre doit contenir au moins 3 caractères.' }
  }

  try {
    await prisma.trailerContest.create({
      data: {
        title,
        description,
        filmId: filmId || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        prizeDescription,
        prizePoolEur,
        prizeDistribution: { '1st': 60, '2nd': 25, '3rd': 15 },
        autoClose,
        status: 'UPCOMING',
      },
    })

    revalidatePath('/community/contests')
    revalidatePath('/admin/contests')
    return { success: true }
  } catch (e) {
    console.error('createContestAction error:', e)
    return { error: 'Erreur lors de la création du concours.' }
  }
}

export async function submitTrailerEntryAction(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const contestId = formData.get('contestId') as string
  const title = (formData.get('title') as string)?.trim()
  const videoUrl = (formData.get('videoUrl') as string)?.trim() || null
  const thumbnailUrl = (formData.get('thumbnailUrl') as string)?.trim() || null

  if (!contestId || !title) {
    return { error: 'Le titre est requis.' }
  }

  // Check contest exists and is OPEN
  const contest = await prisma.trailerContest.findUnique({
    where: { id: contestId },
  })

  if (!contest || contest.status !== 'OPEN') {
    return { error: 'Ce concours n\'accepte plus de soumissions.' }
  }

  try {
    await prisma.trailerEntry.create({
      data: {
        contestId,
        userId: session.user.id,
        title,
        videoUrl,
        thumbnailUrl,
      },
    })

    revalidatePath('/community/contests')
    revalidatePath(`/community/contests/${contestId}`)
    return { success: true }
  } catch (e) {
    console.error('submitTrailerEntryAction error:', e)
    return { error: 'Erreur lors de la soumission. Réessayez.' }
  }
}

export async function voteTrailerAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const entryId = formData.get('entryId') as string
  if (!entryId) return { error: 'Entrée invalide.' }

  // Check entry's contest is in VOTING status
  const entry = await prisma.trailerEntry.findUnique({
    where: { id: entryId },
    include: { contest: { select: { status: true } } },
  })

  if (!entry || entry.contest.status !== 'VOTING') {
    return { error: 'Le vote n\'est pas ouvert pour ce concours.' }
  }

  try {
    const vote = await prisma.trailerVote.create({
      data: {
        entryId,
        userId: session.user.id,
      },
    })

    // Record on blockchain
    const { proofHash } = await recordVoteOnChain({
      voteType: 'TRAILER',
      entityId: vote.id,
      voterId: session.user.id,
    })

    // Store txHash on vote
    await prisma.trailerVote.update({
      where: { id: vote.id },
      data: { txHash: `0x${proofHash.slice(0, 64)}` },
    })

    await prisma.trailerEntry.update({
      where: { id: entryId },
      data: { votesCount: { increment: 1 } },
    })

    revalidatePath('/community/contests')
    revalidatePath(`/community/contests/${entry.contestId}`)
    return { success: true }
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === 'P2002') {
      return { error: 'Vous avez déjà voté pour cette entrée.' }
    }
    console.error('voteTrailerAction error:', e)
    return { error: 'Erreur lors du vote. Réessayez.' }
  }
}

export async function updateContestStatusAction(formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const contestId = formData.get('contestId') as string
  const newStatus = formData.get('newStatus') as string

  if (!contestId || !newStatus) return { error: 'Paramètres manquants.' }

  try {
    const updateData: Record<string, unknown> = { status: newStatus }

    // If closing, find the winning entry + tally + distribute prizes
    if (newStatus === 'CLOSED') {
      const entries = await prisma.trailerEntry.findMany({
        where: { contestId },
        orderBy: { votesCount: 'desc' },
        include: { user: { select: { id: true } } },
      })

      const contest = await prisma.trailerContest.findUnique({
        where: { id: contestId },
      })

      if (entries.length > 0) {
        updateData.winnerId = entries[0].id

        // Build vote tally for blockchain
        const results: Record<string, number> = {}
        entries.forEach((e) => { results[e.id] = e.votesCount })
        const totalVotes = entries.reduce((sum, e) => sum + e.votesCount, 0)

        // Record tally on-chain
        await recordVoteTallyOnChain({
          contestType: 'TRAILER',
          contestId,
          results,
          winnerId: entries[0].id,
        })

        // Record contest closure on-chain
        await recordContestClosed({
          contestId,
          contestType: 'TRAILER',
          winnerId: entries[0].id,
          totalVotes,
        })

        // Distribute prizes if pool exists
        const pool = contest?.prizePoolEur || 0
        if (pool > 0) {
          const dist = (contest?.prizeDistribution as Record<string, number>) || { '1st': 60, '2nd': 25, '3rd': 15 }
          const winners: Array<{ userId: string; rank: number; amountEur: number }> = []

          const ranks = [
            { key: '1st', rank: 1 },
            { key: '2nd', rank: 2 },
            { key: '3rd', rank: 3 },
          ]

          for (const r of ranks) {
            const entry = entries[r.rank - 1]
            if (!entry) break
            const pct = dist[r.key] || 0
            const amount = (pool * pct) / 100
            if (amount > 0) {
              winners.push({ userId: entry.user.id, rank: r.rank, amountEur: amount })
              // Credit lumens (1 EUR = configurable lumen rate)
              await prisma.lumenTransaction.create({
                data: {
                  userId: entry.user.id,
                  amount: Math.round(amount * 100),
                  type: 'BONUS',
                  description: `Prix ${r.key} — ${contest?.title || 'Concours'}`,
                  relatedId: contestId,
                },
              })
              await prisma.user.update({
                where: { id: entry.user.id },
                data: { lumenBalance: { increment: Math.round(amount * 100) } },
              })
            }
          }

          // Record prize distribution on-chain
          if (winners.length > 0) {
            await recordPrizeDistribution({
              contestId,
              contestType: 'TRAILER',
              winners,
              totalPool: pool,
            })
          }
        }
      }
    }

    await prisma.trailerContest.update({
      where: { id: contestId },
      data: updateData,
    })

    revalidatePath('/community/contests')
    revalidatePath(`/community/contests/${contestId}`)
    revalidatePath('/admin/contests')
    return { success: true }
  } catch (e) {
    console.error('updateContestStatusAction error:', e)
    return { error: 'Erreur lors de la mise à jour du statut.' }
  }
}
