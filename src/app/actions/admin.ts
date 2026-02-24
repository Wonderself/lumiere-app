'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import { checkAndUpgradeLevel } from '@/lib/level'
import { createNotification } from '@/lib/notifications'
import { runAiReview } from '@/lib/ai-review'
import { recordEvent } from '@/lib/blockchain'
import { calculateReputationScore, getBadgeForScore } from '@/lib/reputation'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')
  return session
}

// ─── Film Actions ──────────────────────────────────────────────

export async function createFilmAction(formData: FormData) {
  await requireAdmin()

  const title = formData.get('title') as string
  const genre = formData.get('genre') as string
  const catalog = (formData.get('catalog') as string) || 'LUMIERE'
  const description = formData.get('description') as string
  const synopsis = formData.get('synopsis') as string
  const coverImageUrl = formData.get('coverImageUrl') as string
  const estimatedBudget = formData.get('estimatedBudget') as string
  const isPublic = formData.get('isPublic') === 'true'

  if (!title) return

  const slug = slugify(title)
  const existingSlug = await prisma.film.findUnique({ where: { slug } })
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug

  await prisma.film.create({
    data: {
      title,
      slug: finalSlug,
      genre: genre || null,
      catalog: catalog as any,
      description: description || null,
      synopsis: synopsis || null,
      coverImageUrl: coverImageUrl || null,
      estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : null,
      isPublic,
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
  })

  // Record film creation on blockchain
  await recordEvent({
    type: 'FILM_CREATED',
    entityType: 'Film',
    entityId: finalSlug,
    data: { title, genre, catalog, estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : 0 },
  }).catch(() => {})

  revalidatePath('/admin/films')
  revalidatePath('/films')
  redirect('/admin/films')
}

export async function updateFilmAction(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const genre = formData.get('genre') as string
  const catalog = formData.get('catalog') as string
  const status = formData.get('status') as string
  const description = formData.get('description') as string
  const synopsis = formData.get('synopsis') as string
  const coverImageUrl = formData.get('coverImageUrl') as string
  const estimatedBudget = formData.get('estimatedBudget') as string
  const isPublic = formData.get('isPublic') === 'true'

  await prisma.film.update({
    where: { id },
    data: {
      title,
      genre: genre || null,
      catalog: catalog as any,
      status: status as any,
      description: description || null,
      synopsis: synopsis || null,
      coverImageUrl: coverImageUrl || null,
      estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : null,
      isPublic,
    },
  })

  revalidatePath('/admin/films')
  revalidatePath('/films')
  redirect('/admin/films')
}

export async function deleteFilmAction(formData: FormData) {
  await requireAdmin()

  const filmId = formData.get('filmId') as string
  if (!filmId) return

  await prisma.film.delete({ where: { id: filmId } })

  revalidatePath('/admin/films')
  revalidatePath('/films')
}

// ─── Task Actions ──────────────────────────────────────────────

export async function createTaskAction(formData: FormData) {
  await requireAdmin()

  const filmId = formData.get('filmId') as string
  const phaseId = formData.get('phaseId') as string
  const title = formData.get('title') as string
  const descriptionMd = formData.get('descriptionMd') as string
  const instructionsMd = formData.get('instructionsMd') as string
  const type = formData.get('type') as string
  const difficulty = formData.get('difficulty') as string
  const priceEuros = parseFloat(formData.get('priceEuros') as string) || 50
  const status = (formData.get('status') as string) || 'AVAILABLE'
  const requiredLevel = (formData.get('requiredLevel') as string) || 'ROOKIE'

  if (!filmId || !phaseId || !title) return

  await prisma.$transaction([
    prisma.task.create({
      data: {
        filmId,
        phaseId,
        title,
        descriptionMd,
        instructionsMd: instructionsMd || null,
        type: type as any,
        difficulty: difficulty as any,
        priceEuros,
        status: status as any,
        requiredLevel: requiredLevel as any,
      },
    }),
    prisma.film.update({
      where: { id: filmId },
      data: { totalTasks: { increment: 1 } },
    }),
  ])

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
  redirect('/admin/tasks')
}

export async function updateTaskAction(formData: FormData) {
  await requireAdmin()

  const taskId = formData.get('taskId') as string
  const title = formData.get('title') as string
  const descriptionMd = formData.get('descriptionMd') as string
  const instructionsMd = formData.get('instructionsMd') as string
  const type = formData.get('type') as string
  const difficulty = formData.get('difficulty') as string
  const priceEuros = parseFloat(formData.get('priceEuros') as string)
  const status = formData.get('status') as string
  const requiredLevel = formData.get('requiredLevel') as string
  const inputFilesUrlsRaw = formData.get('inputFilesUrls') as string

  if (!taskId) return

  const inputFilesUrls = inputFilesUrlsRaw
    ? inputFilesUrlsRaw.split('\n').map(u => u.trim()).filter(Boolean)
    : undefined

  await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(title && { title }),
      ...(descriptionMd && { descriptionMd }),
      ...(instructionsMd !== null && { instructionsMd: instructionsMd || null }),
      ...(type && { type: type as any }),
      ...(difficulty && { difficulty: difficulty as any }),
      ...(priceEuros && { priceEuros }),
      ...(status && { status: status as any }),
      ...(requiredLevel && { requiredLevel: requiredLevel as any }),
      ...(inputFilesUrls && { inputFilesUrls }),
    },
  })

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
  revalidatePath(`/tasks/${taskId}`)
}

