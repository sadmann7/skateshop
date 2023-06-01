import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"

interface DashboardLayout {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayout) {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
