import * as z from "zod"

import { cartLineItemSchema } from "@/lib/validations/cart"

export const manageSubscriptionSchema = z.object({
  stripePriceId: z.string(),
  stripeCustomerId: z.string().optional().nullable(),
  stripeSubscriptionId: z.string().optional().nullable(),
  isSubscribed: z.boolean(),
  isCurrentPlan: z.boolean(),
})

export const getStripeAccountSchema = z.object({
  storeId: z.number(),
})

export const createPaymentIntentSchema = z.object({
  storeId: z.number(),
  items: z.array(cartLineItemSchema),
})
