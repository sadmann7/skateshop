import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function ProductNotFound() {
  return (
    <Shell variant="centered">
      <ErrorCard
        title="Product not found"
        description="The product may have expired or you may have already updated your product"
        retryLink="/"
        retryLinkText="Go to Home"
      />
    </Shell>
  )
}
