import { getCurrentUser } from "@/lib/session"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"

interface DashboardLayout {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayout) {
  const user = await getCurrentUser()

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader
        user={{
          name: user?.name,
          image: user?.image,
          email: user?.email,
        }}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
