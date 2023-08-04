import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

interface OrderNotFoundProps {
  params: {
    storeId: string
  }
}


export default function PageNotFound({ params }: OrderNotFoundProps) {
  const storeId = Number(params.storeId)
  return (
    <Shell variant="centered">
      <ErrorCard
        title="Purchase not found"
        description="The purchase may be too far back in our records to retrieve"
        retryLink={`/dashboard/stores/${storeId}/orders`}
        retryLinkText="Go to Purchases"
      />
    </Shell>
  )
}