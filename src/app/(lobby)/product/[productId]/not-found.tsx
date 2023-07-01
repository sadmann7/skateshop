import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shell"

export default function ProductNotFound() {
  return (
    <Shell className="mt-20 max-w-md justify-center">
      <ErrorCard
        title="Product not found"
        description="The product may have expired or you may have already updated your product"
        retryLink="/"
        retryLinkText="Go to Home"
      />
    </Shell>
  )
}
