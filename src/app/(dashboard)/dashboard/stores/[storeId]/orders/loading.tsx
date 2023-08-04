import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return (
    <>
      <div className="grid gap-10 rounded-lg border p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-40" />
      </div>
    </>
  )
}