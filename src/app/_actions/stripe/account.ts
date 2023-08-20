"use server"

import { db } from "@/db"
import { payments, stores } from "@/db/schema"
import { eq } from "drizzle-orm"
import { type z } from "zod"

import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"
import type { createAccountLinkSchema } from "@/lib/validations/stripe"

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

    await db.insert(payments).values({
      storeId: input.storeId,
      stripeAccountId: account.id,
      stripeAccountCreatedAt: account.created,
      detailsSubmitted: account.details_submitted,
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
