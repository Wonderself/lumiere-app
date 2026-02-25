/**
 * Credit Management System for Lumiere AI Trailer Generation
 *
 * Handles all credit operations: purchases, grants, AI usage billing,
 * refunds, and weekly free trailer tracking for premium subscribers.
 *
 * Commission model: 20% markup on real AI token costs.
 * 1 credit ≈ 0.05 EUR (before commission).
 */

import { prisma } from '@/lib/prisma'
import type { CreditAccount, CreditTransaction, CreditTxType } from '@prisma/client'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Commission rate applied on top of raw AI costs (20%). */
export const COMMISSION_RATE = 0.20

/** Conversion rate: 1 credit = 0.05 EUR (base, before commission). */
export const CREDIT_TO_EUR = 0.05

/** Maximum free trailers per week for premium subscribers. */
const WEEKLY_FREE_TRAILER_LIMIT = 1

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AddCreditsParams {
  userId: string
  amount: number
  type: CreditTxType
  description: string
  metadata?: Record<string, unknown>
}

export interface DeductCreditsParams {
  userId: string
  amount: number
  rawCostEur: number
  aiProvider?: string
  aiModel?: string
  rawTokenCount?: number
  trailerProjectId?: string
  trailerTaskId?: string
  description: string
}

export interface RefundCreditsParams {
  userId: string
  amount: number
  description: string
  originalTransactionId?: string
  metadata?: Record<string, unknown>
}

export interface CreditHistoryOptions {
  page?: number
  pageSize?: number
  type?: CreditTxType
}

export interface CreditPackDefinition {
  name: string
  credits: number
  bonusCredits: number
  priceEur: number
  pricePerCredit: number
  description: string
  features: string[]
  isPopular: boolean
  sortOrder: number
}

// ---------------------------------------------------------------------------
// Account Management
// ---------------------------------------------------------------------------

/**
 * Retrieve the credit account for a user, creating one if it does not exist.
 * Uses an upsert to avoid race conditions on first access.
 */
export async function getOrCreateCreditAccount(userId: string): Promise<CreditAccount> {
  return prisma.creditAccount.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      balance: 0,
      totalPurchased: 0,
      totalGranted: 0,
      totalUsed: 0,
      totalRefunded: 0,
      weeklyFreeUsed: 0,
      weeklyFreeReset: getNextMondayUTC(),
    },
  })
}

/**
 * Get the current credit balance for a user.
 * Returns 0 if the account does not exist yet.
 */
export async function getCreditBalance(userId: string): Promise<number> {
  const account = await prisma.creditAccount.findUnique({
    where: { userId },
    select: { balance: true },
  })
  return account?.balance ?? 0
}

/**
 * Check whether a user can afford a given credit amount.
 */
export async function canAfford(userId: string, amount: number): Promise<boolean> {
  if (amount <= 0) return true
  const balance = await getCreditBalance(userId)
  return balance >= amount
}

// ---------------------------------------------------------------------------
// Credit Operations
// ---------------------------------------------------------------------------

/**
 * Add credits to a user's account (pack purchase, admin grant, promo, etc.).
 *
 * The entire operation runs inside a Prisma interactive transaction to
 * guarantee atomicity: the account balance update and the transaction
 * record are written together or not at all.
 */
export async function addCredits(params: AddCreditsParams): Promise<CreditTransaction> {
  const { userId, amount, type, description, metadata } = params

  if (amount <= 0) {
    throw new Error('Credit amount must be positive')
  }

  return prisma.$transaction(async (tx) => {
    // Ensure account exists
    const account = await tx.creditAccount.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        balance: 0,
        totalPurchased: 0,
        totalGranted: 0,
        totalUsed: 0,
        totalRefunded: 0,
        weeklyFreeUsed: 0,
        weeklyFreeReset: getNextMondayUTC(),
      },
    })

    const balanceBefore = account.balance
    const balanceAfter = balanceBefore + amount

    // Determine which lifetime counter to increment
    const counterUpdate = getCounterUpdate(type, amount)

    // Atomically update balance
    await tx.creditAccount.update({
      where: { id: account.id },
      data: {
        balance: balanceAfter,
        ...counterUpdate,
      },
    })

    // Record the transaction
    const transaction = await tx.creditTransaction.create({
      data: {
        userId,
        accountId: account.id,
        amount,
        type,
        description,
        balanceBefore,
        balanceAfter,
        metadata: metadata ? (metadata as object) : undefined,
      },
    })

    return transaction
  })
}

