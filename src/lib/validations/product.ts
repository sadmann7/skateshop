import * as z from "zod"

export const addProductSchema = z.object({
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string().optional(),
  categoryId: z.string(),
  subcategoryId: z.string().optional().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Must be a valid price",
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

export const getProductInventorySchema = z.object({
  id: z.string(),
})

export const getProductsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional().default("createdAt.desc"),
  categories: z.string().optional(),
  subcategory: z.string().optional(),
  subcategories: z.string().optional(),
  price_range: z.string().optional(),
  store_ids: z.string().optional(),
  store_page: z.coerce.number().default(1),
  active: z.string().optional().default("true"),
})

export const updateProductRatingSchema = z.object({
  id: z.string(),
  rating: z.number(),
})
