import type { SubscriptionPlan, UserSubscriptionPlan } from "@/types"

import { storeSubscriptionPlans } from "@/config/subscriptions"

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
