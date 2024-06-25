import { env } from "@/env.js"
import { type Plan } from "@/types"

export type PricingConfig = typeof pricingConfig

export const pricingConfig = {
  plans: {
    free: {
      id: "free",
      title: "Free",
      description: "Perfect for small businesses that want to sell online.",
      features: ["Create up to 1 store", "Create up to 25 products"],
      stripePriceId: "",
      limits: {
        stores: 1,
        products: 25,
        tags: 5,
        variants: 5,
      },
    },
    standard: {
      id: "standard",
      title: "Standard",
      description: "Perfect for midsize businesses that want to sell online.",
      features: ["Create up to 3 store", "Create up to 50 products/store"],
      stripePriceId: env.STRIPE_STD_MONTHLY_PRICE_ID,
      limits: {
        stores: 3,
        products: 25,
        tags: 25,
        variants: 10,
      },
    },
    pro: {
      id: "pro",
      title: "Pro",
      description: "Perfect for big businesses that want to sell online.",
      features: ["Create up to 5 stores", "Create up to 100 products/store"],
      stripePriceId: env.STRIPE_PRO_MONTHLY_PRICE_ID,
      limits: {
        stores: 5,
        products: 100,
        tags: 50,
        variants: 15,
      },
    },
  } satisfies Record<Plan["id"], Plan>,
}
