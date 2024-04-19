import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { notifications } from "@/db/schema"
import { env } from "@/env.js"
import type { SearchParams } from "@/types"
import { eq } from "drizzle-orm"
import { z } from "zod"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"

import { UpdateNotificationForm } from "./_components/update-notification-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Email Preferences",
  description: "Manage your email preferences",
}

interface EmailPreferencesPageProps {
  searchParams: SearchParams
}

const schema = z.object({
  token: z.string().optional(),
})

export default async function EmailPreferencesPage({
  searchParams,
}: EmailPreferencesPageProps) {
  const { token } = schema.parse(searchParams)

  if (!token) {
    redirect("/")
  }

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
