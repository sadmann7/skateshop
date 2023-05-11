import { PRODUCT_CATEGORY } from "@prisma/client"
import { z } from "zod"

export const addProductSchema = z.object({
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string().optional(),
  category: z
    .nativeEnum(PRODUCT_CATEGORY, {
      required_error: "Must be a valid category",
    })
    .default(PRODUCT_CATEGORY.SKATEBOARD),
  price: z.number().positive({
    message: "Must be a positive number",
  }),
  quantity: z.number().positive({
    message: "Must be a positive number",
  }),
  inventory: z.number().positive({
    message: "Must be a positive number",
  }),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Must be an array of File")
    .default([]),
})
