import * as z from "zod"

export const manageSubscriptionSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  stripePriceId: z.string(),
  stripeCustomerId: z.string().optional().nullable(),
  stripeSubscriptionId: z.string().optional().nullable(),
  isSubscribed: z.boolean(),
  isCurrentPlan: z.boolean(),
})

export const createAccountLinkSchema = z.object({
  storeId: z.number(),
  userId: z.string().optional(),
})