export async function deleteTaskAction(formData: FormData) {
  await requireAdmin()

  const taskId = formData.get('taskId') as string
  if (!taskId) return

  const task = await prisma.task.findUnique({ where: { id: taskId }, select: { filmId: true } })
  if (!task) return

  await prisma.$transaction([
    prisma.task.delete({ where: { id: taskId } }),
    prisma.film.update({
      where: { id: task.filmId },
      data: { totalTasks: { decrement: 1 } },
    }),
  ])

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
}

export async function runAiReviewAction(formData: FormData) {
  await requireAdmin()

  const submissionId = formData.get('submissionId') as string
  if (!submissionId) return

  const submission = await prisma.taskSubmission.findUnique({
    where: { id: submissionId },
    select: { id: true, notes: true, fileUrl: true, taskId: true, userId: true },
  })
  if (!submission) return

  // Get task context for smarter AI review
  const taskInfo = await prisma.task.findUnique({
    where: { id: submission.taskId },
    select: { title: true, type: true, instructionsMd: true },
  })

  const aiResult = await runAiReview(submission.id, submission.notes, submission.fileUrl, taskInfo ? {
    title: taskInfo.title,
    type: taskInfo.type,
    instructions: taskInfo.instructionsMd,
  } : undefined)

  await prisma.$transaction([
    prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        aiScore: aiResult.score,
        aiFeedback: aiResult.feedback,
        status: aiResult.verdict,
      },
    }),
    prisma.task.update({
      where: { id: submission.taskId },
      data: {
        status: 'HUMAN_REVIEW',
        aiConfidenceScore: aiResult.score,
      },
    }),
  ])

  await createNotification(submission.userId, 'SUBMISSION_REVIEWED', 'Revue IA terminée', {
    body: `Score IA : ${aiResult.score}/100 — ${aiResult.verdict === 'AI_APPROVED' ? 'Approuvé' : 'En attente de revue humaine'}`,
    href: `/tasks/${submission.taskId}`,
  })

  revalidatePath('/admin/reviews')
}

// ─── User Actions ──────────────────────────────────────────────

