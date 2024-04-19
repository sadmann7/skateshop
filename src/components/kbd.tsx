import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const kbdVariants = cva(
  "select-none rounded border px-1.5 py-0.5 font-mono text-xs font-medium shadow-sm disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent",
        outline: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface KbdProps
  extends React.ComponentPropsWithoutRef<"kbd">,
    VariantProps<typeof kbdVariants> {
  /**
   * The title of the `abbr` element inside the `kbd` element.
   * @default undefined
   * @type string | undefined
   * @example title="Command"
   */
  title?: string
}

const Kbd = React.forwardRef<HTMLUnknownElement, KbdProps>(
  ({ children, className, title, variant, ...props }, ref) => {
    return (
      <kbd
        className={cn(kbdVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        <abbr title={title} className="no-underline">
          {children}
        </abbr>
      </kbd>
    )
  }
)
Kbd.displayName = "Kbd"

export { Kbd }