/**
 * Deduct credits for AI usage, applying the 20% commission on the raw cost.
 *
 * - Validates the user has enough credits.
 * - Computes commission and total charged amounts.
 * - Atomically decrements the balance and records the transaction.
 *
 * @throws Error if the user's balance is insufficient.
 */
export async function deductCredits(params: DeductCreditsParams): Promise<CreditTransaction> {
  const {
    userId,
    amount,
    rawCostEur,
    aiProvider,
    aiModel,
    rawTokenCount,
    trailerProjectId,
    trailerTaskId,
    description,
  } = params

  if (amount <= 0) {
    throw new Error('Deduction amount must be positive')
  }

  const commissionEur = roundEur(rawCostEur * COMMISSION_RATE)
  const totalChargedEur = roundEur(rawCostEur + commissionEur)

  return prisma.$transaction(async (tx) => {
    // Lock the row with a fresh read inside the transaction
    const account = await tx.creditAccount.findUnique({
      where: { userId },
    })

    if (!account) {
      throw new Error(`No credit account found for user ${userId}`)
    }

    if (account.balance < amount) {
      throw new Error(
        `Insufficient credits: balance is ${account.balance}, but ${amount} required. ` +
        `Please purchase a credit pack to continue.`
      )
    }

    const balanceBefore = account.balance
    const balanceAfter = balanceBefore - amount

    // Update balance and lifetime usage counter
    await tx.creditAccount.update({
      where: { id: account.id },
      data: {
        balance: balanceAfter,
        totalUsed: { increment: amount },
      },
    })

    // Record the detailed transaction
    const transaction = await tx.creditTransaction.create({
      data: {
        userId,
        accountId: account.id,
        amount: -amount, // Negative for deductions
        type: 'AI_USAGE' as CreditTxType,
        description,
        aiProvider: aiProvider ?? null,
        aiModel: aiModel ?? null,
        rawTokenCount: rawTokenCount ?? null,
        rawCostEur,
        commissionEur,
        totalChargedEur,
        trailerProjectId: trailerProjectId ?? null,
        trailerTaskId: trailerTaskId ?? null,
        balanceBefore,
        balanceAfter,
      },
    })

    return transaction
  })
}

/**
 * Refund credits back to a user's account (partial or full).
 *
 * Records the original transaction ID in metadata for audit trail.
 */
export async function refundCredits(params: RefundCreditsParams): Promise<CreditTransaction> {
  const { userId, amount, description, originalTransactionId, metadata } = params

  if (amount <= 0) {
    throw new Error('Refund amount must be positive')
  }

  return prisma.$transaction(async (tx) => {
    const account = await tx.creditAccount.findUnique({
      where: { userId },
    })

    if (!account) {
      throw new Error(`No credit account found for user ${userId}`)
    }

    const balanceBefore = account.balance
    const balanceAfter = balanceBefore + amount

    // Update balance and refund counter
    await tx.creditAccount.update({
      where: { id: account.id },
      data: {
        balance: balanceAfter,
        totalRefunded: { increment: amount },
      },
    })

    const refundMetadata: Record<string, unknown> = {
      ...(metadata ?? {}),
    }
    if (originalTransactionId) {
      refundMetadata.originalTransactionId = originalTransactionId
    }

    const transaction = await tx.creditTransaction.create({
      data: {
        userId,
        accountId: account.id,
        amount,
        type: 'REFUND' as CreditTxType,
        description,
        balanceBefore,
        balanceAfter,
        metadata: Object.keys(refundMetadata).length > 0 ? (refundMetadata as object) : undefined,
      },
    })

    return transaction
  })
}

