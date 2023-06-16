import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const shellVariants = cva("pb-8 pt-6 md:py-8", {
  variants: {
    layout: {
      default: "container grid items-center gap-8",
      dashboard: "grid items-center gap-8",
      auth: "mx-auto flex min-h-screen items-center justify-center",
    },
  },
  defaultVariants: {
    layout: "default",
  },
})

interface ShellProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    VariantProps<typeof shellVariants> {
  children: React.ReactNode
}

export function Shell({ children, layout, className, ...props }: ShellProps) {
  return (
    <section className={cn(shellVariants({ layout, className }))} {...props}>
      {children}
    </section>
  )
}
