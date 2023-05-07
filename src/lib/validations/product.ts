import { PRODUCT_CATEGORY } from "@prisma/client"
import { z } from "zod"

export const addProductSchema = z.object({
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string().optional(),
  category: z.nativeEnum(PRODUCT_CATEGORY),
  price: z.number().positive({
    message: "Must be a positive number",
  }),
  quantity: z.number().positive({
    message: "Must be a positive number",
  }),
  inventory: z.number().positive({
    message: "Must be a positive number",
  }),
  images: z.array(z.string()).optional(),
})
