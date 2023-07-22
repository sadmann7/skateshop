"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { emailPreferences } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { type z } from "zod"

import { resend } from "@/lib/resend"
import type { updateEmailPreferencesSchema } from "@/lib/validations/email"
import NewsletterWelcomeEmail from "@/components/emails/newsletter-welcome-email"

// Email can not be sent through a server action in production, because it is returning an email component maybe?
// So we are using the route handler /api/newsletter/subscribe instead

export async function updateEmailPreferencesAction(
  input: z.infer<typeof updateEmailPreferencesSchema>
) {
  const emailPreference = await db.query.emailPreferences.findFirst({
    where: eq(emailPreferences.token, input.token),
  })

  if (!emailPreference) {
    throw new Error("Email not found.")
  }

  const user = await currentUser()

  if (input.newsletter && !emailPreference.newsletter) {
    await resend.emails.send({
      from: env.EMAIL_FROM_ADDRESS,
      to: emailPreference.email,
      subject: "Welcome to skateshop",
      react: NewsletterWelcomeEmail({
        firstName: user?.firstName ?? undefined,
        fromEmail: env.EMAIL_FROM_ADDRESS,
        token: input.token,
      }),
    })
  }

  await db
    .update(emailPreferences)
    .set({
      ...input,
      userId: user?.id,
    })
    .where(eq(emailPreferences.token, input.token))

  revalidatePath("/")
}
