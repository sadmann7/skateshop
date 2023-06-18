import { redirect } from "next/navigation"

interface ProductModalPageProps {
  params: {
    productId: string
  }
}

export default function ProductModalPage({ params }: ProductModalPageProps) {
  const productId = Number(params.productId)

  redirect(`/product/${productId}`)
}