// ---------------------------------------------------------------------------
// Weekly Free Trailer (Premium)
// ---------------------------------------------------------------------------

/**
 * Check whether a premium user can still create a free trailer this week.
 *
 * Automatically resets the counter if the reset date has passed.
 * Returns `true` if the user has free trailers remaining.
 */
export async function checkWeeklyFreeTrailer(userId: string): Promise<boolean> {
  const account = await getOrCreateCreditAccount(userId)
  const now = new Date()

  // If the reset date has passed, the user's weekly counter should be treated as 0
  if (now >= account.weeklyFreeReset) {
    return true // Counter is stale, so they have a free one
  }

  return account.weeklyFreeUsed < WEEKLY_FREE_TRAILER_LIMIT
}

/**
 * Mark a weekly free trailer as used for a premium subscriber.
 *
 * Resets the counter first if the current week has elapsed, then
 * increments the usage. Throws if the weekly limit is already reached.
 */
export async function useWeeklyFreeTrailer(userId: string): Promise<CreditAccount> {
  return prisma.$transaction(async (tx) => {
    const account = await tx.creditAccount.findUnique({
      where: { userId },
    })

    if (!account) {
      throw new Error(`No credit account found for user ${userId}`)
    }

    const now = new Date()
    let currentUsed = account.weeklyFreeUsed

    // Reset counter if the week has rolled over
    if (now >= account.weeklyFreeReset) {
      currentUsed = 0
    }

    if (currentUsed >= WEEKLY_FREE_TRAILER_LIMIT) {
      throw new Error(
        `Weekly free trailer limit reached (${WEEKLY_FREE_TRAILER_LIMIT}/week). ` +
        `Next reset: ${account.weeklyFreeReset.toISOString()}`
      )
    }

    const nextReset = now >= account.weeklyFreeReset ? getNextMondayUTC() : account.weeklyFreeReset

    const updated = await tx.creditAccount.update({
      where: { id: account.id },
      data: {
        weeklyFreeUsed: currentUsed + 1,
        weeklyFreeReset: nextReset,
      },
    })

    return updated
  })
}

// ---------------------------------------------------------------------------
// Transaction History
// ---------------------------------------------------------------------------

/**
 * Retrieve paginated credit transaction history for a user.
 *
 * @param userId  - The user whose history to fetch.
 * @param opts    - Pagination and filter options.
 * @returns An object with the transactions, total count, and page metadata.
 */
