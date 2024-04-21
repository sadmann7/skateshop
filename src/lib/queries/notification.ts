import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { notifications } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export async function getNotification(input: {
  token?: string
  email?: string
}) {
  noStore()

  try {
    const notification = await db
      .select({
        token: notifications.token,
        email: notifications.email,
        newsletter: notifications.newsletter,
        marketing: notifications.marketing,
      })
      .from(notifications)
      .where(
        input.token
          ? eq(notifications.token, input.token)
          : input.email
            ? eq(notifications.email, input.email)
            : input.token && input.email
              ? and(
                  eq(notifications.token, input.token),
                  eq(notifications.email, input.email)
                )
              : undefined
      )
      .then((res) => res[0])

    return notification
  } catch (err) {
    return null
  }
}
