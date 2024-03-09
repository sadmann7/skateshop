import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"

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
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-6 w-10" />
            <Skeleton className="h-6 w-14" />
          </div>
          <Separator className="my-1.5" />
          <div className="grid gap-4 sm:max-w-[240px]">
            <div className="grid space-y-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-9 w-full" />
            </div>
            <Skeleton className="h-9 w-full" />
          </div>
          <Separator className="mb-2.5 mt-5" />
          <div className="flex items-center">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="ml-auto size-4" />
          </div>
          <Separator className="mt-2.5" />
        </div>
      </div>
      <div className="overflow-hidden md:pt-6">
        <Skeleton className="h-9 w-14" />
        <div className="overflow-x-auto pb-2 pt-6">
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="min-w-[260px] rounded-sm">
                <CardHeader className="border-b p-0">
                  <AspectRatio ratio={4 / 3}>
                    <div className="flex h-full items-center justify-center bg-secondary">
                      <Icons.placeholder
                        className="size-9 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  </AspectRatio>
                </CardHeader>
                <CardContent className="grid gap-2.5 p-4">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
                <CardFooter className="p-4">
                  <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-between">
                    <Skeleton className="h-8 w-full rounded-sm" />
                    <Skeleton className="h-8 w-full rounded-sm" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}
