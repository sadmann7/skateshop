import { SignUp } from "@clerk/nextjs"

export default function SignupPage() {
  return (
    <section className="mx-auto flex min-h-screen items-center justify-center px-4 py-6 sm:px-6">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </section>
  )
}
