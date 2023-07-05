import { clerkClient } from "@clerk/nextjs"

import { storeSubscriptionPlans } from "@/config/subscriptions"

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

  const plan = isPro ? storeSubscriptionPlans[1] : storeSubscriptionPlans[0]

  const stripeSubscriptionId =
    typeof user.privateMetadata.stripeSubscriptionId === "string"
      ? user.privateMetadata.stripeSubscriptionId
      : null

  const stripeCurrentPeriodEnd =
    typeof user.privateMetadata.stripeCurrentPeriodEnd === "number"
      ? user.privateMetadata.stripeSubscriptionId
      : null

  const stripeCustomerId =
    typeof user.privateMetadata.stripeCustomerId === "string"
      ? user.privateMetadata.stripeCustomerId
      : null

  return {
    ...plan,
    stripeSubscriptionId,
    stripeCurrentPeriodEnd,
    stripeCustomerId,
    isPro,
  }
}
