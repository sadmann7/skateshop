import * as z from "zod"
import { cartLineItemSchema } from "@/lib/validations/cart"

export const ratesSchema = z.object({
  toAddress: z.object({
    street1: z.string(),
    street2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    company: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  items: z.array(cartLineItemSchema),
  storeId: z.number(),
})
