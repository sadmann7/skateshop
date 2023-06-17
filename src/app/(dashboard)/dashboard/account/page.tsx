import type { Metadata } from "next"
import { UserProfile } from "@clerk/nextjs"

import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account settings",
}

export default function AccountPage() {
  return (
    <Shell layout="dashboard">
      <Header
        title="Account"
        description="Manage your account settings."
        size="sm"
      />
      <div className="w-full overflow-hidden rounded-lg">
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
      </div>
    </Shell>
  )
}
