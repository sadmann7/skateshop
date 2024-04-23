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
import { ResetPasswordConfirmForm } from "@/app/(auth)/_components/reset-password-confirm-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Reset Password",
  description: "Enter your email to reset your password",
}

export default function ResetPasswordConfirmPage() {
  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>
            Enter your email address and we will send you a verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordConfirmForm />
        </CardContent>
      </Card>
    </Shell>
  )
}
