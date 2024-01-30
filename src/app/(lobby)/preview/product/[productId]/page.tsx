import { redirect } from "next/navigation"

interface ProductPreviewPageProps {
  params: {
    productId: string
  }
}

export default function ProductPreviewPage({
  params,
}: ProductPreviewPageProps) {
  const productId = Number(params.productId)

  redirect(`/product/${productId}`)
}