export async function getCreditHistory(
  userId: string,
  opts?: CreditHistoryOptions
): Promise<{
  transactions: CreditTransaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}> {
  const page = Math.max(1, opts?.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, opts?.pageSize ?? 20))
  const skip = (page - 1) * pageSize

  const where = {
    userId,
    ...(opts?.type ? { type: opts.type } : {}),
  }

  const [transactions, total] = await Promise.all([
    prisma.creditTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.creditTransaction.count({ where }),
  ])

  return {
    transactions,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// ---------------------------------------------------------------------------
// Credit Packs
// ---------------------------------------------------------------------------

/**
 * Return the default credit pack offerings for the store UI.
 *
 * These can also be seeded into the `CreditPack` table, but this
 * function provides a reliable fallback when the database is empty.
 */
export function getDefaultCreditPacks(): CreditPackDefinition[] {
  return [
    {
      name: 'Découverte',
      credits: 100,
      bonusCredits: 0,
      priceEur: 4.99,
      pricePerCredit: roundEur(4.99 / 100),
      description: 'Idéal pour tester la création de bandes-annonces IA',
      features: [
        '100 crédits',
        'Accès à tous les modèles IA',
        'Support communautaire',
      ],
      isPopular: false,
      sortOrder: 1,
    },
    {
      name: 'Créateur',
      credits: 500,
      bonusCredits: 50,
      priceEur: 19.99,
      pricePerCredit: roundEur(19.99 / (500 + 50)),
      description: 'Le choix des créateurs réguliers',
      features: [
        '500 + 50 crédits bonus',
        'Accès à tous les modèles IA',
        'Support prioritaire',
        'Historique détaillé',
      ],
      isPopular: true,
      sortOrder: 2,
    },
    {
      name: 'Studio',
      credits: 2000,
      bonusCredits: 400,
      priceEur: 69.99,
      pricePerCredit: roundEur(69.99 / (2000 + 400)),
      description: 'Pour les studios et créateurs professionnels',
      features: [
        '2 000 + 400 crédits bonus',
        'Accès à tous les modèles IA',
        'Support prioritaire',
        'Historique détaillé',
        'Export haute qualité',
      ],
      isPopular: false,
      sortOrder: 3,
    },
    {
      name: 'Production',
      credits: 10000,
      bonusCredits: 3000,
      priceEur: 299.99,
      pricePerCredit: roundEur(299.99 / (10000 + 3000)),
      description: 'Volume maximal pour les productions ambitieuses',
      features: [
        '10 000 + 3 000 crédits bonus',
        'Accès à tous les modèles IA',
        'Support dédié',
        'Historique détaillé',
        'Export haute qualité',
        'API access',
      ],
      isPopular: false,
      sortOrder: 4,
    },
  ]
}

// ---------------------------------------------------------------------------
// Cost Estimation
// ---------------------------------------------------------------------------

/**
 * Estimate the number of credits required for a given raw AI cost in EUR.
 *
 * Applies the 20% commission and converts to credits at the standard rate.
 * Always rounds up to ensure sufficient credits are deducted.
 *
 * Formula: credits = ceil((rawCostEur * (1 + COMMISSION_RATE)) / CREDIT_TO_EUR)
 *
 * @param rawCostEur - The raw AI provider cost in EUR.
 * @returns The estimated number of credits needed (always >= 1 if rawCostEur > 0).
 */
export function estimateCreditCost(rawCostEur: number): number {
  if (rawCostEur <= 0) return 0
  const totalCostEur = rawCostEur * (1 + COMMISSION_RATE)
  return Math.ceil(totalCostEur / CREDIT_TO_EUR)
}

// ---------------------------------------------------------------------------
// Helpers (internal)
// ---------------------------------------------------------------------------

/**
 * Determine which lifetime counter(s) to increment based on transaction type.
 */
function getCounterUpdate(type: CreditTxType, amount: number): Record<string, { increment: number }> {
  switch (type) {
    case 'PACK_PURCHASE':
      return { totalPurchased: { increment: amount } }
    case 'ADMIN_GRANT':
    case 'SUBSCRIPTION_GRANT':
    case 'CONTEST_PRIZE':
    case 'REFERRAL_BONUS':
    case 'PROMO_CODE':
      return { totalGranted: { increment: amount } }
    case 'REFUND':
      return { totalRefunded: { increment: amount } }
    case 'AI_USAGE':
      return { totalUsed: { increment: amount } }
    default:
      return { totalGranted: { increment: amount } }
  }
}

/**
 * Get the next Monday at 00:00 UTC, used for weekly free trailer resets.
 */
function getNextMondayUTC(): Date {
  const now = new Date()
  const dayOfWeek = now.getUTCDay() // 0 = Sunday, 1 = Monday, ...
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) // Next Monday
  const next = new Date(now)
  next.setUTCDate(now.getUTCDate() + daysUntilMonday)
  next.setUTCHours(0, 0, 0, 0)
  return next
}

/**
 * Round a EUR amount to 4 decimal places for precision.
 */
function roundEur(value: number): number {
  return Math.round(value * 10000) / 10000
}
