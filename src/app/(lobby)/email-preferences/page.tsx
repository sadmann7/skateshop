import type { Metadata } from "next"

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

export default function EmailPreferencesPage({
  searchParams,
}: EmailPreferencesPageProps) {
  const token = typeof searchParams.token === "string" ? searchParams.token : ""

  return (
    <Shell className="place-items-center">
      <Header title="Email Preferences" className="text-center" />
      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Manage your email preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateEmailPreferencesForm token={token} />
        </CardContent>
      </Card>
    </Shell>
  )
}