export async function verifyUserAction(formData: FormData) {
  await requireAdmin()
  const userId = formData.get('userId') as string
  await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true, verifiedAt: new Date() },
  })
  await createNotification(userId, 'SYSTEM', 'Compte vérifié', {
    body: 'Votre compte a été vérifié par un administrateur. Vous avez accès à toutes les fonctionnalités.',
    href: '/dashboard',
  })
  revalidatePath('/admin/users')
}

export async function changeUserRoleAction(formData: FormData) {
  await requireAdmin()
  const userId = formData.get('userId') as string
  const role = formData.get('role') as string
  await prisma.user.update({
    where: { id: userId },
    data: { role: role as any },
  })
  await createNotification(userId, 'SYSTEM', 'Rôle mis à jour', {
    body: `Votre rôle a été changé en ${role}.`,
    href: '/profile',
  })
  revalidatePath('/admin/users')
}

export async function grantLumensAction(formData: FormData) {
  await requireAdmin()

  const userId = formData.get('userId') as string
  const amountStr = formData.get('amount') as string
  const reason = formData.get('reason') as string
  const amount = parseInt(amountStr, 10)

  if (!userId || !amount || amount < 1) return

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { lumenBalance: { increment: amount } },
    }),
    prisma.lumenTransaction.create({
      data: {
        userId,
        amount,
        type: 'BONUS',
        description: reason || `Bonus de ${amount} Lumens attribué par un administrateur`,
      },
    }),
  ])

  await createNotification(userId, 'PAYMENT_RECEIVED', `${amount} Lumens reçus`, {
    body: reason || `Un administrateur vous a attribué ${amount} Lumens bonus.`,
    href: '/lumens',
  })

  revalidatePath('/admin/users')
}

// ─── Review Actions ────────────────────────────────────────────

