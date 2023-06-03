"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { MainNavItem, SidebarNavItem } from "@/types"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

interface MobileNavProps {
  mainNavItems?: MainNavItem[]
  sidebarNavItems: SidebarNavItem[]
}

export function MobileNav({ mainNavItems, sidebarNavItems }: MobileNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent size="full" position="left" className="pl-1 pr-0">
        <Link
          href="/"
          className="flex items-center pl-6"
          onClick={() => setIsOpen(false)}
        >
          <Icons.logo className="mr-2 h-4 w-4" />
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <h4 className="font-medium">Main Menu</h4>
            {mainNavItems?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "ml-2.5 text-foreground/70 transition-colors hover:text-foreground",
                      pathname === item.href && "text-foreground",
                      item.disabled && "pointer-events-none opacity-60"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                )
            )}
          </div>
          <div className="mt-4 flex flex-col space-y-3">
            <h4 className="font-medium">Side Menu</h4>
            {sidebarNavItems?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "ml-2.5 text-foreground/70 transition-colors hover:text-foreground",
                      pathname === item.href && "text-foreground",
                      item.disabled && "pointer-events-none opacity-60"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                )
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
