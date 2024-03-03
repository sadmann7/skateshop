import * as z from "zod"

import { slugify } from "@/lib/utils"

export const addStoreSchema = z
  .object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
    slug: z.string().optional(),
  })
  .refine((data) => {
    if (!data.slug) {
      data.slug = slugify(data.name)
    }
    return true
  })

export const getStoreSchema = z.object({
  id: z.number(),
  userId: z.string(),
})

export const getStoresSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional().default("productCount.desc"),
  statuses: z.string().optional(),
  categories: z.string().optional(),
  subcategory: z.string().optional(),
  subcategories: z.string().optional(),
  price_range: z.string().optional(),
  store_ids: z.string().optional(),
  store_page: z.coerce.number().default(1),
  active: z.string().optional().default("true"),
  user_id: z.string().optional(),
})

export const updateStoreSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().optional(),
})
