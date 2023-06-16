import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

interface DashboardLayout {
  children: React.ReactNode
}

export default function AuthLayout({ children }: DashboardLayout) {
  return (
    <div className="relative grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url(https://source.unsplash.com/OS2WODdxy1A)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60 md:to-background/40" />
        <Link
          href="/"
          className="absolute left-8 top-8 z-20 flex items-center text-lg font-bold tracking-tight"
        >
          <Icons.logo className="mr-2 h-6 w-6" aria-hidden="true" />
          <span>{siteConfig.name}</span>
        </Link>
      </div>
      <main className="container absolute top-1/2 col-span-1 flex -translate-y-1/2 items-center md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
        {children}
      </main>
    </div>
  )
}
