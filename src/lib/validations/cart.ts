import * as z from "zod"

export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(0),
})

export const checkoutItemSchema = cartItemSchema.extend({
  price: z.number(),
})

export const cartLineItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
      })
    )
    .optional()
    .nullable(),
  category: z.string().optional().nullable(),
  subcategory: z.string().optional().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  inventory: z.number().default(0),
  quantity: z.number(),
  storeId: z.string(),
  storeName: z.string().optional().nullable(),
  storeStripeAccountId: z.string().optional().nullable(),
})

export const deleteCartItemSchema = z.object({
  productId: z.string(),
})

export const deleteCartItemsSchema = z.object({
  productIds: z.array(z.string()),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().min(0).default(1),
})
