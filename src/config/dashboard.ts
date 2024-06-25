import { type SidebarNavItem } from "@/types"

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard/stores",
      icon: "store",
      items: [],
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "credit",
      items: [],
    },
    {
      title: "Purchases",
      href: "/dashboard/purchases",
      icon: "dollarSign",
      items: [],
    },
    {
      title: "Account",
      href: "/dashboard/account",
      icon: "avatar",
      items: [],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
      items: [],
    },
  ],
}
