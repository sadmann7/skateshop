import * as z from "zod"

export const addStoreSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(3).max(255).optional(),
})

export const updateStoreSchema = z.object({
  ...addStoreSchema.shape,
  id: z.number(),
})
