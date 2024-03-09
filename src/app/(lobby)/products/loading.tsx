import { Skeleton } from "@/components/ui/skeleton"
import { Shell } from "@/components/shell"
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton"

export default function ProductsLoading() {
  return (
    <Shell>
      <div className="space-y-2">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </Shell>
  )
}
