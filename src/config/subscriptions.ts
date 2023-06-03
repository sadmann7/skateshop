import { env } from "@/env.mjs"
import type { SubscriptionPlan } from "@/types"

export const freePlan: SubscriptionPlan = {
  name: "Ollie",
  description:
    "The ollie plan allows you to create up to 1 store, and 20 products.",
  stripePriceId: "",
  monthlyPrice: null,
}

export const proPlan: SubscriptionPlan = {
  name: "Kickflip",
  description:
    "The kickflip plan allows you to create up to 3 stores, and 20 products per store.",
  stripePriceId: env.STRIPE_PRO_STORE_PRICE_ID ?? "",
  monthlyPrice: 10,
}
