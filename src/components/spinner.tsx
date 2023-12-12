import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva("relative flex items-center justify-center", {
  variants: {
    variant: {
      default: "text-primary",
      secondary: "text-secondary",
      destructive: "text-destructive",
      warning: "text-yellow-500",
      success: "text-green-500",
    },
    size: {
      default: "h-8 w-8",
      sm: "h-6 w-6",
      lg: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ children, className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(spinnerVariants({ variant, size, className }))}
        {...props}
        ref={ref}
      >
        <i
          className="absolute h-full w-full animate-spinner-ease-spin rounded-full border-[3px] border-solid border-x-transparent border-b-current border-t-transparent"
          aria-hidden="true"
        />
        <i
          className="absolute h-full w-full animate-spinner-linear-spin rounded-full border-[3px] border-dotted border-x-transparent border-b-current border-t-transparent opacity-75"
          aria-hidden="true"
        />
        {children}
      </div>
    )
  }
)

Spinner.displayName = "Spinner"

export { Spinner }
