import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryCardSkeleton() {
  return (
    <Card className="flex size-full flex-col gap-4 rounded-md p-5">
      <div className="flex flex-1 flex-col space-y-1.5">
        <Skeleton className="h-6 w-20" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <Skeleton className="h-4 w-20" />
    </Card>
  )
}
