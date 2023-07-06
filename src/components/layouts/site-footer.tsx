import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/layouts/theme-toggle"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between space-y-1 py-5 md:h-16 md:flex-row md:py-0">
        <div className="text-center text-sm leading-loose text-muted-foreground">
          Built by{" "}
          <a
            aria-label="Kickflip tutorial on YouTube"
            href="https://twitter.com/sadmann17"
            target="_blank"
            rel="noreferrer"
            className="font-semibold transition-colors hover:text-slate-950 dark:hover:text-slate-200"
          >
            Sadman
          </a>
          .
        </div>
        <div className="flex items-center space-x-1">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div
              className={cn(
                buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })
              )}
            >
              <Icons.gitHub className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}
