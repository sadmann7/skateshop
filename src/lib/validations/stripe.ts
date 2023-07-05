import * as z from "zod"

export const manageSubscriptionSchema = z.object({
  stripePriceId: z.string(),
  stripeCustomerId: z.string().nullable(),
  isPro: z.boolean(),
  userId: z.string(),
  email: z.string().email(),
})
