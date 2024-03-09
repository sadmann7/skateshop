import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton"

export default function ProductLoading() {
  return (
    <Shell>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-14" />
        <Skeleton className="h-6 w-14" />
        <Skeleton className="h-6 w-14" />
      </div>
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <div className="w-full md:w-1/2">
          <div className="flex flex-col gap-2">
            <div
              aria-label="Placeholder"
              role="img"
              aria-roledescription="placeholder"
              className="flex aspect-square h-full flex-1 items-center justify-center bg-secondary"
            >
              <Icons.placeholder
                className="size-9 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div className="flex w-full items-center justify-center gap-2">
              <Skeleton className="size-7 rounded-none" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-square size-full max-w-[100px] rounded-none"
                />
              ))}
              <Skeleton className="size-7 rounded-none" />
            </div>
          </div>
        </div>
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-14" />
          </div>
          <Separator className="my-4" />
          <Skeleton className="h-4 w-20" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-6" />
          </div>
          <div className="flex max-w-[260px] items-center space-x-2.5">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <Separator className="my-5" />
          <div className="space-y-6">
            <div className="flex items-center justify-between space-x-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="size-4" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={cn("h-4 w-full", i === 3 && "w-1/2")}
                />
              ))}
            </div>
          </div>
          <Separator className="md:hidden" />
        </div>
      </div>
      <div className="space-y-6 overflow-hidden">
        <Skeleton className="h-7 w-1/4" />
        <ScrollArea orientation="horizontal" className="pb-3.5">
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} className="min-w-[260px]" />
            ))}
          </div>
        </ScrollArea>
      </div>
    </Shell>
  )
}
