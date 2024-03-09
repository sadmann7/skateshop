import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryCardSkeleton() {
  return (
    <Card className="relative flex size-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent transition-colors hover:bg-muted/50">
      <CardHeader>
        <div className="grid size-11 place-items-center rounded-full border-2">
          <Skeleton className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-1.5">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  )
}
