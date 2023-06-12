import * as React from "react"

import { cn } from "@/lib/utils"

interface ShellProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children: React.ReactNode
  layout?: "site" | "dashboard"
}

export function Shell({
  children,
  layout = "site",
  className,
  ...props
}: ShellProps) {
  return (
    <section
      className={cn(
        "grid items-center gap-8 pb-8 pt-6 md:py-8",
        layout === "site" && "container",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}
