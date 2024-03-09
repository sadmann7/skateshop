import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"

export default function PurchaseLoading() {
  return (
    <Shell variant="sidebar">
      <PageHeader className="gap-2">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-40" />
      </PageHeader>
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="flex w-full flex-col space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md bg-muted px-4 py-2.5 hover:bg-muted/70"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1 self-start">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-2.5 w-10" />
                  </div>
                </div>
                <div className="flex flex-col space-y-2 font-medium">
                  <Skeleton className="ml-auto h-4 w-12" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </Shell>
  )
}
