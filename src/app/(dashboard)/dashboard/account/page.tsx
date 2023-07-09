import type { Metadata } from "next"
import { env } from "@/env.mjs"
import { UserProfile } from "@clerk/nextjs"

import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Account",
  description: "Manage your account settings",
}

export default function AccountPage() {
  return (
    <Shell variant="sidebar">
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
