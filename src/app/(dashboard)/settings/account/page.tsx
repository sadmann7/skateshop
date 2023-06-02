import type { Metadata } from "next"
import { UserProfile } from "@clerk/nextjs"

import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account settings.",
}

export default function AccountPage() {
  return (
    <section className="container grid w-full items-center gap-8 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <Header title="Account" description="Manage your account settings." />
      </div>
      <UserProfile
        appearance={{
          variables: {
            borderRadius: "0.25rem",
          },
          elements: {
            card: "shadow-none",
            navbar: "hidden",
            navbarMobileMenuButton: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          },
        }}
      />
    </section>
  )
}