export async function approveSubmissionAction(formData: FormData) {
  const session = await requireAdmin()
  const submissionId = formData.get('submissionId') as string
  const feedback = formData.get('feedback') as string

  const submission = await prisma.taskSubmission.findUnique({
    where: { id: submissionId },
    include: { task: true },
  })
  if (!submission) return

  // Get settings for Lumen reward
  const settings = await prisma.adminSettings.findUnique({ where: { id: 'singleton' } })
  const lumenReward = settings?.lumenRewardPerTask || 10

  // Calculate points
  const points = submission.task.priceEuros >= 500 ? 500 : submission.task.priceEuros >= 100 ? 100 : 50

  await prisma.$transaction([
    prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'HUMAN_APPROVED',
        humanReviewerId: session.user.id,
        humanFeedback: feedback || 'Approuvé par review humaine.',
      },
    }),
    prisma.task.update({
      where: { id: submission.taskId },
      data: {
        status: 'VALIDATED',
        validatedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: submission.userId },
      data: {
        tasksCompleted: { increment: 1 },
        tasksValidated: { increment: 1 },
        points: { increment: points },
        lumenBalance: { increment: lumenReward },
      },
    }),
    prisma.film.update({
      where: { id: submission.task.filmId },
      data: { completedTasks: { increment: 1 } },
    }),
    // Create pending payment
    prisma.payment.upsert({
      where: { taskId: submission.taskId },
      create: {
        userId: submission.userId,
        taskId: submission.taskId,
        amountEur: submission.task.priceEuros,
        method: 'STRIPE',
        status: 'PENDING',
      },
      update: { status: 'PENDING' },
    }),
    // Record Lumen reward transaction
    prisma.lumenTransaction.create({
      data: {
        userId: submission.userId,
        amount: lumenReward,
        type: 'TASK_REWARD',
        description: `Récompense pour la tâche "${submission.task.title}"`,
        relatedId: submission.taskId,
      },
    }),
  ])

  // Notify user
  await createNotification(submission.userId, 'TASK_VALIDATED', 'Tâche validée', {
    body: `Votre soumission pour "${submission.task.title}" a été approuvée. +${points} points, +${lumenReward} Lumens.`,
    href: `/tasks/${submission.taskId}`,
  })

  // Record task validation on blockchain
  await recordEvent({
    type: 'TASK_VALIDATED',
    entityType: 'Task',
    entityId: submission.taskId,
    data: {
      filmId: submission.task.filmId,
      userId: submission.userId,
      reviewerId: session.user.id,
      aiScore: submission.aiScore,
      priceEuros: submission.task.priceEuros,
    },
  }).catch(() => {})

  // Check level upgrade + reputation
  const updatedUser = await prisma.user.findUnique({
    where: { id: submission.userId },
    select: { points: true, tasksCompleted: true, tasksValidated: true, createdAt: true },
  })
  if (updatedUser) {
    await checkAndUpgradeLevel(submission.userId, updatedUser.points)

    // Calculate and update reputation
    const seniorityDays = Math.floor((Date.now() - updatedUser.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    const acceptanceRate = updatedUser.tasksCompleted > 0
      ? Math.round((updatedUser.tasksValidated / updatedUser.tasksCompleted) * 100)
      : 0
    const score = calculateReputationScore({
      deadlineRate: 80,
      acceptanceRate,
      qualityScore: submission.aiScore ?? 70,
      collabReliability: 70,
      engagementScore: 50,
      seniorityDays,
      taskCount: updatedUser.tasksCompleted,
    })
    const badge = getBadgeForScore(score)
    await prisma.user.update({
      where: { id: submission.userId },
      data: { reputationScore: score, reputationBadge: badge.name },
    }).catch(() => {})
  }

  revalidatePath('/admin/reviews')
}

export async function rejectSubmissionAction(formData: FormData) {
  const session = await requireAdmin()
  const submissionId = formData.get('submissionId') as string
  const feedback = formData.get('feedback') as string

  const submission = await prisma.taskSubmission.findUnique({
    where: { id: submissionId },
    include: { task: true },
  })
  if (!submission) return

  const canRetry = submission.task.currentAttempt < submission.task.maxAttempts

  await prisma.$transaction([
    prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'REJECTED',
        humanReviewerId: session.user.id,
        humanFeedback: feedback,
      },
    }),
    prisma.task.update({
      where: { id: submission.taskId },
      data: {
        status: canRetry ? 'CLAIMED' : 'REJECTED',
      },
    }),
  ])

  await createNotification(submission.userId, 'TASK_REJECTED', 'Soumission refusée', {
    body: canRetry
      ? `Votre soumission pour "${submission.task.title}" a été refusée. Vous pouvez réessayer (tentative ${submission.task.currentAttempt}/${submission.task.maxAttempts}).`
      : `Votre soumission pour "${submission.task.title}" a été définitivement refusée.`,
    href: `/tasks/${submission.taskId}`,
  })

  revalidatePath('/admin/reviews')
}

// ─── Payment Actions ───────────────────────────────────────────

export async function markPaymentPaidAction(formData: FormData) {
  await requireAdmin()

  const paymentId = formData.get('paymentId') as string
  if (!paymentId) return

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: { userId: true, amountEur: true },
  })
  if (!payment) return

  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'COMPLETED', paidAt: new Date() },
  })

  await createNotification(payment.userId, 'PAYMENT_RECEIVED', 'Paiement effectué', {
    body: `Votre paiement de ${payment.amountEur.toFixed(2)}€ a été traité.`,
    href: '/profile/payments',
  })

  revalidatePath('/admin/payments')
}

export async function bulkMarkPaidAction(formData: FormData) {
  await requireAdmin()

  const paymentIdsRaw = formData.get('paymentIds') as string
  if (!paymentIdsRaw) return

  const paymentIds = paymentIdsRaw.split(',').filter(Boolean)
  if (paymentIds.length === 0) return

  const payments = await prisma.payment.findMany({
    where: { id: { in: paymentIds }, status: 'PENDING' },
    select: { id: true, userId: true, amountEur: true },
  })

  await prisma.payment.updateMany({
    where: { id: { in: payments.map(p => p.id) } },
    data: { status: 'COMPLETED', paidAt: new Date() },
  })

  // Notify each user
  for (const payment of payments) {
    await createNotification(payment.userId, 'PAYMENT_RECEIVED', 'Paiement effectué', {
      body: `Votre paiement de ${payment.amountEur.toFixed(2)}€ a été traité.`,
      href: '/profile/payments',
    })
  }

  revalidatePath('/admin/payments')
}

