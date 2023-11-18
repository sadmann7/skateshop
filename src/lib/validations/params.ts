import * as z from "zod"

export const searchParamsSchema = z.object({
  page: z.string().default("1"),
  per_page: z.string().default("10"),
})

export const productsSearchParamsSchema = searchParamsSchema.extend({
  sort: z.string().optional().default("createdAt.desc"),
  categories: z.string().optional(),
  subcategory: z.string().optional(),
  subcategories: z.string().optional(),
  price_range: z.string().optional(),
  store_ids: z.string().optional(),
  store_page: z.string().optional(),
  active: z.string().optional().default("true"),
})

export const dashboardProductsSearchParamsSchema = searchParamsSchema.extend({
  sort: z.string().optional().default("createdAt.desc"),
  name: z.string().optional(),
  category: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export const storesSearchParamsSchema = searchParamsSchema.extend({
  sort: z.string().optional().default("productCount.desc"),
  statuses: z.string().optional(),
})

export const purchasesSearchParamsSchema = searchParamsSchema.extend({
  sort: z.string().optional().default("createdAt.desc"),
  store: z.string().optional(),
  status: z.string().optional(),
})

export const ordersSearchParamsSchema = searchParamsSchema.extend({
  sort: z.string().optional().default("createdAt.desc"),
  customer: z.string().optional(),
  status: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export const customersSearchParamsSchema = searchParamsSchema.extend({
  sort: z.string().optional().default("createdAt.desc"),
  email: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})
