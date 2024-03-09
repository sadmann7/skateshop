import "@/styles/mdx.css"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Shell } from "@/components/shell"

export default function PostLoading() {
  return (
    <Shell as="article" variant="markdown">
      <Skeleton className="absolute left-[-200px] top-14 hidden h-9 w-28 xl:inline-block" />
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-6 w-full" />
        <div className="flex items-center space-x-2">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      </div>
      <AspectRatio ratio={16 / 9}>
        <Skeleton className="size-full" />
      </AspectRatio>
      <Skeleton className="h-6 w-40" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-28" />
      </div>
      <Skeleton className="mx-auto mt-4 h-6 w-28" />
    </Shell>
  )
}
