import { CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PlaceholderImage } from "@/components/placeholder-image"

export function PostCardSkeleton() {
  return (
    <article className="space-y-4">
      <PlaceholderImage />
      <div className="space-y-2">
        <CardHeader className="space-y-2.5 p-0">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </CardHeader>
        <Skeleton className="h-3 w-1/4" />
      </div>
    </article>
  )
}
