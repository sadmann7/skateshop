"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StoreTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
  storeId: number
}

export function StoreTabs({ className, storeId, ...props }: StoreTabsProps) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    {
      title: "Store",
      href: `/dashboard/stores/${storeId}`,
    },
    {
      title: "Products",
      href: `/dashboard/stores/${storeId}/products`,
    },
    {
      title: "Orders",
      href: `/dashboard/stores/${storeId}/orders`,
    },
    {
      title: "Payments",
      href: `/dashboard/stores/${storeId}/payments`,
    },
    {
      title: "Analytics",
      href: `/dashboard/stores/${storeId}/analytics`,
    },
  ]

  return (
    <Tabs
      {...props}
      className={cn("w-full overflow-x-auto overflow-y-hidden", className)}
      onValueChange={(value) => router.push(value)}
    >
      <TabsList>
        {tabs.map((tab) => (
          <Link key={tab.title} href={tab.href}>
            <TabsTrigger
              value={tab.href}
              className={cn(
                pathname === tab.href &&
                  "bg-background text-foreground shadow-sm"
              )}
            >
              {tab.title}
            </TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  )
}
