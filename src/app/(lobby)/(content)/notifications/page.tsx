import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { notifications } from "@/db/schema"
import { env } from "@/env.js"
import { eq } from "drizzle-orm"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UpdateNotificationForm } from "@/components/forms/update-notification-form"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Email Preferences",
  description: "Manage your email preferences",
}

interface EmailPreferencesPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function EmailPreferencesPage({
  searchParams,
}: EmailPreferencesPageProps) {
  const token = typeof searchParams.token === "string" ? searchParams.token : ""

  const notification = await db.query.notifications.findFirst({
    where: eq(notifications.token, token),
  })

  if (!notification) {
    notFound()
  }

  return (
    <Shell variant="centered">
      <PageHeader title="Email Preferences" className="text-center" />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Manage your email preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateNotificationForm notification={notification} />
        </CardContent>
      </Card>
    </Shell>
  )
}
