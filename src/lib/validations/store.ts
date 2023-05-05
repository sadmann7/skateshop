import * as z from "zod"

export const addStoreSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255).optional(),
})
