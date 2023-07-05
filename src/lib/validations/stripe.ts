import * as z from "zod"

export const manageSubscriptionSchema = z.object({
  stripeCustomerId: z.string(),
  isPro: z.boolean(),
  stripePriceId: z.string(),
  userId: z.string(),
  email: z.string().email(),
})
