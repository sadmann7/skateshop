"use client";

import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface StoreTabsProps {
  storeId: string;
}

export function StoreTabs({ storeId }: StoreTabsProps) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

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
      title: "Customers",
      href: `/dashboard/stores/${storeId}/customers`,
      isActive: segment === "customers",
    },
    {
      title: "Analytics",
      href: `/dashboard/stores/${storeId}/analytics`,
      isActive: segment === "analytics",
    },
  ];

  return (
    <Tabs
      defaultValue={tabs.find((tab) => tab.isActive)?.href ?? tabs[0]?.href}
      className="sticky top-0 z-30 size-full overflow-auto bg-background px-1"
      onValueChange={(value) => router.push(value)}
    >
      <ScrollArea className="pb-2.5">
        <ScrollBar orientation="horizontal" />
        <TabsList className="inline-flex items-center justify-center space-x-1.5 text-muted-foreground">
          {tabs.map((tab) => (
            <div
              key={tab.href}
              className={cn(
                "border-transparent border-b-2 py-1.5",
                tab.isActive && "border-foreground",
              )}
            >
              <TabsTrigger
                value={tab.href}
                className={cn(
                  "inline-flex items-center justify-center rounded-sm px-3 py-1.5 font-medium text-muted-foreground text-sm ring-offset-background transition-all hover:bg-muted hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  tab.isActive && "text-foreground",
                )}
                asChild
              >
                <Link href={tab.href}>{tab.title}</Link>
              </TabsTrigger>
            </div>
          ))}
        </TabsList>
        <Separator />
      </ScrollArea>
    </Tabs>
  );
}
