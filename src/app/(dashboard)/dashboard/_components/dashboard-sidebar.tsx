import * as React from "react"

import { dashboardConfig } from "@/config/dashboard"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarNav } from "@/components/layouts/sidebar-nav"

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function DashboardSidebar({
  children,
  className,
  ...props
}: DashboardSidebarProps) {
  return (
    <aside className={cn("w-full", className)} {...props}>
      <div className="pr-6 pt-4 lg:pt-6">{children}</div>
      <ScrollArea className="h-[calc(100vh-8rem)] py-2.5 pr-6">
        <SidebarNav items={dashboardConfig.sidebarNav} className="p-1 pt-4" />
      </ScrollArea>
    </aside>
  )
}
