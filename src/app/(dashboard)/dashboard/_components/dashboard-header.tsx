import Link from "next/link"
import type { User } from "@clerk/nextjs/server"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { AuthDropdown } from "@/components/layouts/auth-dropdown"

interface DashboardHeaderProps {
  user: User | null
  children: React.ReactNode
}

export function DashboardHeader({ user, children }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Link href="/" className="hidden items-center space-x-2 lg:flex">
          <Icons.logo className="size-6" aria-hidden="true" />
          <span className="hidden font-bold lg:inline-block">
            {siteConfig.name}
          </span>
          <span className="sr-only">Home</span>
        </Link>
        {children}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <AuthDropdown user={user} />
          </nav>
        </div>
      </div>
    </header>
  )
}
