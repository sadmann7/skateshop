import * as z from "zod"

export const storeSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().optional(),
})

export const getStoreSchema = z.object({
  id: z.number(),
  userId: z.string(),
})

export const getStoresSchema = z.object({
  description: z.string().optional(),
  limit: z.number().default(10).optional(),
  offset: z.number().default(0).optional(),
  sort: z
    .string()
    .regex(/^\w+.(asc|desc)$/)
    .optional()
    .nullable(),
  statuses: z
    .string()
    .regex(/^\d+.\d+$/)
    .optional()
    .nullable(),
  userId: z.string().optional(),
})
