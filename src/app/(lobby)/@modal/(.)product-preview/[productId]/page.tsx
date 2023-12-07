interface ProductModalPageProps {
  params: {
    productId: string
  }
}

export default function ProductModalPage({ params }: ProductModalPageProps) {
  const productId = Number(params.productId)

  return (
    <div>
      <div>Product: {productId}</div>
    </div>
  )
}
