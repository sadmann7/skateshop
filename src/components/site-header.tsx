"use client"

import Link from "next/link"
import type { SessionUser } from "@/types"
import { signIn, signOut } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"

interface SiteHeaderProps {
  user: Pick<SessionUser, "name" | "image" | "email">
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Button
              aria-label="Cart"
              variant="ghost"
              size="sm"
              className="w-9 px-0"
            >
              <Icons.cart className="h-6 w-6" />
            </Button>
            {user.name && user.image && user.email ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="User menu trigger"
                    variant="ghost"
                    size="sm"
                    className="h-auto rounded-full p-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.name && <p className="font-medium">{user.name}</p>}
                      {user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/stores">
                      <Icons.store className="mr-2 h-4 w-4" />
                      Stores
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Icons.settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    aria-label="Sign out"
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault()
                      void signOut()
                    }}
                  >
                    <Icons.logout className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                aria-label="Sign in"
                size="sm"
                onClick={() => void signIn("google")}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
