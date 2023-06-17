import { type Metadata } from "next"

import { SignInForm } from "@/components/forms/signin-form"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
}

export default function SignInPage() {
  return (
    <Shell layout="auth">
      <SignInForm />
    </Shell>
  )
}
