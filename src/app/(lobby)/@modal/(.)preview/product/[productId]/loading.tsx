import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { DialogShell } from "@/components/dialog-shell"
import { PlaceholderImage } from "@/components/placeholder-image"

export default function ProductModalLoading() {
  return (
    <DialogShell className="flex flex-col gap-2 overflow-visible sm:flex-row">
      <Skeleton className="absolute right-10 top-4 size-4" />
      <PlaceholderImage ratio={16 / 9} className="rounded-none" isSkeleton />
      <div className="w-full space-y-8 p-6 sm:p-10">
        <div className="space-y-2.5">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton
              key={i}
              className={cn("h-4 w-full", i === 3 && "w-1/2")}
            />
          ))}
        </div>
      </div>
    </DialogShell>
  )
}
