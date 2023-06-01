import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="container grid w-full items-center gap-10 pb-10 pt-6 md:py-10">
      <div className="grid max-w-4xl gap-4 pt-16 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  )
}
