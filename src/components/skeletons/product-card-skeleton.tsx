import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PlaceholderImage } from "@/components/placeholder-image"

interface ProductCardSkeletonProps
  extends React.ComponentPropsWithoutRef<typeof Card> {}

export function ProductCardSkeleton({
  className,
  ...props
}: ProductCardSkeletonProps) {
  return (
    <Card
      className={cn("h-full overflow-hidden rounded-sm", className)}
      {...props}
    >
      <CardHeader className="border-b p-0">
        <AspectRatio ratio={4 / 3}>
          <PlaceholderImage className="rounded-none" isSkeleton asChild />
        </AspectRatio>
      </CardHeader>
      <CardContent className="space-y-2.5 p-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/6" />
      </CardContent>
      <CardFooter className="space-x-2 p-4 pt-1">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="size-8 shrink-0" />
      </CardFooter>
    </Card>
  )
}
