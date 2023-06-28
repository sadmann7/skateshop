"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { newsletterSubscriptions } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { Resend } from "resend"
import { type z } from "zod"

import { type checkEmailSchema } from "@/lib/validations/auth"
import NewsletterWelcomeEmail from "@/components/emails/newsletter-welcome-email"

export async function checkExistingEmailAction(
  input: z.infer<typeof checkEmailSchema>
) {
  const existingEmail = await db.query.newsletterSubscriptions.findFirst({
    where: eq(newsletterSubscriptions.email, input.email),
  })

  if (existingEmail) {
    throw new Error("You are already subscribed to the newsletter.")
  }
}

// Resend doesn't work in the server action in production
// So using route handler instead
export async function joinNewsletterAction(
  input: z.infer<typeof checkEmailSchema>
) {
  const resend = new Resend(env.RESEND_API_KEY)
  const user = await currentUser()

  const existingEmail = await db.query.newsletterSubscriptions.findFirst({
    where: eq(newsletterSubscriptions.email, input.email),
  })

  if (existingEmail) {
    throw new Error("You are already subscribed to the newsletter.")
  }

  // Using the resend provider to send the email
  // We can also use nodemailer, sendgrid, postmark, aws ses, mailersend, or plunk
  await resend.emails.send({
    from: env.EMAIL_FROM_ADDRESS,
    to: input.email,
    subject: "Welcome to the newsletter!",
    react: NewsletterWelcomeEmail({
      firstName: user?.firstName ?? undefined,
      fromEmail: env.EMAIL_FROM_ADDRESS,
    }),
  })

  // Save the email and user id to the database
  await db.insert(newsletterSubscriptions).values({
    email: input.email,
    userId: user?.id,
  })

  revalidatePath("/")
}
