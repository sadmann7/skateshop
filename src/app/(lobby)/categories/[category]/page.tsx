import { type Product } from "@/db/schema"

import { toTitleCase } from "@/lib/utils"
import { Header } from "@/components/header"
import { Products } from "@/components/products"
import { Shell } from "@/components/shell"
import { getProductsAction } from "@/app/_actions/product"

interface CategoryPageProps {
  params: {
    category: Product["category"]
  }
  searchParams: {
    page?: string
    per_page?: string
    sort?: keyof Pick<Product, "createdAt" | "price" | "rating" | "name">
    order?: "asc" | "desc"
    price_range?: string
    store_ids?: string
  }
}

export function generateMetadata({ params }: CategoryPageProps) {
  return {
    title: toTitleCase(params.category),
    description: `Buy products from the ${params.category} category`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = params
  const { page, per_page, sort, order, store_ids } = searchParams

  const limit = per_page ? parseInt(per_page) : 8
  const offset =
    page && per_page ? (parseInt(page) - 1) * parseInt(per_page) : 0
  const price_range = searchParams.price_range?.split("-").map(Number)

  const data = await getProductsAction({
    category,
    limit,
    offset,
    sort,
    order,
    price_range: { min: price_range?.[0], max: price_range?.[1] },
    store_ids: store_ids?.split("-").map(Number),
  })

  const pageCount = Math.ceil(data.total / limit)

  return (
    <Shell>
      <Header title={toTitleCase(category)} description={`Buy ${category}`} />
      <Products data={data.items} pageCount={pageCount} />
    </Shell>
  )
}
