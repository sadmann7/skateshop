import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"

export default function CheckoutLoading() {
  return (
    <Shell>
      <PageHeader
        id="checkout-page-header"
        aria-labelledby="checkout-page-header-heading"
      >
        <PageHeaderHeading size="sm">Checkout</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Checkout with your cart items
        </PageHeaderDescription>
      </PageHeader>

      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          as="section"
          id={`store-${i}`}
          aria-labelledby={`store-${i}-heading`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-x-4 py-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-20" />
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent>
            <div className="flex flex-col gap-5">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="space-y-3">
                  <div className="flex flex-col items-start justify-between gap-4 xs:flex-row">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded">
                        <div className="flex h-full items-center justify-center bg-secondary">
                          <Icons.placeholder
                            className="h-4 w-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col gap-2 self-start text-sm">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between space-x-1 xs:w-auto xs:justify-normal">
                      <div className="flex items-center space-x-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-14" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </CardContent>
          <Separator className="mb-4" />
          <CardFooter className="justify-between space-x-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </CardFooter>
        </Card>
      ))}
    </Shell>
  )
}
