import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shell"

interface ProductNotFoundProps {
  params: {
    storeId: string
  }
}

export default function ProductNotFound({ params }: ProductNotFoundProps) {
  const storeId = Number(params.storeId)

  return (
    <Shell className="mt-20 max-w-md justify-center">
      <ErrorCard
        title="Product not found"
        description="The product may have expired or you may have already updated your product"
        retryLink={`/dashboard/stores/${storeId}/products`}
        retryLinkText="Go to products"
      />
    </Shell>
  )
}