// ─── Admin TODO Actions ────────────────────────────────────────

export async function createAdminTodoAction(formData: FormData) {
  await requireAdmin()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = (formData.get('priority') as string) || 'MEDIUM'
  const dueAt = formData.get('dueAt') as string

  if (!title) return

  await prisma.adminTodo.create({
    data: {
      title,
      description: description || null,
      priority: priority as any,
      dueAt: dueAt ? new Date(dueAt) : null,
    },
  })

  revalidatePath('/admin')
}

export async function toggleTodoAction(formData: FormData) {
  await requireAdmin()

  const todoId = formData.get('todoId') as string
  if (!todoId) return

  const todo = await prisma.adminTodo.findUnique({ where: { id: todoId } })
  if (!todo) return

  await prisma.adminTodo.update({
    where: { id: todoId },
    data: { completed: !todo.completed },
  })

  revalidatePath('/admin')
}

export async function deleteTodoAction(formData: FormData) {
  await requireAdmin()

  const todoId = formData.get('todoId') as string
  if (!todoId) return

  await prisma.adminTodo.delete({ where: { id: todoId } })
  revalidatePath('/admin')
}

// ─── Settings Action ───────────────────────────────────────────

export async function updateSettingsAction(formData: FormData) {
  await requireAdmin()

  const aiConfidenceThreshold = parseFloat(formData.get('aiConfidenceThreshold') as string) || 70
  const maxConcurrentTasks = parseInt(formData.get('maxConcurrentTasks') as string) || 3
  const bitcoinEnabled = formData.get('bitcoinEnabled') === 'true'
  const maintenanceMode = formData.get('maintenanceMode') === 'true'
  const lumenPrice = parseFloat(formData.get('lumenPrice') as string) || 1.0
  const lumenRewardPerTask = parseInt(formData.get('lumenRewardPerTask') as string) || 10
  const notifEmailEnabled = formData.get('notifEmailEnabled') === 'true'

  await prisma.adminSettings.upsert({
    where: { id: 'singleton' },
    create: {
      id: 'singleton',
      aiConfidenceThreshold,
      maxConcurrentTasks,
      bitcoinEnabled,
      maintenanceMode,
      lumenPrice,
      lumenRewardPerTask,
      notifEmailEnabled,
    },
    update: {
      aiConfidenceThreshold,
      maxConcurrentTasks,
      bitcoinEnabled,
      maintenanceMode,
      lumenPrice,
      lumenRewardPerTask,
      notifEmailEnabled,
    },
  })

  revalidatePath('/admin/settings')
}

// ─── Phase Timer Actions ──────────────────────────────────────────

export async function setPhaseDeadlineAction(formData: FormData) {
  await requireAdmin()

  const phaseId = formData.get('phaseId') as string
  const startsAt = formData.get('startsAt') as string
  const endsAt = formData.get('endsAt') as string
  const estimatedDays = parseInt(formData.get('estimatedDays') as string) || 30

  if (!phaseId) return { error: 'Phase invalide.' }

  await prisma.filmPhase.update({
    where: { id: phaseId },
    data: {
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
      estimatedDays,
    },
  })

  revalidatePath('/admin/films')
  return { success: true }
}

