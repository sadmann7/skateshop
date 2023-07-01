import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shell"

export default function StoreNotFound() {
  return (
    <Shell className="mt-20 max-w-md justify-center">
      <ErrorCard
        title="Store not found"
        description="The store may have expired or you may have already updated your store"
        retryLink="/dashboard/stores"
        retryLinkText="Go to Stores"
      />
    </Shell>
  )
}
