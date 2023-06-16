import * as z from "zod"

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export const emailVerificationSchema = z.object({
  code: z.string().min(6).max(6),
})
