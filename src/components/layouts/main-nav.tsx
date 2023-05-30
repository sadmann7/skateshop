"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { NavItem } from "@/types"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="hidden gap-6 md:flex">
      <Link href="/" className="hidden items-center space-x-2 lg:flex">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="flex items-center space-x-6 text-sm font-semibold">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-muted-foreground transition-colors hover:text-foreground/80",
                    pathname === item.href && "text-foreground",
                    item.disabled && "pointer-events-none opacity-60"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
