import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

export function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden rounded-sm">
      <CardHeader className="border-b p-0">
        <AspectRatio ratio={4 / 3}>
          <div
            aria-label="Placeholder"
            role="img"
            aria-roledescription="placeholder"
            className="flex h-full w-full items-center justify-center bg-secondary"
          >
            <Icons.placeholder
              className="h-9 w-9 text-muted-foreground"
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
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  )
}
