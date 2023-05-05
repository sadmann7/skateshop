import { Skeleton } from "@/components/ui/skeleton"

export default function StoresLoading() {
  return (
    <div className="container grid w-full items-center space-y-14 pb-8 pt-6 md:py-10">
      <div className="grid gap-2.5">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <div className="grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video h-40" />
        ))}
      </div>
    </div>
  )
}
