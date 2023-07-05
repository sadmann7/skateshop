import { clerkClient } from "@clerk/nextjs"
import dayjs from "dayjs"

import { storeSubscriptionPlans } from "@/config/subscriptions"
import { userPrivateMetadataSchema } from "@/lib/validations/auth"

export async function getUserSubscriptionPlan(userId: string) {
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

  return {
    ...plan,
    stripeSubscriptionId: userPrivateMetadata.stripeSubscriptionId,
    stripeCurrentPeriodEnd: userPrivateMetadata.stripeCurrentPeriodEnd,
    stripeCustomerId: userPrivateMetadata.stripeCustomerId,
    isSubscribed,
  }
}
