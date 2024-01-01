import { type FeaturedProductsPromise } from "@/lib/fetchers/product"
import { ProductCard } from "@/components/cards/product-card"

interface FeaturedProductsProps {
  productsPromise: FeaturedProductsPromise
}

export async function FeaturedProducts({
  productsPromise,
}: FeaturedProductsProps) {
  const products = await productsPromise

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  )
}