export async function unlockPhaseAction(formData: FormData) {
  await requireAdmin()

  const phaseId = formData.get('phaseId') as string
  if (!phaseId) return { error: 'Phase invalide.' }

  const phase = await prisma.filmPhase.findUnique({
    where: { id: phaseId },
    include: { film: true },
  })

  if (!phase) return { error: 'Phase introuvable.' }

  await prisma.filmPhase.update({
    where: { id: phaseId },
    data: {
      status: 'ACTIVE',
      startsAt: new Date(),
      endsAt: new Date(Date.now() + phase.estimatedDays * 24 * 60 * 60 * 1000),
    },
  })

  await recordEvent({
    type: 'PHASE_UNLOCKED',
    entityType: 'FilmPhase',
    entityId: phaseId,
    data: { filmId: phase.filmId, phaseName: phase.phaseName },
  }).catch(() => {})

  revalidatePath('/admin/films')
  revalidatePath(`/admin/films/${phase.filmId}/edit`)
  return { success: true }
}

export async function completePhaseAction(formData: FormData) {
  await requireAdmin()

  const phaseId = formData.get('phaseId') as string
  if (!phaseId) return { error: 'Phase invalide.' }

  const phase = await prisma.filmPhase.findUnique({
    where: { id: phaseId },
    include: { film: { include: { phases: { orderBy: { phaseOrder: 'asc' } } } } },
  })

  if (!phase) return { error: 'Phase introuvable.' }

  // Complete current phase
  await prisma.filmPhase.update({
    where: { id: phaseId },
    data: { status: 'COMPLETED', completedAt: new Date() },
  })

  // Auto-unlock next phase
  const nextPhase = phase.film.phases.find((p) => p.phaseOrder === phase.phaseOrder + 1)
  if (nextPhase && nextPhase.status === 'LOCKED') {
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
  const completedCount = phase.film.phases.filter((p) => p.status === 'COMPLETED').length + 1
  const totalPhases = phase.film.phases.length
  const newProgressPct = Math.round((completedCount / totalPhases) * 100)
  await prisma.film.update({
    where: { id: phase.filmId },
    data: { progressPct: newProgressPct },
  })

  await recordEvent({
    type: 'PHASE_COMPLETED',
    entityType: 'FilmPhase',
    entityId: phaseId,
    data: { filmId: phase.filmId, phaseName: phase.phaseName, progressPct: newProgressPct },
  }).catch(() => {})

  // If all phases completed, record film completion
  if (newProgressPct >= 100) {
    await recordEvent({
      type: 'FILM_COMPLETED',
      entityType: 'Film',
      entityId: phase.filmId,
      data: { title: phase.film.title, totalPhases },
    }).catch(() => {})
  }

  revalidatePath('/admin/films')
  revalidatePath(`/admin/films/${phase.filmId}/edit`)
  revalidatePath(`/films/${phase.film.slug}`)
  return { success: true }
}

// ─── Task Reassignment (Admin) ────────────────────────────────

export async function reassignTaskAction(formData: FormData) {
  await requireAdmin()

  const taskId = formData.get('taskId') as string
  if (!taskId) return { error: 'Tâche invalide.' }

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) return { error: 'Tâche introuvable.' }

  // Release the task back to AVAILABLE
  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: 'AVAILABLE',
      claimedById: null,
      claimedAt: null,
      deadline: null,
    },
  })

  // Notify previous claimer if any
  if (task.claimedById) {
    await createNotification(task.claimedById, 'SYSTEM', 'Tâche réattribuée', {
      body: `La tâche "${task.title}" vous a été retirée par un administrateur.`,
      href: '/tasks',
    })
  }

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
  revalidatePath(`/tasks/${taskId}`)
  return { success: true }
}

// ─── Expired Task Cleanup ─────────────────────────────────────

export async function cleanupExpiredTasksAction() {
  await requireAdmin()

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

    if (task.claimedById) {
      await createNotification(task.claimedById, 'SYSTEM', 'Tâche expirée', {
        body: `La tâche "${task.title}" a expiré et est de nouveau disponible.`,
        href: '/tasks',
      })
    }
  }

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
  return { count: expiredTasks.length }
}
