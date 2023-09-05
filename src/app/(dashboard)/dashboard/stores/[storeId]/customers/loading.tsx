import { Skeleton } from "@/components/ui/skeleton"
import { DataTableLoading } from "@/components/data-table/data-table-loading"

export default function CustomersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-7 w-full xs:w-[300px]" />
      </div>
      <DataTableLoading columnCount={5} filterableFieldCount={0} />
    </div>
  )
}
