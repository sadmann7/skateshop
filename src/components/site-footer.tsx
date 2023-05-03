import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="w-full bg-background">
      <div className="container flex flex-col items-center justify-between space-y-1 border-t py-5 sm:h-16 sm:flex-row sm:py-0">
        <div className="text-center text-sm text-muted-foreground sm:text-base">
          Do a{" "}
          <a
            aria-label="Kickflip tutorial on YouTube"
            href="https://www.youtube.com/watch?v=kpVhjV-I6nM"
            target="_blank"
            rel="noreferrer"
            className="font-semibold transition-colors hover:text-slate-950 dark:hover:text-slate-200"
          >
            kickflip
          </a>
        </div>
        <div className="flex items-center space-x-1">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "ghost",
                }),
                "w-9 px-0"
              )}
            >
              <Icons.gitHub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  );
}
