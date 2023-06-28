"use server"

import { db } from "@/db"
import { newsletterSubscriptions } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { Resend } from "resend"
import { type z } from "zod"

import { type checkEmailSchema } from "@/lib/validations/auth"
import NewsletterWelcomeEmail from "@/components/emails/newsletter-welcome-email"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function joinNewsletterAction(
  input: z.infer<typeof checkEmailSchema> & { name?: string }
) {
  // const user = await currentUser()

  // const existingEmail = await db.query.newsletterSubscriptions.findFirst({
  //   where: eq(newsletterSubscriptions.email, input.email),
  // })

  // if (existingEmail) {
  //   throw new Error("You are already subscribed to the newsletter.")
  // }

  // await db.insert(newsletterSubscriptions).values({
  //   email: input.email,
  //   userId: user?.id,
  // })

  await resend.sendEmail({
    from: env.RESEND_API_KEY,
    to: input.email,
    subject: "Welcome to the newsletter!",
    react: NewsletterWelcomeEmail({
      name: input.name,
    }),
  })
}
