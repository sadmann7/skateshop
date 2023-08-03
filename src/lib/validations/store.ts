import * as z from "zod"

export const storeSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(3).max(255).optional(),
})

export const getStoreSchema = z.object({
  id: z.number(),
  userId: z.string(),
})

export const getPublicStoreSchema = z.object({
  limit: z.number().default(10),
  offset: z.number().default(0),
  sort: z
    .string()
    .regex(/^\w+.(asc|desc)$/)
    .optional()
    .nullable(),
})
