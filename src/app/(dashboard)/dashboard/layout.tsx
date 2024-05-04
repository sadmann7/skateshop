import { redirect } from "next/navigation"

import { getStoresByUserId } from "@/lib/actions/store"
import { getCachedUser, getUserPlanMetrics } from "@/lib/queries/user"

import { DashboardHeader } from "./_components/dashboard-header"
import { DashboardSidebar } from "./_components/dashboard-sidebar"
import { DashboardSidebarSheet } from "./_components/dashboard-sidebar-sheet"
import { SidebarProvider } from "./_components/sidebar-provider"
import { StoreSwitcher } from "./_components/store-switcher"

export default async function DashboardLayout({
  children,
}: React.PropsWithChildren) {
  const user = await getCachedUser()

  if (!user) {
    redirect("/signin")
  }

  const storesPromise = getStoresByUserId({ userId: user.id })
  const planMetricsPromise = getUserPlanMetrics({ userId: user.id })

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[17.5rem_1fr]">
        <DashboardSidebar className="top-0 z-30 hidden flex-col gap-4 border-r border-border/60 lg:sticky lg:block">
          <StoreSwitcher
            userId={user.id}
            storesPromise={storesPromise}
            planMetricsPromise={planMetricsPromise}
          />
        </DashboardSidebar>
        <div className="flex flex-col overflow-hidden">
          <DashboardHeader user={user}>
            <DashboardSidebarSheet className="lg:hidden">
              <DashboardSidebar>
                <StoreSwitcher
                  userId={user.id}
                  storesPromise={storesPromise}
                  planMetricsPromise={planMetricsPromise}
                />
              </DashboardSidebar>
            </DashboardSidebarSheet>
          </DashboardHeader>
          <main className="flex-1 px-4 lg:px-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
