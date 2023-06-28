import * as z from "zod"

export const subscribeToNewsletterSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export const unsubscribeFromNewsletterSchema = z.object({
  token: z.string(),
})
