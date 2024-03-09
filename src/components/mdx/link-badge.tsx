import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

interface LinkBadgeProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode
}

export function LinkBadge({ children, className, ...props }: LinkBadgeProps) {
  return (
    <Link
      {...props}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "rounded-md border border-border bg-muted px-1.5 py-0.5 text-sm no-underline hover:bg-muted/90",
        className
      )}
    >
      {children}
    </Link>
  )
}
