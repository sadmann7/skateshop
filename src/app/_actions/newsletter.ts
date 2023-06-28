"use server"

import { db } from "@/db"
import { newsletterSubscriptions } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { type z } from "zod"

import { type checkEmailSchema } from "@/lib/validations/auth"

export async function joinNewsletterAction(
  input: z.infer<typeof checkEmailSchema>
) {
  const user = await currentUser()

  const existingEmail = await db.query.newsletterSubscriptions.findFirst({
    where: eq(newsletterSubscriptions.email, input.email),
  })

  if (existingEmail) {
    throw new Error("You are already subscribed to the newsletter.")
  }

  await db.insert(newsletterSubscriptions).values({
    email: input.email,
    userId: user?.id,
  })
}
