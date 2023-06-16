import { SignUp } from "@clerk/nextjs"

import { Shell } from "@/components/shell"

export default function SignupPage() {
  return (
    <Shell layout="auth">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </Shell>
  )
}
