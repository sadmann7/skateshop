import Link from "next/link"

import { cn } from "@/lib/utils"

interface StoreTabsProps {
  storeId: number
  activeTab: "store" | "products" | "orders" | "analytics"
}

export function StoreTabs({ storeId, activeTab }: StoreTabsProps) {
  const tabs = [
    {
      title: "Store",
      href: `/dashboard/stores/${storeId}`,
      active: activeTab === "store",
    },
    {
      title: "Products",
      href: `/dashboard/stores/${storeId}/products`,
      active: activeTab === "products",
    },
    {
      title: "Orders",
      href: `/dashboard/stores/${storeId}/orders`,
      active: activeTab === "orders",
    },
    {
      title: "Analytics",
      href: `/dashboard/stores/${storeId}/analytics`,
      active: activeTab === "analytics",
    },
  ]

  return (
    <div role="tablist">
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        {tabs.map((tab) => (
          <Link key={tab.title} href={tab.href}>
            <div
              role="tab"
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                tab.active && "bg-background text-foreground shadow-sm"
              )}
            >
              {tab.title}
              <span className="sr-only">{tab.active}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
