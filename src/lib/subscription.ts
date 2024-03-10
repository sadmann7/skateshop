import type { SubscriptionPlan } from "@/types"

import { subscriptionConfig } from "@/config/subscription"

export function getPlanLimits({
  planTitle,
}: {
  planTitle: SubscriptionPlan["title"]
}) {
  const { features } = subscriptionConfig.plans[planTitle]

  const [storeLimit, productLimit] = features.map((feature) => {
    const [value] = feature.match(/\d+/) || []
    return value ? parseInt(value, 10) : 0
  })

  return { storeLimit: storeLimit ?? 0, productLimit: productLimit ?? 0 }
}

export function getUsageWithProgress(input: {
  planTitle: SubscriptionPlan["title"]
  storeCount: number
  productCount: number
}) {
  const { storeLimit, productLimit } = getPlanLimits({
    planTitle: input.planTitle,
  })

  const storeProgress = Math.floor((input.storeCount / storeLimit) * 100)
  const productProgress = Math.floor((input.productCount / productLimit) * 100)

  return {
    storeLimit,
    storeProgress,
    productLimit,
    productProgress,
  }
}
