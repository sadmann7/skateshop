"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { newsletterSubscriptions } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { type z } from "zod"

import { resend } from "@/lib/resend"
import { type checkEmailSchema } from "@/lib/validations/auth"
import type {
  subscribeToNewsletterSchema,
  unsubscribeFromNewsletterSchema,
} from "@/lib/validations/email"
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

export async function subscribeToNewsletterAction(
  input: z.infer<typeof subscribeToNewsletterSchema>
) {
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
    subject: "Welcome to skateshop",
    react: NewsletterWelcomeEmail({
      firstName: user?.firstName ?? undefined,
      fromEmail: env.EMAIL_FROM_ADDRESS,
      token: crypto.randomUUID(),
    }),
  })

  // Save the email and user id to the database
  await db.insert(newsletterSubscriptions).values({
    email: input.email,
    userId: user?.id,
    token: crypto.randomUUID(),
  })

  revalidatePath("/")
}

export async function unsubscribeFromNewsletterAction(
  input: z.infer<typeof unsubscribeFromNewsletterSchema>
) {
  const subscription = await db.query.newsletterSubscriptions.findFirst({
    where: eq(newsletterSubscriptions.token, input.token),
  })

  if (!subscription) {
    throw new Error("You are not subscribed to the newsletter.")
  }

  await db
    .delete(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.token, input.token))

  revalidatePath("/")
}
