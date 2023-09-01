"use client"

import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface StoreTabsProps extends React.ComponentPropsWithoutRef<"nav"> {
  storeId: number
}

export function StoreTabs({ className, storeId, ...props }: StoreTabsProps) {
  const segment = useSelectedLayoutSegment()

  const tabs = [
    {
      title: "Store",
      href: `/dashboard/stores/${storeId}`,
      isActive: segment === null,
    },
    {
      title: "Products",
      href: `/dashboard/stores/${storeId}/products`,
      isActive: segment === "products",
    },
    {
      title: "Orders",
      href: `/dashboard/stores/${storeId}/orders`,
      isActive: segment === "orders",
    },
    {
      title: "Analytics",
      href: `/dashboard/stores/${storeId}/analytics`,
      isActive: segment === "analytics",
    },
  ]

  return (
    <nav
      aria-label="Store navigation"
      className={cn("sticky top-0 z-30 w-full bg-background", className)}
      {...props}
    >
      <ul role="tablist" className="flex w-full items-center space-x-1">
        {tabs.map((tab) => (
          <li
            role="tab"
            key={tab.href}
            className={cn(
              "border-b-2 border-transparent py-2.5",
              tab.isActive && "border-primary"
            )}
          >
            <Link
              href={tab.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary",
                tab.isActive && "bg-muted text-primary"
              )}
              aria-selected={tab.isActive}
              aria-controls={`panel-${tab.title.toLowerCase()}`}
              tabIndex={tab.isActive ? 0 : -1}
            >
              {tab.title}
            </Link>
          </li>
        ))}
      </ul>
      <Separator />
    </nav>
  )
}
