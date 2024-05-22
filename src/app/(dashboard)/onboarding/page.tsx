import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { Shell } from "@/components/shell"

import { Onboarding } from "./_components/onboarding"

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Get started with your new store",
}

export default function OnboardingPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/signin")
  }

  return (
    <Shell>
      <Onboarding userId={userId} />
    </Shell>
  )
}
