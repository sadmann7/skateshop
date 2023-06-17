import { type Metadata } from "next"

import { SignUpForm } from "@/components/forms/signup-form"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for an account",
}

export default function SignUpPage() {
  return (
    <Shell layout="auth">
      <SignUpForm />
    </Shell>
  )
}
