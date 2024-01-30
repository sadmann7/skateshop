"use server"

import { unstable_cache as cache } from "next/cache"
import { cookies } from "next/headers"
import { db } from "@/db"
import { payments, stores } from "@/db/schema"
import type { UserSubscriptionPlan } from "@/types"
import { clerkClient } from "@clerk/nextjs"
import { addDays } from "date-fns"
import { eq } from "drizzle-orm"
import { type z } from "zod"

import { storeSubscriptionPlans } from "@/config/subscriptions"
import { stripe } from "@/lib/stripe"
import { userPrivateMetadataSchema } from "@/lib/validations/auth"
import {
  getPaymentIntentSchema,
  getPaymentIntentsSchema,
  getStripeAccountSchema,
} from "@/lib/validations/stripe"

// Getting the subscription plan for a user
export async function getSubscriptionPlan(input: {
  userId: string
}): Promise<UserSubscriptionPlan | null> {
  try {
    return await cache(
      async () => {
        const user = await clerkClient.users.getUser(input.userId)

        if (!user) {
          throw new Error("User not found.")
        }

        const userPrivateMetadata = userPrivateMetadataSchema.parse(
          user.privateMetadata
        )

        // Check if user is subscribed
        const isSubscribed =
          !!userPrivateMetadata.stripePriceId &&
          !!userPrivateMetadata.stripeCurrentPeriodEnd &&
          addDays(
            new Date(userPrivateMetadata.stripeCurrentPeriodEnd),
            1
          ).getTime() > Date.now()

        const plan = isSubscribed
          ? storeSubscriptionPlans.find(
              (plan) => plan.stripePriceId === userPrivateMetadata.stripePriceId
            )
          : storeSubscriptionPlans[0]

        if (!plan) {
          throw new Error("Plan not found.")
        }

        // Check if user has canceled subscription
        let isCanceled = false
        if (isSubscribed && !!userPrivateMetadata.stripeSubscriptionId) {
          const stripePlan = await stripe.subscriptions.retrieve(
            userPrivateMetadata.stripeSubscriptionId
          )
          isCanceled = stripePlan.cancel_at_period_end
        }

        return {
          ...plan,
          stripeSubscriptionId: userPrivateMetadata.stripeSubscriptionId,
          stripeCurrentPeriodEnd: userPrivateMetadata.stripeCurrentPeriodEnd,
          stripeCustomerId: userPrivateMetadata.stripeCustomerId,
          isSubscribed,
          isCanceled,
          isActive: isSubscribed && !isCanceled,
        }
      },
      ["user-subscription"],
      {
        revalidate: 900,
        tags: ["user-subscription"],
      }
    )()
  } catch (err) {
    console.error(err)
    return null
  }
}

// Getting the Stripe account for a store
export async function getStripeAccount(
  rawInput: z.infer<typeof getStripeAccountSchema>
) {
  const falsyReturn = {
    isConnected: false,
    account: null,
    payment: null,
  }

  try {
    const input = getStripeAccountSchema.parse(rawInput)

    const retrieveAccount = input.retrieveAccount ?? true

    const store = await db.query.stores.findFirst({
      columns: {
        stripeAccountId: true,
      },
      where: eq(stores.id, input.storeId),
    })

    if (!store) return falsyReturn

    const payment = await db.query.payments.findFirst({
      columns: {
        stripeAccountId: true,
        detailsSubmitted: true,
      },
      where: eq(payments.storeId, input.storeId),
    })

    if (!payment || !payment.stripeAccountId) return falsyReturn

    if (!retrieveAccount)
      return {
        isConnected: true,
        account: null,
        payment,
      }

    const account = await stripe.accounts.retrieve(payment.stripeAccountId)

    if (!account) return falsyReturn

    // If the account details have been submitted, we update the store and payment records
    if (account.details_submitted && !payment.detailsSubmitted) {
      await db.transaction(async (tx) => {
        await tx
          .update(payments)
          .set({
            detailsSubmitted: account.details_submitted,
            stripeAccountCreatedAt: account.created,
          })
          .where(eq(payments.storeId, input.storeId))

        await tx
          .update(stores)
          .set({
            stripeAccountId: account.id,
            active: true,
          })
          .where(eq(stores.id, input.storeId))
      })
    }

    return {
      isConnected: payment.detailsSubmitted,
      account: account.details_submitted ? account : null,
      payment,
    }
  } catch (err) {
    err instanceof Error && console.error(err.message)
    return falsyReturn
  }
}

// Modified from: https://github.com/jackblatch/OneStopShop/blob/main/server-actions/stripe/payment.ts
// Getting payment intents for a store
export async function getPaymentIntents(
  rawInput: z.infer<typeof getPaymentIntentsSchema>
) {
  try {
    const input = getPaymentIntentsSchema.parse(rawInput)

    const { isConnected, payment } = await getStripeAccount({
      storeId: input.storeId,
      retrieveAccount: false,
    })

    if (!isConnected || !payment) {
      throw new Error("Store not connected to Stripe.")
    }

    if (!payment.stripeAccountId) {
      throw new Error("Stripe account not found.")
    }

    const paymentIntents = await stripe.paymentIntents.list(
      {
        limit: input.limit ?? 10,
      },
      {
        stripeAccount: payment.stripeAccountId,
      }
    )

    return {
      paymentIntents: paymentIntents.data.map((item) => ({
        id: item.id,
        amount: item.amount,
        created: item.created,
        cartId: Number(item.metadata.cartId),
      })),
      hasMore: paymentIntents.has_more,
    }
  } catch (err) {
    console.error(err)
    return {
      paymentIntents: [],
      hasMore: false,
    }
  }
}

// Modified from: https://github.com/jackblatch/OneStopShop/blob/main/server-actions/stripe/payment.ts
// Getting a payment intent for a store
export async function getPaymentIntent(
  rawInput: z.infer<typeof getPaymentIntentSchema>
) {
  try {
    const input = getPaymentIntentSchema.parse(rawInput)

    const cartId = cookies().get("cartId")?.value

    const { isConnected, payment } = await getStripeAccount({
      storeId: input.storeId,
      retrieveAccount: false,
    })

    if (!isConnected || !payment) {
      throw new Error("Store not connected to Stripe.")
    }

    if (!payment.stripeAccountId) {
      throw new Error("Stripe account not found.")
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      input.paymentIntentId,
      {
        stripeAccount: payment.stripeAccountId,
      }
    )

    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment intent not succeeded.")
    }

    if (
      paymentIntent.metadata.cartId !== cartId &&
      paymentIntent.shipping?.address?.postal_code?.split(" ").join("") !==
        input.deliveryPostalCode
    ) {
      throw new Error("CartId or delivery postal code does not match.")
    }

    return {
      paymentIntent,
      isVerified: true,
    }
  } catch (err) {
    console.error(err)
    return {
      paymentIntent: null,
      isVerified: false,
    }
  }
}
