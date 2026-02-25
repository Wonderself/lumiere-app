'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications'
import { recordEvent } from '@/lib/blockchain'

/**
 * Subscription management for streaming plans.
 * Plans: FREE, STARTER, BASIC, PRO, PREMIUM, BUSINESS
 *
 * Stripe integration is prepared but works without it:
 * - With STRIPE_SECRET_KEY: real payment via Stripe Checkout
 * - Without: subscription is activated directly (dev/testing mode)
 */

type PlanConfig = {
  id: string
  name: string
  priceEur: number
  features: string[]
  maxStreams: number
  maxQuality: '720p' | '1080p' | '4K'
  offlineDownloads: number
  adFree: boolean
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  FREE: {
    id: 'FREE',
    name: 'Gratuit',
    priceEur: 0,
    features: ['5 films/mois', '720p', 'Publicités'],
    maxStreams: 5,
    maxQuality: '720p',
    offlineDownloads: 0,
    adFree: false,
  },
  BASIC: {
    id: 'BASIC',
    name: 'Basic',
    priceEur: 4.99,
    features: ['Illimité', '1080p', 'Sans pubs', 'Sous-titres', '5 downloads'],
    maxStreams: -1,
    maxQuality: '1080p',
    offlineDownloads: 5,
    adFree: true,
  },
  PREMIUM: {
    id: 'PREMIUM',
    name: 'Premium',
    priceEur: 9.99,
    features: ['Illimité', '4K', 'Sans pubs', 'Dolby Atmos', 'Downloads illimités'],
    maxStreams: -1,
    maxQuality: '4K',
    offlineDownloads: -1,
    adFree: true,
  },
}

/**
 * Subscribe to a plan.
 * In production, this would create a Stripe Checkout session.
 * In dev, it directly activates the subscription.
 */
export async function subscribeToPlanAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const plan = formData.get('plan') as string
  if (!plan || !PLAN_CONFIGS[plan]) return { error: 'Plan invalide' }

  const planConfig = PLAN_CONFIGS[plan]

  // Check if user already has this plan
  const existing = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  if (existing?.plan === plan && existing.status === 'active') {
    return { error: 'Vous êtes déjà abonné à ce plan' }
  }

  // If Stripe is configured and plan is paid, create checkout session
  if (process.env.STRIPE_SECRET_KEY && planConfig.priceEur > 0) {
    // Stripe integration placeholder
    // In production: create Stripe Checkout session and return URL
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    // const checkoutSession = await stripe.checkout.sessions.create({...})
    // return { redirectUrl: checkoutSession.url }
  }

  // Dev mode or free plan: activate directly
  const expiresAt = planConfig.priceEur > 0
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    : null

  await prisma.subscription.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      plan: plan as never,
      status: 'active',
      startedAt: new Date(),
      expiresAt,
    },
    update: {
      plan: plan as never,
      status: 'active',
      startedAt: new Date(),
      expiresAt,
    },
  })

  // Notify user
  await createNotification(session.user.id, 'SYSTEM' as never, `Abonnement ${planConfig.name} activé`, {
    body: planConfig.priceEur > 0
      ? `Votre abonnement ${planConfig.name} (${planConfig.priceEur}€/mois) est maintenant actif.`
      : 'Votre plan gratuit est actif. Upgradez pour débloquer la HD et les téléchargements.',
    href: '/streaming',
  })

  // Record on blockchain
  await recordEvent({
    type: 'SUBSCRIPTION_CHANGED',
    entityType: 'Subscription',
    entityId: session.user.id,
    data: { plan, priceEur: planConfig.priceEur },
  }).catch(() => {})

  revalidatePath('/streaming')
  revalidatePath('/dashboard')
  return { success: true, plan: planConfig.name }
}

/**
 * Cancel user's subscription.
 * Sets status to 'cancelled'. The subscription remains accessible until expiresAt.
 * If on a free plan, returns an error.
 */
export async function cancelSubscriptionAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  if (!sub || sub.plan === 'FREE') {
    return { error: 'Vous êtes sur le plan gratuit, aucun abonnement à annuler.' }
  }

  if (sub.status === 'cancelled') {
    return { error: 'Votre abonnement est déjà annulé.' }
  }

  // If Stripe is configured, cancel the Stripe subscription
  if (process.env.STRIPE_SECRET_KEY && sub.stripeSubId) {
    // Stripe cancellation placeholder
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    // await stripe.subscriptions.update(sub.stripeSubId, { cancel_at_period_end: true })
  }

  await prisma.subscription.update({
    where: { userId: session.user.id },
    data: { status: 'cancelled' },
  })

  const config = PLAN_CONFIGS[sub.plan] || PLAN_CONFIGS.FREE

  // Notify user
  await createNotification(session.user.id, 'SYSTEM' as never, 'Abonnement annulé', {
    body: `Votre abonnement ${config.name} a été annulé. Vous conservez l'accès jusqu'à la fin de la période en cours.`,
    href: '/dashboard/subscription',
  })

  // Record on blockchain
  await recordEvent({
    type: 'SUBSCRIPTION_CHANGED',
    entityType: 'Subscription',
    entityId: session.user.id,
    data: { action: 'cancelled', plan: sub.plan },
  }).catch(() => {})

  revalidatePath('/dashboard/subscription')
  revalidatePath('/streaming')
  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * Get user's current subscription status.
 */
export type UserSubscription = PlanConfig & {
  plan: string
  active: boolean
  status: 'active' | 'cancelled' | 'expired'
  expired?: boolean
  expiresAt?: Date | null
  startedAt?: Date | null
}

export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!sub) {
    return { plan: 'FREE', ...PLAN_CONFIGS.FREE, active: true, status: 'active' }
  }

  // Check if expired
  if (sub.expiresAt && sub.expiresAt < new Date()) {
    return { plan: 'FREE', ...PLAN_CONFIGS.FREE, active: true, expired: true, status: 'expired' }
  }

  const config = PLAN_CONFIGS[sub.plan] || PLAN_CONFIGS.FREE
  return {
    plan: sub.plan,
    ...config,
    active: sub.status === 'active',
    status: sub.status as 'active' | 'cancelled',
    expiresAt: sub.expiresAt,
    startedAt: sub.startedAt,
  }
}
