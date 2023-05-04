import * as z from "zod"

export const ogImageSchema = z.object({
  title: z.string(),
  description: z.string(),
  mode: z.enum(["light", "dark"]).default("dark"),
})
