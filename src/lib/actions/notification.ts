"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { notifications } from "@/db/schema"
import { env } from "@/env.js"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { type z } from "zod"

import { getErrorMessage } from "@/lib/handle-error"
import { resend } from "@/lib/resend"
import type { updateNotificationSchema } from "@/lib/validations/notification"
import NewsletterWelcomeEmail from "@/components/emails/newsletter-welcome-email"

export async function updateNotification(
  input: z.infer<typeof updateNotificationSchema>
) {
  try {
    const notification = await db.query.notifications.findFirst({
      where: eq(notifications.token, input.token),
    })

    if (!notification) {
      throw new Error("Email not found.")
    }

    const user = await currentUser()

    if (input.newsletter && !notification.newsletter) {
      await resend.emails.send({
        from: env.EMAIL_FROM_ADDRESS,
        to: notification.email,
        subject: "Welcome to skateshop",
        react: NewsletterWelcomeEmail({
          firstName: user?.firstName ?? undefined,
          fromEmail: env.EMAIL_FROM_ADDRESS,
          token: input.token,
        }),
      })
    }

    await db
      .update(notifications)
      .set({
        ...input,
        userId: user?.id,
      })
      .where(eq(notifications.token, input.token))

    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
