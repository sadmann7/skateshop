import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function PageNotFound() {
  return (
    <Shell variant="centered">
      <ErrorCard
        title="Purchase not found"
        description="The purchase may be too far back in our records to retrieve"
        retryLink={`/dashboard/purchases`}
        retryLinkText="Go to Purchases"
      />
    </Shell>
  )
}