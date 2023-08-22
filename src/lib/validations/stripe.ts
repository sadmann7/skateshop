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
  retrieveAccount: z.boolean().default(true).optional(),
})

export const createPaymentIntentSchema = z.object({
  storeId: z.number(),
  items: z.array(cartLineItemSchema),
})

export const getPaymentIntentsSchema = z.object({
  storeId: z.number(),
  limit: z.number().optional(),
  starting_after: z.string().optional(),
  ending_before: z.string().optional(),
  customer: z.string().optional(),
  expand: z.array(z.string()).optional(),
  created: z.number().optional(),
})

export const getPaymentIntentSchema = z.object({
  storeId: z.number(),
  paymentIntentId: z.string(),
  deliveryPostalCode: z.string().optional().nullable(),
})
