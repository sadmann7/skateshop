import { type Metadata } from "next"

import { ResetPasswordForm } from "@/components/forms/reset-password-form"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Enter your email to reset your password",
}

export default function ResetPasswordPage() {
  return (
    <Shell layout="auth">
      <ResetPasswordForm />
    </Shell>
  )
}
