import * as z from "zod"

export const ogImageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.string().optional(),
  mode: z.enum(["light", "dark"]).default("dark"),
})
