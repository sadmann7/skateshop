import { SignIn } from "@clerk/nextjs"

import { Shell } from "@/components/shell"

export default function SigninPage() {
  return (
    <Shell layout="auth">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </Shell>
  )
}
