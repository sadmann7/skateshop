// Original source: https://github.com/openstatusHQ/openstatus/blob/main/apps/web/src/app/app/%5BworkspaceSlug%5D/(dashboard)/monitors/%5Bid%5D/_components/metrics-card.tsx

import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const metricsCardVariants = cva("flex flex-col rounded-lg border px-3 py-2", {
  variants: {
    variant: {
      default: "border-transparent",
      positive:
        "border-green-500/20 bg-green-500/10 [&>p]:text-green-600 dark:[&>p]:text-green-400",
      negative:
        "border-red-500/20 bg-red-500/10 [&>p]:text-red-600 dark:[&>p]:text-red-400",
      neutral: "border-border/80 bg-muted/30",
      warning:
        "border-yellow-500/20 bg-yellow-500/10 [&>p]:text-yellow-600 dark:[&>p]:text-yellow-400",
      info: "border-blue-500/20 bg-blue-500/10 [&>p]:text-blue-600 dark:[&>p]:text-blue-400",
    },
    fading: {
      true: "opacity-70",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface MetricsCardProps extends VariantProps<typeof metricsCardVariants> {
  title: string
  value?: number
  suffix: string
  /**
   * Value indicating the change in the metric compared to the previous period.
   * e.g. 1 means no change, 2 means a 100% increase, 0.5 means a 50% decrease.
   */
  delta?: number
  /**
   * If true, the card will have a fading effect. Useful for cards that are
   * not yet ready to be displayed or data is empty.
   */
  fading?: boolean
  className?: string
}

export function MetricsCard({
  title,
  value,
  suffix,
  delta,
  className,
  variant,
  fading,
}: MetricsCardProps) {
  return (
    <div className={cn(metricsCardVariants({ variant, fading, className }))}>
      <p className="text-sm font-light uppercase text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-1 items-center gap-2">
        <p className="flex">
          <code className="mr-1 font-mono text-xl font-semibold empty:mr-0">
            {typeof value === "number"
              ? new Intl.NumberFormat().format(value)
              : null}
          </code>
          <span className="self-center text-xs text-muted-foreground">
            {suffix}
          </span>
        </p>
        {delta || delta === 0 ? <DeltaBadge value={delta} /> : null}
      </div>
    </div>
  )
}

const badgeVariants = cva("", {
  variants: {
    variant: {
      default: "border-border",
      increase:
        "border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/10",
      decrease:
        "border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/10",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface DeltaBadgeProps extends VariantProps<typeof badgeVariants> {
  value: number
  decimal?: number
}

function DeltaBadge({ value, decimal = 1 }: DeltaBadgeProps) {
  const round = Math.pow(10, decimal) // 10^1 = 10 (1 decimal), 10^2 = 100 (2 decimals), etc.
  const percentage = Math.round((value - 1) * round) / round

  const variant: VariantProps<typeof badgeVariants>["variant"] =
    percentage > 0 ? "increase" : percentage < 0 ? "decrease" : "default"

  return (
    <Badge variant="secondary" className={badgeVariants({ variant })}>
      <span>
        {percentage > 0 ? <ChevronUpIcon className="mr-0.5 size-3" /> : null}
        {percentage < 0 ? <ChevronDownIcon className="mr-0.5 size-3" /> : null}
      </span>
      {Math.abs(percentage)}%
    </Badge>
  )
}
