import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"

export default function BillingLoading() {
  return (
    <Shell variant="sidebar" as="div">
      <Header
        title="Billing"
        description="Manage your billing and subscription"
        size="sm"
      />
      <section
        id="billing-info"
        aria-labelledby="billing-info-heading"
        className="space-y-5"
      >
        <h2 className="text-xl font-semibold sm:text-2xl">Billing info</h2>
        <Card className="grid gap-4 p-6">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </Card>
      </section>
      <section
        id="subscription-plans"
        aria-labelledby="subscription-plans-heading"
        className="space-y-5 pb-2.5"
      >
        <h2 className="text-xl font-semibold sm:text-2xl">
          Subscription plans
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className={cn(
                "flex flex-col",
                i === 2 && "lg:col-span-2 xl:col-span-1"
              )}
            >
              <CardHeader>
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="grid flex-1 place-items-start gap-6">
                <Skeleton className="h-7 w-16" />
                <div className="w-full space-y-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Skeleton className="h-6 w-1/2" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </Shell>
  )
}
