import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function StoreNotFound() {
  return (
    <Shell variant="centered">
      <ErrorCard
        title="Store not found"
        description="The store may have expired or you may have already updated your store"
        retryLink="/dashboard/stores"
        retryLinkText="Go to Stores"
      />
    </Shell>
  )
}
