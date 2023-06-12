import { type Product } from "@/db/schema"

import { toTitleCase } from "@/lib/utils"
import { Header } from "@/components/header"
import { Products } from "@/components/products"
import { Shell } from "@/components/shell"

interface ProductCateogryPageProps {
  params: {
    category: Product["category"]
  }
  searchParams: {
    limit?: string
    cursor?: string
    sort?: keyof Product
    order?: "asc" | "desc"
    price?: string
    storeIds?: string[]
  }
}

export function generateMetadata({ params }: ProductCateogryPageProps) {
  return {
    title: toTitleCase(params.category),
    description: `Buy products from the ${params.category} category`,
  }
}

export default function ProductCateogryPage({
  params,
}: ProductCateogryPageProps) {
  const { category } = params

  return (
    <Shell>
      <Header title={toTitleCase(category)} description={`Buy ${category}`} />
      <Products category={category} />
    </Shell>
  )
}
