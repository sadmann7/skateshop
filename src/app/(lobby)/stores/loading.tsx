import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Shell } from "@/components/shells/shell"

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
            <Card key={i} className="h-full">
              <AspectRatio ratio={21 / 9}>
                <Skeleton className="h-full w-full" />
              </AspectRatio>
              <CardHeader className="flex-1">
                <Skeleton className="h-5 w-3/5" />
                <Skeleton className="h-4 w-4/5" />
              </CardHeader>
              <CardContent className="mt-5">
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  )
}
