import type { SubscriptionPlan, UserSubscriptionPlan } from "@/types"

import { subscriptionConfig } from "@/config/subscription"

export function getPlanFeatures(title: SubscriptionPlan["title"]) {
  const plan = Object.values(subscriptionConfig.plans).find(
    (plan) => plan.title === title
  )
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

export function getDashboardRedirectPath(input: {
  storeCount: number
  subscriptionPlan: UserSubscriptionPlan | null
}): string {
  const { storeCount, subscriptionPlan } = input

  const minStoresWithProductCount = {
    free: 1,
    standard: 2,
    pro: 3,
  }[subscriptionPlan?.title ?? "free"]

  const isActive = subscriptionPlan?.isActive ?? false
  const hasEnoughStores = storeCount >= minStoresWithProductCount

  return isActive && hasEnoughStores
    ? "/dashboard/billing"
    : "/dashboard/stores/new"
}
