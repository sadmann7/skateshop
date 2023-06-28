import { NextResponse } from "next/server"
import { db } from "@/db"
import { newsletterSubscriptions } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import { Resend } from "resend"

import { checkEmailSchema } from "@/lib/validations/auth"
import NewsletterWelcomeEmail from "@/components/emails/newsletter-welcome-email"

const resend = new Resend(env.RESEND_API_KEY)

export async function POST(req: Request) {
  const input = checkEmailSchema.parse(await req.json())

  try {
    const user = await currentUser()

    // Using the resend provider to send the email
    // We can also use nodemailer, sendgrid, postmark, aws ses, mailersend, or plunk
    const data = await resend.emails.send({
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

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}
