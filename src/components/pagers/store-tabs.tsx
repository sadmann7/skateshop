"use client"

import { useRouter, useSelectedLayoutSegment } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface StoreTabsProps {
  storeId: number
}

export function StoreTabs({ storeId }: StoreTabsProps) {
  const router = useRouter()
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
    <Tabs
      className="sticky top-0 z-30 w-full overflow-auto bg-background px-1"
      defaultValue={tabs.find((tab) => tab.isActive)?.href ?? tabs[0]?.href}
      onValueChange={(value) => router.push(value)}
    >
      <TabsList className=" inline-flex items-center justify-center space-x-1.5 text-muted-foreground">
        {tabs.map((tab) => (
          <div
            role="none"
            key={tab.href}
            className={cn(
              "border-b-2 border-transparent py-1.5",
              tab.isActive && "border-foreground"
            )}
          >
            <TabsTrigger
              value={tab.href}
              className={cn(
                "rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary",
                tab.isActive && "text-foreground shadow"
              )}
            >
              {tab.title}
            </TabsTrigger>
          </div>
        ))}
      </TabsList>
      <Separator />
    </Tabs>
  )
}
