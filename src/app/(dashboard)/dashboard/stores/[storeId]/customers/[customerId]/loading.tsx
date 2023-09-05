import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTableLoading } from "@/components/data-table/data-table-loading"

export default function OrderLoading() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <DataTableLoading columnCount={6} searchableFieldCount={0} />
      </CardContent>
    </Card>
  )
}
