import type { SubscriptionPlan, UserSubscriptionPlan } from "@/types"
import { clerkClient } from "@clerk/nextjs"
import dayjs from "dayjs"
import Stripe from "stripe"

import { storeSubscriptionPlans } from "@/config/subscriptions"
import { stripe } from "@/lib/stripe"
import { userPrivateMetadataSchema } from "@/lib/validations/auth"

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan | null> {
  try {
    const user = await clerkClient.users.getUser(userId)

    if (!user) {
      throw new Error("User not found.")
    }

    const userPrivateMetadata = userPrivateMetadataSchema.parse(
      user.privateMetadata
    )

    // Check if user is subscribed
    const isSubscribed =
      !!userPrivateMetadata.stripePriceId &&
      dayjs(userPrivateMetadata.stripeCurrentPeriodEnd).valueOf() + 86_400_000 >
        Date.now()

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
  } catch (err) {
    console.error(err)
    if (err instanceof Stripe.errors.StripeError) {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          stripePriceId: null,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: null,
        },
      })
    }
    return null
  }
}

export function getPlanFeatures(planId?: SubscriptionPlan["id"]) {
  const plan = storeSubscriptionPlans.find((plan) => plan.id === planId)
  const features = plan?.features.map((feature) => feature.split(",")).flat()

  const maxStoreCount =
    features?.find((feature) => feature.match(/store/i))?.match(/\d+/) ?? 0

  const maxProductCount =
    features?.find((feature) => feature.match(/product/i))?.match(/\d+/) ?? 0

  return {
    maxStoreCount,
    maxProductCount,
  }
}

export function getDashboardRedirectPath(input: {
  storeCount: number
  subscriptionPlan: UserSubscriptionPlan | null
}): string {
  const { storeCount, subscriptionPlan } = input

  const minStoresWithProductCount = {
    basic: 1,
    standard: 2,
    pro: 3,
  }[subscriptionPlan?.id ?? "basic"]

  const isActive = subscriptionPlan?.isActive ?? false
  const hasEnoughStores = storeCount >= minStoresWithProductCount

  return isActive && hasEnoughStores
    ? "/dashboard/billing"
    : "/dashboard/stores/new"
}
