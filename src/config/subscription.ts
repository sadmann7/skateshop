import { env } from "@/env.js"
import type { SubscriptionPlan } from "@/types"

export type SubscriptionConfig = typeof subscriptionConfig

export const subscriptionConfig = {
  plans: {
    Free: {
      title: "Free",
      description: "Perfect for small businesses that want to sell online.",
      features: ["Create up to 1 store", "Create up to 20 products"],
      stripePriceId: "",
    },
    Standard: {
      title: "Standard",
      description: "Perfect for midsize businesses that want to sell online.",
      features: ["Create up to 2 store", "Create up to 20 products/store"],
      stripePriceId: env.STRIPE_STD_MONTHLY_PRICE_ID,
    },
    Pro: {
      title: "Pro",
      description: "Perfect for big businesses that want to sell online.",
      features: ["Create up to 3 stores", "Create up to 20 products/store"],
      stripePriceId: env.STRIPE_PRO_MONTHLY_PRICE_ID,
    },
  } satisfies Record<SubscriptionPlan["title"], SubscriptionPlan>,
}
