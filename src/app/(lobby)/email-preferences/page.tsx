import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { emailPreferences } from "@/db/schema"
import { eq } from "drizzle-orm"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UpdateEmailPreferencesForm } from "@/components/forms/update-email-preferences-form"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
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

  const emailPreference = await db.query.emailPreferences.findFirst({
    where: eq(emailPreferences.token, token),
  })

  if (!emailPreference) {
    notFound()
  }

  return (
    <Shell className="max-w-2xl justify-center">
      <Header title="Email Preferences" className="text-center" />
      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Manage your email preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateEmailPreferencesForm emailPreference={emailPreference} />
        </CardContent>
      </Card>
    </Shell>
  )
}
