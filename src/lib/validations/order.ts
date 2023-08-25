import * as z from "zod"

import { checkoutItemSchema } from "@/lib/validations/cart"

export const getOrderedProductsSchema = z.object({
  checkoutItems: z.array(checkoutItemSchema),
  storeId: z.number(),
})
