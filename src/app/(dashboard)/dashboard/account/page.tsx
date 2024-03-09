import type { Metadata } from "next"
import { env } from "@/env.js"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"

import { UserProfile } from "./_components/user-profile"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Account",
  description: "Manage your account settings",
}

export default function AccountPage() {
  return (
    <Shell variant="sidebar">
      <PageHeader>
        <PageHeaderHeading size="sm">Account</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your account settings
        </PageHeaderDescription>
      </PageHeader>
      <section className="w-full overflow-hidden">
        <UserProfile />
      </section>
    </Shell>
  )
}
