import { clerkClient } from "@clerk/nextjs"

import { freePlan, proPlan } from "@/config/subscriptions"

export async function getUserSubscriptionPlan(userId: string) {
  const user = await clerkClient.users.getUser(userId)

  if (!user) {
    throw new Error("User not found")
  }

  // Check if user is on a pro plan
  const isPro =
    user.privateMetadata.stripePriceId &&
    (user.privateMetadata.stripeCurrentPeriodEnd as Date)?.getTime() +
      86_400_000 >
      Date.now()

  const plan = isPro ? proPlan : freePlan

  return {
    ...plan,
    stripeSubscriptionId: user.privateMetadata.stripeSubscriptionId,
    stripeCurrentPeriodEnd: user.privateMetadata.stripeCurrentPeriodEnd,
    isPro,
  }
}
