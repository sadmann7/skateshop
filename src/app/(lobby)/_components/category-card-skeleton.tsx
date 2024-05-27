import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryCardSkeleton() {
  return (
    <Card className="h-full rounded-lg">
      <CardHeader className="flex-1">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>
      <CardContent className="pt-2">
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  )
}
