import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryCardSkeleton() {
  return (
    <Card className="flex size-full flex-col bg-muted p-4">
      <Skeleton className="size-10" />
      <div className="flex flex-1 flex-col space-y-1.5 pb-4 pt-10">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-4 w-20" />
    </Card>
  )
}
