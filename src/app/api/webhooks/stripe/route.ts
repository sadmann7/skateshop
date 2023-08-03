import { headers } from "next/headers"
import { env } from "@/env.mjs"
import { clerkClient } from "@clerk/nextjs"
import type Stripe from "stripe"

import { stripe } from "@/lib/stripe"
import { userPrivateMetadataSchema } from "@/lib/validations/auth"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") ?? ""

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    return new Response(
      `Webhook Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 400 }
    )
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (!session?.metadata?.userId) {
    return new Response(null, { status: 200 })
  }

  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Unsubscribe the user from the previous plan if they are subscribed to another plan
    // TODO: Need to find an alternative for this. This is a bit hacky.
    const user = await clerkClient.users.getUser(session.metadata.userId)

    const stripeSubscriptionId =
      userPrivateMetadataSchema.shape.stripeSubscriptionId.parse(
        user.privateMetadata.stripeSubscriptionId
      )

    if (subscription.customer && stripeSubscriptionId) {
      await stripe.subscriptions.update(stripeSubscriptionId, {
        cancel_at_period_end: true,
      })
    }

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    await clerkClient.users.updateUserMetadata(session?.metadata?.userId, {
      privateMetadata: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Update the price id and set the new period end
    await clerkClient.users.updateUserMetadata(subscription.id, {
      privateMetadata: {
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  return new Response(null, { status: 200 })
}
