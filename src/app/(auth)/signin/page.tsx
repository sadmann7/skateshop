import { SignInForm } from "@/components/forms/signin-form"
import { Shell } from "@/components/shell"

export default function SignInPage() {
  return (
    <Shell layout="dashboard" className="mx-auto w-full sm:w-auto">
      <SignInForm />
    </Shell>
  )
}
