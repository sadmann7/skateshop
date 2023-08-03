import { db } from "@/db"
import { emailPreferences } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { type ErrorResponse } from "resend"
import { z } from "zod"

import { resend } from "@/lib/resend"
import { subscribeToNewsletterSchema } from "@/lib/validations/email"
import NewsletterWelcomeEmail from "@/components/emails/newsletter-welcome-email"

export async function POST(req: Request) {
  const input = subscribeToNewsletterSchema.parse(await req.json())

  try {
    const emailPreference = await db.query.emailPreferences.findFirst({
      where: eq(emailPreferences.email, input.email),
    })

    if (emailPreference?.newsletter) {
      return new Response("You are already subscribed to the newsletter.", {
        status: 409,
      })
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

    return new Response(null, { status: 200 })
  } catch (error) {
    console.error(error)

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    const resendError = error as ErrorResponse

    if (resendError?.error?.message) {
      return new Response(resendError.error.message, { status: 429 })
    }

    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }

    return new Response("Something went wrong", { status: 500 })
  }
}
