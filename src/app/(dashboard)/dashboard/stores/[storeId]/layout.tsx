import { redirect } from "next/navigation"
import { type SidebarNavItem } from "@/types"
import { currentUser } from "@clerk/nextjs"

import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarNav } from "@/components/layouts/sidebar-nav"

interface StoreLayoutProps {
  children: React.ReactNode
  params: {
    storeId: number
  }
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  const { storeId } = params

  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const sidebarNavItems = [
    {
      title: "Store",
      href: `/dashboard/stores/${storeId}`,
      icon: "store",
      items: [],
    },
    {
      title: "Products",
      href: `/dashboard/stores/${storeId}/products`,
      icon: "product",
      items: [],
    },
    {
      title: "Orders",
      href: `/dashboard/stores/${storeId}/orders`,
      icon: "wallet",
      items: [],
    },
    {
      title: "Payments",
      href: `/dashboard/stores/${storeId}/payments`,
      icon: "billing",
      items: [],
    },
    {
      title: "Analytics",
      href: `/dashboard/stores/${storeId}/analytics`,
      icon: "chart",
      items: [],
    },
  ] satisfies SidebarNavItem[]

  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <ScrollArea className="py-6 pr-6 lg:py-8">
          <SidebarNav items={sidebarNavItems} />
        </ScrollArea>
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
