import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export default function AccountLoading() {
  return (
    <Shell layout="dashboard">
      <Header title="Stores" description="Manage your stores." size="sm" />
      <div className="grid gap-10 rounded-lg border p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-8 w-52" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-8 w-52" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-8 w-52" />
        </div>
      </div>
    </Shell>
  )
}
