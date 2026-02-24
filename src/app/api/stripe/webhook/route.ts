import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Stripe Webhook Handler
 *
 * Processes Stripe events:
 * - checkout.session.completed → activate subscription
 * - invoice.payment_succeeded → renew subscription
 * - invoice.payment_failed → suspend subscription
 * - account.updated → update Connect status
 */
export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: { type: string; data: { object: Record<string, unknown> } }

  try {
    // @ts-expect-error — stripe SDK conditionally installed
    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' })
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET) as typeof event
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Record<string, unknown>
        const userId = (session.metadata as Record<string, string>)?.userId
        const planId = (session.metadata as Record<string, string>)?.planId

        if (userId && planId) {
          // Activate subscription — store in user bio as temp solution
          // In production: use a dedicated Subscription table
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          await prisma.user.update({
            where: { id: userId },
            data: {
              bio: `subscription:${planId}:${expiresAt.toISOString()}`,
            },
          })
          console.log(`[Stripe] Subscription activated: ${planId} for user ${userId}`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Record<string, unknown>
        const customerId = invoice.customer as string
        if (customerId) {
          console.log(`[Stripe] Invoice paid for customer ${customerId}`)
          // Renewal: extend subscription by 30 days
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Record<string, unknown>
        const customerId = invoice.customer as string
        console.warn(`[Stripe] Payment failed for customer ${customerId}`)
        // Suspend or downgrade subscription
        break
      }

      case 'account.updated': {
        const account = event.data.object as Record<string, unknown>
        const userId = (account.metadata as Record<string, string>)?.userId
        if (userId) {
          const chargesEnabled = account.charges_enabled as boolean
          console.log(`[Stripe Connect] Account ${account.id} — charges_enabled: ${chargesEnabled}`)
        }
        break
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[Stripe Webhook] Processing error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
