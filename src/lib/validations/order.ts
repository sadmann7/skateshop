import * as z from "zod"

import { checkoutItemSchema } from "@/lib/validations/cart"

export const getOrderedProductsSchema = z.object({
  checkoutItems: z.array(checkoutItemSchema),
})

export const getCheckoutSessionProductsSchema = z.object({
  storeId: z.number().optional(),
})

export const verifyOrderSchema = z.object({
  deliveryPostalCode: z.string().min(1, {
    message: "Please enter a valid postal code",
  }),
})
