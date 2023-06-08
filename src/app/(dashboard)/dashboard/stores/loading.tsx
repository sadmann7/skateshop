import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export default function StoresLoading() {
  return (
    <Shell layout="dashboard">
      <Header title="Stores" description="Manage your stores." size="sm" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="h-28">
            <CardHeader>
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-4 w-4/5" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </Shell>
  )
}
