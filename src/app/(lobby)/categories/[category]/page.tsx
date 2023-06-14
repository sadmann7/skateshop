import { type Product } from "@/db/schema"

import { toTitleCase } from "@/lib/utils"
import { Header } from "@/components/header"
import { Products } from "@/components/products"
import { Shell } from "@/components/shell"
import { getProductsAction } from "@/app/_actions/product"
import { getStoresAction } from "@/app/_actions/store"

interface CategoryPageProps {
  params: {
    category: Product["category"]
  }
  searchParams: {
    page?: string
    per_page?: string
    sort?: `${keyof Product}-${"asc" | "desc"}`
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
  const { page, per_page, sort, price_range, store_ids } = searchParams

  const limit = per_page ? parseInt(per_page) : 8
  const offset = page ? (parseInt(page) - 1) * limit : 0

  const productsTransaction = await getProductsAction({
    category,
    limit,
    offset,
    sort,
    price_range,
    store_ids,
  })

  const pageCount = Math.ceil(productsTransaction.total / limit)

  const allStores = await getStoresAction({
    sort: "name-asc",
  })

  return (
    <Shell>
      <Header title={toTitleCase(category)} description={`Buy ${category}`} />
      <Products
        products={productsTransaction.items}
        pageCount={pageCount}
        stores={allStores}
      />
    </Shell>
  )
}
