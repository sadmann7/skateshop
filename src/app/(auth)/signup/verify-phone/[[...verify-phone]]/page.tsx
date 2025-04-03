import { type Metadata } from "next"
import { env } from "@/env.js"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Shell } from "@/components/shell"
import { VerifyPhoneForm } from "@/app/(auth)/_components/verify-phone-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Verify Phone Number",
  description: "Verify your phone number to continue with your sign up",
}

export default function VerifyPhonePage() {
  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Verify phone number</CardTitle>
          <CardDescription>
            Verify your phone number to complete your account creation
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <VerifyPhoneForm />
        </CardContent>
      </Card>
    </Shell>
  )
}
