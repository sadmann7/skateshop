import { Skeleton } from "@/components/ui/skeleton"
import { Shell } from "@/components/shell"
import { StoreCardSkeleton } from "@/components/skeletons/store-card-skeleton"

export default function StoresLoading() {
  return (
    <Shell>
      <div className="space-y-2">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex flex-col space-y-6">
        <Skeleton className="h-9 w-14" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <StoreCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </Shell>
  )
}
