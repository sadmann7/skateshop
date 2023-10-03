"use client"

import { dashboardConfig } from "@/config/dashboard"
import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/layouts/main-nav"
import { MobileNav } from "@/components/layouts/mobile-nav"

export function Navs() {
  return (
    <>
      <MainNav items={siteConfig.mainNav} />
      <MobileNav
        mainNavItems={siteConfig.mainNav}
        sidebarNavItems={dashboardConfig.sidebarNav}
      />
    </>
  )
}
