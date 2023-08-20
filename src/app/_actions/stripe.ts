"use server"

import { db } from "@/db"
import { payments, stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { type z } from "zod"

import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"
import type {
  createAccountLinkSchema,
  manageSubscriptionSchema,
} from "@/lib/validations/stripe"

// For managing stripe subscriptions for a user
export async function manageSubscriptionAction(
  input: z.infer<typeof manageSubscriptionSchema>
) {
  const billingUrl = absoluteUrl("/dashboard/billing")

  const user = await currentUser()

  if (!user) {
    throw new Error("User not found.")
  }

  const email =
    user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? ""

  // If the user is already subscribed to a plan, we redirect them to the Stripe billing portal
  if (input.isSubscribed && input.stripeCustomerId && input.isCurrentPlan) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: input.stripeCustomerId,
      return_url: billingUrl,
    })

    return {
      url: stripeSession.url,
    }
  }

  // If the user is not subscribed to a plan, we create a Stripe Checkout session
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: billingUrl,
    cancel_url: billingUrl,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: email,
    line_items: [
      {
        price: input.stripePriceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id,
    },
  })

  return {
    url: stripeSession.url,
  }
}

export async function checkStripeConnectionAction(
  input: z.infer<typeof createAccountLinkSchema>
) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.id, input.storeId),
  })

  if (!store)
    return {
      isConnected: false,
      payment: null,
    }

  const payment = await db.query.payments.findFirst({
    where: eq(payments.storeId, input.storeId),
  })

  if (!payment || !payment.stripeAccountId)
    return {
      isConnected: false,
      payment: null,
    }

  const account = await stripe.accounts.retrieve(payment.stripeAccountId)

  if (!account)
    return {
      isConnected: false,
      payment: null,
    }

  return {
    isConnected:
      account.details_submitted && payment.detailsSubmitted ? true : false,
    payment,
  }
}

// For connecting a Stripe account to a store
export async function createAccountLinkAction(
  input: z.infer<typeof createAccountLinkSchema>
) {
  const { isConnected, payment } = await checkStripeConnectionAction(input)

  if (isConnected) {
    throw new Error("Store already connected to Stripe.")
  }

  const stripeAccountId =
    payment?.stripeAccountId ?? (await createStripeAccount())

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: absoluteUrl(`/dashboard/stores/${input.storeId}`),
    return_url: absoluteUrl(`/dashboard/stores/${input.storeId}`),
    type: "account_onboarding",
  })

  if (!accountLink?.url) {
    throw new Error("Error creating Stripe account link, please try again.")
  }

  return { url: accountLink.url }

  async function createStripeAccount(): Promise<string> {
    const account = await stripe.accounts.create({ type: "standard" })

    if (!account) {
      throw new Error("Error creating Stripe account.")
    }

    await db.transaction(async (tx) => {
      await tx.insert(payments).values({
        storeId: input.storeId,
        stripeAccountId: account.id,
        stripeAccountCreatedAt: account.created,
        detailsSubmitted: account.details_submitted,
      })

      await tx
        .update(stores)
        .set({
          stripeAccountId: account.details_submitted ? account.id : null,
        })
        .where(eq(stores.id, input.storeId))
    })

    return account.id
  }
}

export async function getStripeAccountAction(
  input: z.infer<typeof createAccountLinkSchema>
) {
  const { isConnected, payment } = await checkStripeConnectionAction(input)

  if (!isConnected || !payment?.stripeAccountId) return null

  try {
    return await stripe.accounts.retrieve(payment.stripeAccountId)
  } catch (err) {
    console.error(err)
    return null
  }
}
