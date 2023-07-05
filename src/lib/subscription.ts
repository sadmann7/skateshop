import { clerkClient } from "@clerk/nextjs"
import dayjs from "dayjs"

import { storeSubscriptionPlans } from "@/config/subscriptions"

export async function getUserSubscriptionPlan(userId: string) {
  const user = await clerkClient.users.getUser(userId)

  if (!user) {
    throw new Error("User not found")
  }

  // Check if user is on a pro plan
  const isPro =
    user.privateMetadata.stripePriceId &&
    dayjs(user.privateMetadata.stripeCurrentPeriodEnd as string).valueOf() +
      86_400_000 >
      Date.now()

  const plan = isPro ? storeSubscriptionPlans[1] : storeSubscriptionPlans[0]

  return {
    ...plan,
    stripeSubscriptionId: String(user.privateMetadata.stripeSubscriptionId),
    stripeCurrentPeriodEnd: String(user.privateMetadata.stripeCurrentPeriodEnd),
    stripeCustomerId: String(user.privateMetadata.stripeCustomerId),
    isPro,
  }
}
