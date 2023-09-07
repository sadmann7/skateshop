import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface FormLoadingProps {
  showSecondaryButton?: boolean
  fieldGroupCount?: number
  inputHeights?: number[]
}

export function FormLoading({
  showSecondaryButton = false,
  fieldGroupCount = 2,
  inputHeights,
}: FormLoadingProps) {
  const heights = Array.from({ length: fieldGroupCount }).map(
    (_, i) => `h-${inputHeights?.[i]}`
  )

  return (
    <div className="grid gap-5">
      {Array.from({ length: fieldGroupCount }).map((_, i) => (
        <div key={i} className="space-y-2.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className={cn("w-full", heights[i])} />
        </div>
      ))}
      <div className="flex items-center justify-between space-x-2.5">
        <Skeleton className="h-9 w-full" />
        {showSecondaryButton && <Skeleton className="h-9 w-full" />}
      </div>
    </div>
  )
}
