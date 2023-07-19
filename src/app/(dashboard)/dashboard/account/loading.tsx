import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"

export default function AccountLoading() {
  return (
    <Shell variant="sidebar">
      <Header title="Account" description="Manage your account settings" size="sm" />
      <div className="grid gap-10 p-4 border rounded-lg">
        <div className="space-y-2">
          <Skeleton className="w-20 h-5" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-40 h-8" />
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-8 w-52" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-40 h-8" />
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-8 w-52" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-40 h-8" />
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-8 w-52" />
        </div>
      </div>
    </Shell>
  )
}
