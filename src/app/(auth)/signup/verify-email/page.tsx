import { type Metadata } from "next"

import { VerifyEmailForm } from "@/components/forms/verify-email-form"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to continue with your sign up",
}

export default function VerifyEmailPage() {
  return (
    <Shell layout="auth">
      <VerifyEmailForm />
    </Shell>
  )
}
