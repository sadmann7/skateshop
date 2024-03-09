import { ErrorCard } from "@/components/cards/error-card"
import { Shell } from "@/components/shell"

interface ProductNotFoundProps {
  params: {
    storeId: string
  }
}

export default function ProductNotFound({ params }: ProductNotFoundProps) {
  const storeId = Number(params.storeId)

  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Product not found"
        description="The product may have expired or you may have already updated your product"
        retryLink={`/dashboard/stores/${storeId}/products`}
        retryLinkText="Go to Products"
      />
    </Shell>
  )
}
