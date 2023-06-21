import { products } from "@/db/schema"
import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string().optional(),
  category: z
    .enum(products.category.enumValues, {
      required_error: "Must be a valid category",
    })
    .default(products.category.enumValues[0]),
  subcategories: z.array(z.string()).optional().nullable().default(null),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Must be a valid price",
  }),
  quantity: z.number().positive({
    message: "Must be a positive number",
  }),
  inventory: z.number(),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
})

export const filterProductsSchema = z.object({
  query: z.string(),
})

export const getProductSchema = z.object({
  id: z.number(),
  storeId: z.number(),
})

export const getProductsSchema = z.object({
  limit: z.number().default(10),
  offset: z.number().default(0),
  category: z.enum(products.category.enumValues).optional().nullable(),
  categories: z
    .string()
    .regex(/^\d+-\d+$/)
    .optional()
    .nullable(),
  subcategories: z
    .string()
    .regex(/^\d+-\d+$/)
    .optional()
    .nullable(),
  sort: z
    .string()
    .regex(/^\w+-(asc|desc)$/)
    .optional()
    .nullable(),
  price_range: z
    .string()
    .regex(/^\d+-\d+$/)
    .optional()
    .nullable(),
  store_ids: z
    .string()
    .regex(/^\d+-\d+$/)
    .optional()
    .nullable(),
})
