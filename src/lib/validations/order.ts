import * as z from "zod"

export const getOrderLineItemsSchema = z.object({
  storeId: z.number(),
  items: z.string().optional(),
})

export const verifyOrderSchema = z.object({
  deliveryPostalCode: z.string().min(1, {
    message: "Please enter a valid postal code",
  }),
})
