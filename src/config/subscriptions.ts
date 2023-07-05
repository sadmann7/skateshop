import { env } from "@/env.mjs"
import { type SubscriptionPlan } from "@/types"

export const storeSubscriptionPlans: SubscriptionPlan[] = [
  {
    name: "Ollie",
    description: "Perfect for small businesses that want to sell online.",
    features: ["Create up to 1 store", "Create up to 20 products"],
    stripePriceId: "",
    price: 0,
  },
  {
    name: "Kickflip",
    description: "Perfect for big businesses that want to sell online.",
    features: ["Create up to 3 stores", "Create up to 20 products per store"],
    stripePriceId: env.STRIPE_PRO_STORE_PRICE_ID,
    price: 10,
  },
]
