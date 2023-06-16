import * as z from "zod"

export const authSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8).max(100),
})

export const verfifyEmailSchema = z.object({
  code: z.string().min(6).max(6),
})
