"use client"

import * as React from "react"
import { useParams } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { type getStoresByUserId } from "@/lib/actions/store"
import { type getSubscriptionPlan } from "@/lib/actions/stripe"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarNav } from "@/components/layouts/sidebar-nav"

import { StoreSwitcher } from "./store-switcher"

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLElement> {
  promises: Promise<{
    stores: Awaited<ReturnType<typeof getStoresByUserId>>
    subscriptionPlan: Awaited<ReturnType<typeof getSubscriptionPlan>>
  }>
}

export function DashboardSidebar({
  promises,
  className,
  ...props
}: DashboardSidebarProps) {
  const { stores, subscriptionPlan } = React.use(promises)

  const { storeId } = useParams<{ storeId: string }>()

  const currentStore = stores.find((store) => store.id === storeId)

  return (
    <aside className={cn("w-full", className)} {...props}>
      <div className="pr-6 pt-4 lg:pt-6">
        <StoreSwitcher
          currentStore={currentStore}
          stores={stores}
          subscriptionPlan={subscriptionPlan}
        />
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)] py-4 pr-6">
        <SidebarNav items={dashboardConfig.sidebarNav} className="p-1 pt-4" />
      </ScrollArea>
    </aside>
  )
}
