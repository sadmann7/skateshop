import type { SubscriptionPlan } from "@/types"

import { subscriptionConfig } from "@/config/subscription"

export function getPlanLimits({
  planTitle,
}: {
  planTitle?: SubscriptionPlan["title"]
}) {
  const { features } = subscriptionConfig.plans[planTitle ?? "Free"]

  const [storeLimit, productLimit] = features.map((feature) => {
    const [value] = feature.match(/\d+/) || []
    return value ? parseInt(value, 10) : 0
  })

  return { storeLimit: storeLimit ?? 0, productLimit: productLimit ?? 0 }
}
