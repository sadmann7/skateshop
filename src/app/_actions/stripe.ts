"use server"

import { clerkClient } from "@clerk/nextjs"
import { type z } from "zod"

import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"
import { type manageSubscriptionSchema } from "@/lib/validations/stripe"

export async function manageSubscriptionAction(
  input: z.infer<typeof manageSubscriptionSchema>
) {
  const billingUrl = absoluteUrl("/dashboard/billing")

  const user = await clerkClient.users.getUser(input.userId)

  if (!user) {
    throw new Error("User not found.")
  }

  // If the user is already a Pro member, we redirect them to the Stripe billing portal
  if (input.isPro && input.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: input.stripeCustomerId,
      return_url: billingUrl,
    })

    return {
      url: stripeSession.url,
    }
  }

  // If the user is not a Pro member, we create a Stripe Checkout session
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: billingUrl,
    cancel_url: billingUrl,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: input.email,
    line_items: [
      {
        price: input.stripePriceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId: input.userId,
    },
  })

  return {
    url: stripeSession.url,
  }
}
