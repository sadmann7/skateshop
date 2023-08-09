import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function ProductNotFound() {
  return (
    <Shell className="mt-20 max-w-md justify-center">
      <ErrorCard
        title="Store not found"
        description="The Store may have been deleted"
        retryLink="/"
        retryLinkText="Go to Home"
      />
    </Shell>
  )
}