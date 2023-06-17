import { type Metadata } from "next"

import { ResetPasswordStep2Form } from "@/components/forms/reset-password-form-step2"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Enter your email to reset your password",
}

export default function ResetPasswordStep2Page() {
  return (
    <Shell layout="auth">
      <ResetPasswordStep2Form />
    </Shell>
  )
}
