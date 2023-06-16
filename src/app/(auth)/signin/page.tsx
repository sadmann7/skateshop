import { SignIn } from "@clerk/nextjs"

export default function AuthPage() {
  return (
    <section className="mx-auto flex min-h-screen items-center justify-center px-4 py-6 sm:px-6">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </section>
  )
}
