"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { emailPreferences } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { type z } from "zod"

import { resend } from "@/lib/resend"
import {
  joinNewsletterSchema,
  updateEmailPreferencesSchema,
} from "@/lib/validations/email"
import NewsletterWelcomeEmail from "@/components/emails/newsletter-welcome-email"

export async function joinNewsletter(
  rawInput: z.infer<typeof joinNewsletterSchema>
) {
  const input = joinNewsletterSchema.parse(rawInput)

  const emailPreference = await db.query.emailPreferences.findFirst({
    where: eq(emailPreferences.email, input.email),
  })

  if (emailPreference?.newsletter) {
    throw new Error("You are already subscribed to the newsletter.")
  }

  const user = await currentUser()

  const subject = input.subject ?? "Welcome to our newsletter"

  // If email preference exists, update it and send the email
  if (emailPreference) {
    await db
      .update(emailPreferences)
      .set({
        newsletter: true,
      })
      .where(eq(emailPreferences.email, input.email))

    await resend.emails.send({
      from: env.EMAIL_FROM_ADDRESS,
      to: input.email,
      subject,
      react: NewsletterWelcomeEmail({
        firstName: user?.firstName ?? undefined,
        fromEmail: env.EMAIL_FROM_ADDRESS,
        token: emailPreference.token,
      }),
    })
  } else {
    // If email preference does not exist, create it and send the email
    await resend.emails.send({
      from: env.EMAIL_FROM_ADDRESS,
      to: input.email,
      subject,
      react: NewsletterWelcomeEmail({
        firstName: user?.firstName ?? undefined,
        fromEmail: env.EMAIL_FROM_ADDRESS,
        token: input.token,
      }),
    })

    await db.insert(emailPreferences).values({
      email: input.email,
      token: input.token,
      userId: user?.id,
      newsletter: true,
    })
  }
}

export async function updateEmailPreferences(
  rawInput: z.infer<typeof updateEmailPreferencesSchema>
) {
  const input = updateEmailPreferencesSchema.parse(rawInput)

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
