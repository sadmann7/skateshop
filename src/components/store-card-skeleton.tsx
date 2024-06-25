import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StoreCardSkeleton() {
  return (
    <Card className="relative h-full rounded-lg">
      <Skeleton className="absolute right-4 top-4 h-4 w-20 rounded-sm px-2 py-0.5" />
      <CardHeader>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-4 pt-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  )
}
