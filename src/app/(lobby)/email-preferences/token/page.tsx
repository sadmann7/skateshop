import type { Metadata } from "next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ManageEmailForm } from "@/components/forms/manage-email-form"
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
  const email = typeof searchParams.email === "string" ? searchParams.email : ""

  return (
    <Shell>
      <Header
        title="Email Preferences"
        description="Manage your email preferences"
      />
      <Card>
        <CardHeader>
          <CardTitle>Manage your email preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <ManageEmailForm email={email} token={token} />
        </CardContent>
      </Card>
    </Shell>
  )
}
