import { env } from "@/env.mjs"
import type { SubscriptionPlan } from "@/types"

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description: "The free plan allows you to create up to 1 store.",
  stripePriceId: "",
  monthlyPrice: null,
}

export const proPlan: SubscriptionPlan = {
  name: "Pro",
  description: "The pro plan allows you to create up to 3 stores.",
  stripePriceId: env.STRIPE_PRO_STORE_PRICE_ID ?? "",
  monthlyPrice: 10,
}

export const storeSubPlans = [freePlan, proPlan]
