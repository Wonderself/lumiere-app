'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// ============================================
// SCENARIO PROPOSALS
// ============================================

export async function submitScenarioAction(prevState: any, formData: FormData) {
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
    await prisma.scenarioVote.create({
      data: {
        proposalId,
        userId: session.user.id,
      },
    })

    // Increment votesCount
    await prisma.scenarioProposal.update({
      where: { id: proposalId },
      data: { votesCount: { increment: 1 } },
    })

    revalidatePath('/community/scenarios')
    revalidatePath(`/community/scenarios/${proposalId}`)
    return { success: true }
  } catch (e: any) {
    // Unique constraint violation = already voted
    if (e?.code === 'P2002') {
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
    })

    if (!proposal) return { error: 'Proposition introuvable.' }

    // Set as winner
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

    revalidatePath('/community/scenarios')
    revalidatePath('/admin/contests')
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

export async function submitTrailerEntryAction(prevState: any, formData: FormData) {
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
    await prisma.trailerVote.create({
      data: {
        entryId,
        userId: session.user.id,
      },
    })

    await prisma.trailerEntry.update({
      where: { id: entryId },
      data: { votesCount: { increment: 1 } },
    })

    revalidatePath('/community/contests')
    revalidatePath(`/community/contests/${entry.contestId}`)
    return { success: true }
  } catch (e: any) {
    if (e?.code === 'P2002') {
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
    const updateData: any = { status: newStatus }

    // If closing, find the winning entry
    if (newStatus === 'CLOSED') {
      const topEntry = await prisma.trailerEntry.findFirst({
        where: { contestId },
        orderBy: { votesCount: 'desc' },
      })

      if (topEntry) {
        updateData.winnerId = topEntry.id
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
