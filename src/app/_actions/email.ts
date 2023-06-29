"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { emailPreferences } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { type z } from "zod"

import { resend } from "@/lib/resend"
import type { manageEmailSchema } from "@/lib/validations/email"
import NewsletterWelcomeEmail from "@/components/emails/newsletter-welcome-email"

export async function manageEmailAction(
  input: z.infer<typeof manageEmailSchema>
) {
  const emailPreference = await db.query.emailPreferences.findFirst({
    where: eq(emailPreferences.email, input.email),
  })

  if (!emailPreference) {
    throw new Error("Email not found.")
  }

  if (emailPreference.email !== input.token) {
    throw new Error("Invalid token.")
  }

  const user = await currentUser()

  if (input.newsletter && !emailPreference.newsletter) {
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
  }

  await db
    .update(emailPreferences)
    .set({
      ...input,
      userId: user?.id,
    })
    .where(eq(emailPreferences.email, input.email))

  revalidatePath("/")
}
